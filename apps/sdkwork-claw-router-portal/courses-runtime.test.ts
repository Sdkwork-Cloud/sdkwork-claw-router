import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import type { ClawRouterAppSdkClient } from "./packages/sdkwork-claw-router-commons/src/sdk-clients.ts";
import {
  COURSE_CATALOG,
  COURSE_CONTENT_SNAPSHOT_SOURCE,
  buildBilibiliEmbedUrl,
  deriveCourseCatalogViewModel,
  deriveCourseDetailView,
  deriveCourseEngagementMetrics,
  deriveCoursePlaylist,
  filterCoursesForCatalog,
  formatCourseCount,
  type CourseCatalogFilters,
} from "./packages/sdkwork-claw-router-courses/src/courseCatalog.ts";
import {
  normalizeCourseCatalogPayload,
  normalizeCourseDetailPayload,
  selectCourseLesson,
  submitCourseApplication,
  uploadCourseApplicationVideo,
} from "./packages/sdkwork-claw-router-courses/src/courseService.ts";

function mediaResource(url: string, kind: "image" | "video" = "image") {
  return {
    kind,
    source: url.startsWith("data:") ? "data_url" : "external_url",
    url,
    publicUrl: url,
  };
}

test("course content snapshot metadata is explicit and release-bound", () => {
  assert.deepEqual(COURSE_CONTENT_SNAPSHOT_SOURCE, {
    sourceLabel: "Curated course content snapshot",
    sourceDescription: "Derived from curated course, lesson, relation, and reaction seed content.",
    observedAt: "2026-05-03",
    sourceTables: [
      "content_course",
      "content_course_section",
      "content_course_lesson",
      "content_course_relation",
      "content_reaction",
    ],
  });
});

test("course catalog filters are pure case-insensitive and whitespace tolerant", () => {
  const filters: CourseCatalogFilters = {
    level: "Advanced",
    category: "  AI Coding  ",
    searchQuery: "  codex  ",
  };
  const filtered = filterCoursesForCatalog(COURSE_CATALOG, filters);

  assert.deepEqual(filtered.map((course) => course.id), ["c2"]);
  assert.notEqual(filtered, COURSE_CATALOG);
  assert.deepEqual(COURSE_CATALOG.map((course) => course.id), ["c1", "c2", "c3", "c4", "c5", "c6"]);
});

test("course seed catalog is focused on AI coding and AI creation learning", () => {
  const categories = new Set(COURSE_CATALOG.map((course) => course.category));
  const combinedText = COURSE_CATALOG
    .flatMap((course) => [course.title, course.description, course.content ?? "", ...course.tags])
    .join("\n");

  assert.ok(categories.has("AI Coding"));
  assert.ok(categories.has("\u5373\u68a6 AI \u56fe\u7247\u5236\u4f5c"));
  assert.ok(categories.has("\u5373\u68a6 AI \u89c6\u9891\u5236\u4f5c"));
  assert.match(combinedText, /Claude Code/u);
  assert.match(combinedText, /Codex/u);
  assert.match(combinedText, /\u5373\u68a6/u);
  assert.match(combinedText, /\u56fe\u7247\u5236\u4f5c/u);
  assert.match(combinedText, /\u89c6\u9891\u5236\u4f5c/u);
});

test("course catalog view model derives categories levels and filtered rows", () => {
  const view = deriveCourseCatalogViewModel({
    catalog: COURSE_CATALOG,
    filters: {
      level: "All",
      category: "All",
      searchQuery: " security ",
    },
  });

  assert.equal(view.snapshotSource.observedAt, "2026-05-03");
  assert.equal(view.categoryOptions[0].id, "All");
  assert.equal(view.categoryOptions[0].count, COURSE_CATALOG.length);
  assert.deepEqual(view.levelOptions.map((level) => level.id), ["All", "Beginner", "Intermediate", "Advanced"]);
  assert.deepEqual(view.filteredCourses.map((course) => course.id), ["c2", "c6"]);
  assert.equal(view.heading, "Featured Courses");
  assert.equal(view.resultCount, 2);
});

test("course detail view resolves stable playlist related cards reactions and comments", () => {
  const detail = deriveCourseDetailView(COURSE_CATALOG, "c1");

  assert.notEqual(detail, null);
  assert.equal(detail?.course.id, "c1");
  assert.equal(detail?.snapshotSource.sourceLabel, "Curated course content snapshot");
  assert.equal(detail?.info.publishedAt, "2026-05-03");
  assert.equal(detail?.info.reactions.likes, formatCourseCount(155));
  assert.equal(detail?.video.embedUrl, "https://player.bilibili.com/player.html?bvid=BV18VX2ByEfA&page=1&high_quality=1&danmaku=0");
  assert.equal(detail?.playlist.totalLessons, detail?.course.lessonsCount);
  assert.equal(detail?.playlist.chapters[0].lessons[0].active, true);
  assert.deepEqual(detail?.relatedCourses.slice(0, 2).map((course) => course.id), ["c2", "c6"]);
  assert.equal(detail?.relatedCourses.some((course) => course.id === "c1"), false);
  assert.equal(detail?.comments.totalCount, 3);
  assert.deepEqual(detail?.comments.items.map((comment) => comment.level), [5, 4, 3]);
});

test("course helpers reject unsafe video ids and handle empty states safely", () => {
  assert.equal(buildBilibiliEmbedUrl("BV18VX2ByEfA"), "https://player.bilibili.com/player.html?bvid=BV18VX2ByEfA&page=1&high_quality=1&danmaku=0");
  assert.equal(buildBilibiliEmbedUrl("javascript:alert(1)"), null);
  assert.equal(buildBilibiliEmbedUrl("BV18VX2ByEfA&autoplay=1"), null);
  assert.equal(deriveCourseDetailView(COURSE_CATALOG, "missing"), null);

  const playlist = deriveCoursePlaylist({ ...COURSE_CATALOG[0], lessonsCount: 0 });
  assert.deepEqual(playlist, { totalLessons: 0, currentLessonNumber: 0, chapters: [] });

  const metrics = deriveCourseEngagementMetrics({
    ...COURSE_CATALOG[0],
    studentsCount: 1_234_567,
    lessonsCount: 12,
    engagement: undefined,
  });
  assert.deepEqual(metrics, {
    views: "1.2M",
    likes: "146.3K",
    saves: "40.0K",
    shares: "12.6K",
    discussions: "5.1K",
  });
  assert.equal(formatCourseCount(1_200_000_000), "1.2B");
  assert.equal(formatCourseCount(1_200_000), "1.2M");
  assert.equal(formatCourseCount(12_000), "12.0K");
  assert.equal(formatCourseCount(12), "12");
});

test("course API service normalizes live SDK payloads", () => {
  const catalog = normalizeCourseCatalogPayload({
    code: "2000",
    data: {
      items: [{
        id: "c1",
        contentId: 30001001,
        courseCode: "c1",
        title: "\u98de\u4e66 CLI \u4e0e Claude Code/Codex \u8fdc\u7a0b\u5f00\u53d1\u5b9e\u6218",
        description: "\u57fa\u4e8e Bilibili \u7684\u98de\u4e66 CLI\u3001Claude Code\u3001Codex \u8bfe\u7a0b\u3002",
        thumbnail: mediaResource("https://example.com/course.jpg"),
        instructor: {
          name: "SDKWork Academy",
          avatar: mediaResource("https://example.com/avatar.jpg"),
          title: "AI Coding Curriculum Team",
          bio: "Curates practical AI coding courses.",
        },
        durationText: "3h 20m",
        lessonsCount: 3,
        ratingScore: 4.9,
        studentsCount: 3851,
        level: 1,
        levelLabel: "Beginner",
        category: "ai-coding",
        categoryLabel: "AI Coding",
        tags: ["Claude Code", "Codex", "AI Coding"],
        externalBvid: "BV18VX2ByEfA",
        content: "Start with Claude Code and remote development, then connect Codex and team workflows.",
        priceAmount: null,
        currency: "CNY",
        isCollection: true,
        publishedAt: "2026-05-12T09:00:00Z",
        commentCount: 3,
        engagement: {
          views: 3851,
          likes: 155,
          saves: 22,
          shares: 11,
          discussions: 3,
          studentsCount: 3851,
        },
      }],
      page: 1,
      size: 100,
      totalElements: 1,
    },
  });

  assert.equal(catalog.courses[0].id, "c1");
  assert.equal(catalog.courses[0].category, "AI Coding");
  assert.equal(catalog.courses[0].engagement?.likes, 155);
  assert.deepEqual(catalog.categories.map((category) => category.code), ["ai-coding"]);

  const detail = normalizeCourseDetailPayload({
    code: "2000",
    data: {
      ...catalog.courses[0],
      durationText: catalog.courses[0].duration,
      ratingScore: catalog.courses[0].rating,
      externalBvid: catalog.courses[0].bilibiliBvid,
      categoryLabel: catalog.courses[0].category,
      sections: [{
        id: "30003001",
        sectionNo: 1,
        title: "Core Course",
        lessons: [{
          id: "30004001",
          number: 1,
          title: "Course Introduction and Development Setup",
          durationText: "12:00",
        }],
      }],
      relatedCourses: [],
      source: {
        sourceLabel: "Live course data",
        sourceDescription: "Derived from Java-compatible course tables.",
        observedAt: "2026-05-12 09:00:00",
        sourceTables: ["content_course", "content_course_lesson"],
      },
    },
  });

  assert.equal(detail?.detail.snapshotSource.sourceLabel, "Live course data");
  assert.equal(detail?.detail.playlist.chapters[0].lessons[0].title, "Course Introduction and Development Setup");
  assert.equal(detail?.detail.info.reactions.likes, formatCourseCount(155));
});

test("course detail lesson selection switches the active lesson video", () => {
  const detail = normalizeCourseDetailPayload({
    code: "2000",
    data: {
      id: "c1",
      contentId: 30001001,
      courseCode: "c1",
      title: "\u98de\u4e66 CLI \u4e0e Claude Code/Codex \u8fdc\u7a0b\u5f00\u53d1\u5b9e\u6218",
      description: "\u57fa\u4e8e Bilibili \u7684\u98de\u4e66 CLI\u3001Claude Code\u3001Codex \u8bfe\u7a0b\u3002",
      thumbnail: mediaResource("https://example.com/course.jpg"),
      instructor: {
        name: "SDKWork Academy",
        avatar: mediaResource("https://example.com/avatar.jpg"),
        title: "AI Coding Curriculum Team",
        bio: "Curates practical AI coding courses.",
      },
      durationText: "3h 20m",
      lessonsCount: 2,
      ratingScore: 4.9,
      studentsCount: 3851,
      level: 1,
      levelLabel: "Beginner",
      category: "ai-coding",
      categoryLabel: "AI Coding",
      tags: ["Claude Code", "Codex", "AI Coding"],
      externalBvid: "BV18VX2ByEfA",
      content: "Start with Claude Code and remote development.",
      currency: "CNY",
      isCollection: true,
      publishedAt: "2026-05-12T09:00:00Z",
      commentCount: 3,
      engagement: {
        views: 3851,
        likes: 155,
        saves: 22,
        shares: 11,
        discussions: 3,
        studentsCount: 3851,
      },
      sections: [{
        id: "30003001",
        sectionNo: 1,
        title: "Core Course",
        lessons: [{
          id: "30004001",
          lessonNo: 1,
          number: 1,
          title: "Course Introduction and Development Setup",
          durationText: "12:00",
          externalBvid: "BV18VX2ByEfA",
          sourceProvider: "bilibili",
          freePreview: true,
        }, {
          id: "30004002",
          lessonNo: 2,
          number: 2,
          title: "Context Rules and Codex Collaboration",
          durationText: "18:00",
          externalBvid: "BV1vsZWBiEyM",
          sourceProvider: "bilibili",
          freePreview: true,
        }],
      }],
      relatedCourses: [],
      source: {
        sourceLabel: "Live course data",
        sourceDescription: "Derived from Java-compatible course tables.",
        observedAt: "2026-05-12 09:00:00",
        sourceTables: ["content_course", "content_course_lesson"],
      },
    },
  });

  assert.equal(
    detail?.detail.video.embedUrl,
    "https://player.bilibili.com/player.html?bvid=BV18VX2ByEfA&page=1&high_quality=1&danmaku=0",
  );
  assert.equal(detail?.detail.playlist.currentLessonNumber, 1);

  const selected = detail ? selectCourseLesson(detail.detail, "30004002") : null;

  assert.equal(selected?.video.title, "Context Rules and Codex Collaboration");
  assert.equal(
    selected?.video.embedUrl,
    "https://player.bilibili.com/player.html?bvid=BV1vsZWBiEyM&page=1&high_quality=1&danmaku=0",
  );
  assert.equal(selected?.playlist.currentLessonNumber, 2);
  assert.deepEqual(
    selected?.playlist.chapters[0].lessons.map((lesson) => [lesson.id, lesson.active]),
    [["30004001", false], ["30004002", true]],
  );
});

test("course detail lesson selection supports local uploaded video playback metadata", () => {
  const detail = normalizeCourseDetailPayload({
    code: "2000",
    data: {
      id: "ai-video",
      contentId: 30001005,
      courseCode: "ai-video",
      title: "\u5373\u68a6 AI \u89c6\u9891\u5236\u4f5c\u96f6\u57fa\u7840\u6559\u7a0b",
      description: "Learn local and Bilibili video course playback.",
      thumbnail: mediaResource("https://example.com/video-course.jpg"),
      instructor: {
        name: "SDKWork Academy",
        avatar: mediaResource("https://example.com/avatar.jpg"),
        title: "AI learning editor",
        bio: "Curates AI courses.",
      },
      durationText: "1h 20m",
      lessonsCount: 2,
      ratingScore: 4.8,
      studentsCount: 1024,
      level: 2,
      levelLabel: "Intermediate",
      category: "ai-video-creation",
      categoryLabel: "\u5373\u68a6 AI \u89c6\u9891\u5236\u4f5c",
      tags: ["AI Video", "\u89c6\u9891\u5236\u4f5c", "Local Upload"],
      externalBvid: "BV19Z421M7LD",
      content: "Course with a local uploaded tutorial lesson.",
      currency: "CNY",
      isCollection: true,
      publishedAt: "2026-05-12T09:00:00Z",
      commentCount: 0,
      engagement: {
        views: 1024,
        likes: 128,
        saves: 64,
        shares: 8,
        discussions: 0,
        studentsCount: 1024,
      },
      sections: [{
        id: "30003005",
        sectionNo: 1,
        title: "Video source types",
        lessons: [{
          id: "30004021",
          lessonNo: 1,
          number: 1,
          title: "Bilibili embedded lesson",
          durationText: "10:00",
          externalBvid: "BV19Z421M7LD",
          sourceProvider: "bilibili",
          freePreview: true,
        }, {
          id: "30004022",
          lessonNo: 2,
          number: 2,
          title: "Local uploaded tutorial",
          durationText: "12:00",
          video: mediaResource("/uploads/courses/ai-video/local-uploaded-tutorial.mp4", "video"),
          sourceProvider: "local",
          freePreview: true,
        }],
      }],
      relatedCourses: [],
      source: {
        sourceLabel: "Live course data",
        sourceDescription: "Derived from Java-compatible course tables.",
        observedAt: "2026-05-12 09:00:00",
        sourceTables: ["content_course", "content_course_lesson"],
      },
    },
  });

  const selected = detail ? selectCourseLesson(detail.detail, "30004022") : null;

  assert.equal(selected?.video.sourceProvider, "local");
  assert.equal(selected?.video.embedUrl, "/uploads/courses/ai-video/local-uploaded-tutorial.mp4");
  assert.equal(selected?.video.title, "Local uploaded tutorial");
});

test("course application submission is normalized through generated app SDK", async () => {
  const host = globalThis as typeof globalThis & {
    __SDKWORK_CLAW_ROUTER_APP_SDK_CLIENT__?: ClawRouterAppSdkClient | null;
  };
  const originalSdk = host.__SDKWORK_CLAW_ROUTER_APP_SDK_CLIENT__;
  const calls: unknown[] = [];
  host.__SDKWORK_CLAW_ROUTER_APP_SDK_CLIENT__ = {
    content: {
      courses: {
        list: async () => ({
          code: "2000",
          data: {
            items: [],
            page: 1,
            size: 10,
            totalElements: 0,
          },
        }),
        categories: {
          list: async () => ({
            code: "2000",
            data: {
              items: [],
            },
          }),
        },
        overview: {
          retrieve: async () => ({
            code: "2000",
            data: {
              stats: {
                totalCourses: 0,
                totalLessons: 0,
                totalStudents: 0,
                totalCategories: 0,
              },
              source: {
                sourceLabel: "Live course data",
                observedAt: "2026-05-12T09:00:00Z",
                sourceTables: ["content_course"],
              },
            },
          }),
        },
        retrieve: async () => ({
          code: "2000",
          data: null,
        }),
      },
      applications: {
        create: async (body: unknown) => {
          calls.push(body);
          return {
            code: "2000",
            data: {
              id: "course-application-1",
              applicationId: 1,
              title: "Claude Code Workshop",
              category: "ai-coding",
              sourceProvider: "bilibili",
              externalBvid: "BV1FAiPBeEZf",
              contactName: "Ada",
              contactEmail: "ada@example.com",
              status: "pending",
              submittedAt: "2026-05-12T09:00:00Z",
            },
          };
        },
      },
    },
  } as unknown as ClawRouterAppSdkClient;

  try {
    const result = await submitCourseApplication({
      title: "  Claude Code Workshop  ",
      category: "ai-coding",
      description: "A beginner-friendly Claude Code course for online learning.",
      sourceProvider: "bilibili",
      externalBvid: "BV1FAiPBeEZf",
      contactName: "Ada",
      contactEmail: "ada@example.com",
    });

    assert.equal(result.id, "course-application-1");
    assert.equal(result.status, "pending");
    assert.deepEqual(calls, [{
      title: "Claude Code Workshop",
      category: "ai-coding",
      description: "A beginner-friendly Claude Code course for online learning.",
      sourceProvider: "bilibili",
      externalBvid: "BV1FAiPBeEZf",
      video: undefined,
      contactName: "Ada",
      contactEmail: "ada@example.com",
      notes: undefined,
    }]);
  } finally {
    host.__SDKWORK_CLAW_ROUTER_APP_SDK_CLIENT__ = originalSdk;
  }
});

test("course application video upload is normalized through generated app SDK", async () => {
  const host = globalThis as typeof globalThis & {
    __SDKWORK_CLAW_ROUTER_APP_SDK_CLIENT__?: ClawRouterAppSdkClient | null;
  };
  const originalSdk = host.__SDKWORK_CLAW_ROUTER_APP_SDK_CLIENT__;
  const calls: unknown[] = [];
  host.__SDKWORK_CLAW_ROUTER_APP_SDK_CLIENT__ = {
    content: {
      applications: {
        create: async () => ({
          code: "2000",
          data: null,
        }),
        videos: {
          create: async (body: { file: Blob; fileName?: string }) => {
            calls.push(body);
            return {
              code: "2000",
              data: {
                video: mediaResource("/uploads/courses/applications/course-application-video-lesson.mp4", "video"),
                fileName: "course-application-video-lesson.mp4",
                contentType: "video/mp4",
                sizeBytes: 3,
                sha256: "0".repeat(64),
                uploadedAt: "2026-05-12 09:00:00",
              },
            };
          },
        },
      },
      courses: {
        list: async () => ({
          code: "2000",
          data: {
            items: [],
            page: 1,
            size: 10,
            totalElements: 0,
          },
        }),
        categories: {
          list: async () => ({
            code: "2000",
            data: {
              items: [],
            },
          }),
        },
        overview: {
          retrieve: async () => ({
            code: "2000",
            data: {
              stats: {
                totalCourses: 0,
                totalLessons: 0,
                totalStudents: 0,
                totalCategories: 0,
              },
              source: {
                sourceLabel: "Live course data",
                observedAt: "2026-05-12T09:00:00Z",
                sourceTables: ["content_course"],
              },
            },
          }),
        },
        retrieve: async () => ({
          code: "2000",
          data: null,
        }),
      },
    },
  } as unknown as ClawRouterAppSdkClient;

  try {
    const file = new Blob([new Uint8Array([0, 1, 2])], { type: "video/mp4" });
    const result = await uploadCourseApplicationVideo({
      file,
      fileName: "  Claude Code Lesson.mp4  ",
    });

    assert.equal(result.video.publicUrl, "/uploads/courses/applications/course-application-video-lesson.mp4");
    assert.equal(result.fileName, "course-application-video-lesson.mp4");
    assert.equal(result.contentType, "video/mp4");
    assert.equal(result.sizeBytes, 3);
    assert.equal(result.sha256, "0".repeat(64));
    assert.equal(result.uploadedAt, "2026-05-12 09:00:00");
    assert.equal(calls.length, 1);
    const uploadRequest = calls[0] as { file: Blob; fileName?: string };
    assert.equal(uploadRequest.file, file);
    assert.equal(uploadRequest.fileName, "Claude Code Lesson.mp4");
  } finally {
    host.__SDKWORK_CLAW_ROUTER_APP_SDK_CLIENT__ = originalSdk;
  }
});

test("courses page requires login before opening course application actions", () => {
  const coursesViewSource = readFileSync(
    new URL("./packages/sdkwork-claw-router-courses/src/components/CoursesView.tsx", import.meta.url),
    "utf8",
  );
  const courseDetailSource = readFileSync(
    new URL("./packages/sdkwork-claw-router-courses/src/components/CourseDetailView.tsx", import.meta.url),
    "utf8",
  );
  const courseInfoSource = readFileSync(
    new URL("./packages/sdkwork-claw-router-courses/src/components/course-detail/CourseInfo.tsx", import.meta.url),
    "utf8",
  );
  const dialogSource = readFileSync(
    new URL("./packages/sdkwork-claw-router-courses/src/components/CourseApplicationDialog.tsx", import.meta.url),
    "utf8",
  );

  assert.match(coursesViewSource, /useLocation/u);
  assert.match(coursesViewSource, /useNavigate/u);
  assert.match(coursesViewSource, /buildPortalAuthLoginRedirect/u);
  assert.match(coursesViewSource, /hasStoredPortalSession/u);
  assert.match(coursesViewSource, /openCourseApplicationDialog/u);
  assert.match(coursesViewSource, /requireLoginForCourseApplicationAction/u);
  assert.match(coursesViewSource, /if \(!hasStoredPortalSession\(\)\) \{\s*navigate\(buildPortalAuthLoginRedirect\(location\)\);\s*return;\s*\}/u);
  assert.match(coursesViewSource, /onClick=\{openCourseApplicationDialog\}/u);
  assert.match(coursesViewSource, /requireLoginForAction=\{requireLoginForCourseApplicationAction\}/u);
  assert.match(coursesViewSource, /onSubmit=\{courseService\.submitCourseApplication\}/u);
  assert.match(coursesViewSource, /onUploadVideo=\{courseService\.uploadCourseApplicationVideo\}/u);
  assert.match(dialogSource, /requireLoginForAction: \(\) => boolean/u);
  assert.match(dialogSource, /if \(!requireLoginForAction\(\)\) \{\s*return;\s*\}/u);
  assert.match(dialogSource, /if \(!requireLoginForAction\(\)\) \{\s*event\.currentTarget\.value = '';\s*return;\s*\}/u);

  assert.match(courseDetailSource, /useLocation/u);
  assert.match(courseDetailSource, /useNavigate/u);
  assert.match(courseDetailSource, /requireLoginForCourseDetailAction/u);
  assert.match(courseDetailSource, /if \(!hasStoredPortalSession\(\)\) \{\s*navigate\(buildPortalAuthLoginRedirect\(location\)\);\s*return false;\s*\}/u);
  assert.match(courseDetailSource, /<CourseInfo[^>]*requireLoginForAction=\{requireLoginForCourseDetailAction\}/u);
  assert.match(courseInfoSource, /requireLoginForAction: \(\) => boolean/u);
  assert.match(courseInfoSource, /const handlePrivateAction = \(\) => \{\s*requireLoginForAction\(\);\s*\}/u);
  assert.match(courseInfoSource, /onClick=\{handlePrivateAction\}/u);
});
