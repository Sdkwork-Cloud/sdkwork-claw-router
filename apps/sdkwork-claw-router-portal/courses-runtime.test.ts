import assert from "node:assert/strict";
import test from "node:test";

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
    category: "  Architecture  ",
    searchQuery: "  api  ",
  };
  const filtered = filterCoursesForCatalog(COURSE_CATALOG, filters);

  assert.deepEqual(filtered.map((course) => course.id), ["c2"]);
  assert.notEqual(filtered, COURSE_CATALOG);
  assert.deepEqual(COURSE_CATALOG.map((course) => course.id), ["c1", "c2", "c3", "c4", "c5", "c6"]);
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
  assert.equal(detail?.info.reactions.likes, formatCourseCount(19_521));
  assert.equal(detail?.video.embedUrl, "https://player.bilibili.com/player.html?bvid=BV1GJ411x7h7&page=1&high_quality=1&danmaku=0");
  assert.equal(detail?.playlist.totalLessons, detail?.course.lessonsCount);
  assert.equal(detail?.playlist.chapters[0].lessons[0].active, true);
  assert.deepEqual(detail?.relatedCourses.slice(0, 2).map((course) => course.id), ["c2", "c6"]);
  assert.equal(detail?.relatedCourses.some((course) => course.id === "c1"), false);
  assert.equal(detail?.comments.totalCount, 3);
  assert.deepEqual(detail?.comments.items.map((comment) => comment.level), [5, 4, 3]);
});

test("course helpers reject unsafe video ids and handle empty states safely", () => {
  assert.equal(buildBilibiliEmbedUrl("BV1GJ411x7h7"), "https://player.bilibili.com/player.html?bvid=BV1GJ411x7h7&page=1&high_quality=1&danmaku=0");
  assert.equal(buildBilibiliEmbedUrl("javascript:alert(1)"), null);
  assert.equal(buildBilibiliEmbedUrl("BV1GJ411x7h7&autoplay=1"), null);
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
