import type { ClawRouterMediaResource } from 'sdkwork-claw-router-commons';

export type CourseLevel = 'Beginner' | 'Intermediate' | 'Advanced';
export type CourseLevelFilter = 'All' | CourseLevel;

export type CourseInstructor = {
  name: string;
  avatar: ClawRouterMediaResource;
  title: string;
  bio: string;
};

export type CourseEngagementSeed = {
  views?: number;
  likes?: number;
  saves?: number;
  shares?: number;
  discussions?: number;
};

export interface Course {
  id: string;
  contentId?: number;
  courseCode?: string;
  title: string;
  description: string;
  thumbnail: ClawRouterMediaResource;
  instructor: CourseInstructor;
  duration: string;
  lessonsCount: number;
  rating: number;
  studentsCount: number;
  level: CourseLevel;
  category: string;
  tags: string[];
  bilibiliBvid?: string;
  content?: string;
  price?: number | null;
  isCollection?: boolean;
  publishedAt?: string;
  relatedCourseIds?: string[];
  engagement?: CourseEngagementSeed;
}

export type CourseCatalogFilters = {
  level: CourseLevelFilter;
  category: string;
  searchQuery: string;
};

export type CourseFilterOption = {
  id: string;
  label: string;
  count: number;
};

export type CourseEngagementMetrics = {
  views: string;
  likes: string;
  saves: string;
  shares: string;
  discussions: string;
};

export type CourseOverviewSource = {
  sourceLabel: string;
  sourceDescription: string;
  observedAt: string;
  sourceTables: readonly string[];
};

export type CourseInfoView = {
  title: string;
  description: string;
  category: string;
  tags: string[];
  publishedAt: string;
  lessonsLabel: string;
  viewsLabel: string;
  reactions: CourseEngagementMetrics;
};

export type CourseLessonView = {
  id: string;
  number: number;
  title: string;
  description?: string;
  duration: string;
  active: boolean;
  video?: ClawRouterMediaResource;
  externalBvid?: string;
  sourceProvider?: string;
  content?: string;
  freePreview?: boolean;
};

export type CourseChapterView = {
  id: string;
  title: string;
  lessons: CourseLessonView[];
};

export type CoursePlaylistView = {
  totalLessons: number;
  currentLessonNumber: number;
  chapters: CourseChapterView[];
};

export type CourseVideoView = {
  embedUrl: string | null;
  sourceProvider?: string;
  unavailableMessage: string;
  title: string;
};

export type CourseRelatedCardView = {
  id: string;
  title: string;
  thumbnail: ClawRouterMediaResource;
  instructorName: string;
  duration: string;
  viewsLabel: string;
  discussionsLabel: string;
};

export type CourseCommentView = {
  id: string;
  author: string;
  avatar: ClawRouterMediaResource;
  level: number;
  body: string;
  createdAt: string;
  likes: number;
};

export type CourseCommentsView = {
  totalCount: number;
  items: CourseCommentView[];
};

export type CoursePublisherView = {
  name: string;
  avatar: ClawRouterMediaResource;
  title: string;
  bio: string;
  followersLabel: string;
};

export type CourseDetailViewModel = {
  course: Course;
  snapshotSource: CourseOverviewSource;
  info: CourseInfoView;
  video: CourseVideoView;
  playlist: CoursePlaylistView;
  relatedCourses: CourseRelatedCardView[];
  comments: CourseCommentsView;
  publisher: CoursePublisherView;
};

export const COURSE_CONTENT_SNAPSHOT_SOURCE = {
  sourceLabel: 'Curated course content snapshot',
  sourceDescription: 'Derived from curated course, lesson, relation, and reaction seed content.',
  observedAt: '2026-05-03',
  sourceTables: [
    'content_course',
    'content_course_section',
    'content_course_lesson',
    'content_course_relation',
    'content_reaction',
  ],
} as const;

function localImageResource(url: string, title?: string): ClawRouterMediaResource {
  return {
    kind: 'image',
    source: 'external_url',
    url,
    publicUrl: url,
    ...(title ? { title } : {}),
  };
}

export const COURSE_CATALOG: Course[] = [
  {
    id: "c1",
    contentId: 30001001,
    courseCode: "c1",
    title: "飞书 CLI 与 Claude Code/Codex 远程开发实战",
    description: "基于 Bilibili 的飞书 CLI、Claude Code、Codex 课程，覆盖远程开发、Agent 协作、上下文规则和生产任务交付。",
    thumbnail: localImageResource("/assets/courses/covers/ai-coding.svg", "AI Coding"),
    instructor: {
      name: "SDKWork Academy",
      avatar: localImageResource("/assets/courses/avatars/sdkwork-academy.svg", "SDKWork Academy"),
      title: "AI Coding Curriculum Team",
      bio: "Curates practical AI coding courses from Bilibili and local tutorial uploads.",
    },
    duration: "3h 20m",
    lessonsCount: 3,
    rating: 4.9,
    studentsCount: 3851,
    level: "Beginner",
    category: "AI Coding",
    tags: [
      "Claude Code",
      "Codex",
      "Remote Development",
      "AI Coding",
    ],
    bilibiliBvid: "BV18VX2ByEfA",
    content: "从飞书 CLI、Claude Code 和 Codex 远程协作入手，把上下文规则、团队流程和真实项目交付连接起来。",
    price: null,
    isCollection: true,
    publishedAt: "2026-05-16T14:00:00Z",
    relatedCourseIds: [
      "c2",
      "c6",
    ],
    engagement: {
      views: 3851,
      likes: 155,
      saves: 22,
      shares: 11,
    },
  },
  {
    id: "c2",
    contentId: 30001002,
    courseCode: "c2",
    title: "OpenAI Codex CLI 超级入门教程",
    description: "面向在线学习的 Codex 课程，覆盖 Codex CLI、IDE 协作、AGENTS.md、代码审查、上下文处理、MCP 和云端任务委派。",
    thumbnail: localImageResource("/assets/courses/covers/ai-coding.svg", "AI Coding"),
    instructor: {
      name: "SDKWork Academy",
      avatar: localImageResource("/assets/courses/avatars/sdkwork-academy.svg", "SDKWork Academy"),
      title: "AI Coding Curriculum Team",
      bio: "Curates practical AI coding courses from Bilibili and local tutorial uploads.",
    },
    duration: "2h 10m",
    lessonsCount: 3,
    rating: 4.8,
    studentsCount: 6808,
    level: "Advanced",
    category: "AI Coding",
    tags: [
      "Codex",
      "Codex CLI",
      "AGENTS.md",
      "MCP",
      "Security",
    ],
    bilibiliBvid: "BV1vsZWBiEyM",
    content: "学习 Codex 从仓库阅读、代码审查、命令行会话到云端任务委派的完整工程闭环。",
    price: null,
    isCollection: false,
    publishedAt: "2026-05-16T13:00:00Z",
    relatedCourseIds: [
      "c1",
      "c5",
    ],
    engagement: {
      views: 6808,
      likes: 984,
      saves: 269,
      shares: 85,
    },
  },
  {
    id: "c3",
    contentId: 30001003,
    courseCode: "c3",
    title: "Claude Code 从 0 到 1 全攻略",
    description: "面向真实项目的 Claude Code 课程，从安装授权、Plan Mode、MCP、图片处理、上下文压缩到 Hook、Agent Skill 和 SubAgent。",
    thumbnail: localImageResource("/assets/courses/covers/ai-coding.svg", "AI Coding"),
    instructor: {
      name: "SDKWork Academy",
      avatar: localImageResource("/assets/courses/avatars/sdkwork-academy.svg", "SDKWork Academy"),
      title: "AI Coding Curriculum Team",
      bio: "Curates practical AI coding courses from Bilibili and local tutorial uploads.",
    },
    duration: "5h 40m",
    lessonsCount: 3,
    rating: 4.7,
    studentsCount: 59000,
    level: "Intermediate",
    category: "AI Coding",
    tags: [
      "Claude Code",
      "MCP",
      "Playwright",
      "Parallel Tasks",
    ],
    bilibiliBvid: "BV14rzQB9EJj",
    content: "把 Claude Code 应用到真实工程系统，系统学习 Plan Mode、MCP、后台任务、图片处理、Hook、Agent Skill 和 SubAgent。",
    price: null,
    isCollection: false,
    publishedAt: "2026-05-16T12:00:00Z",
    relatedCourseIds: [
      "c11",
      "c21",
    ],
    engagement: {
      views: 59000,
      likes: 2300,
      saves: 760,
      shares: 180,
    },
  },
  {
    id: "c4",
    contentId: 30001004,
    courseCode: "c4",
    title: "DeepSeek + 即梦 AI 图片制作",
    description: "围绕 DeepSeek + 即梦 AI 生成图片的在线课程，覆盖图片描述词、图片制作、局部重绘、角色一致性和商业海报素材。",
    thumbnail: localImageResource("/assets/courses/covers/ai-image-creation.svg", "AI Image Creation"),
    instructor: {
      name: "SDKWork Creative Lab",
      avatar: localImageResource("/assets/courses/avatars/sdkwork-creative-lab.svg", "SDKWork Creative Lab"),
      title: "AI Creation Curriculum Team",
      bio: "Curates image, video, and short drama courses for creators and operators.",
    },
    duration: "1h 45m",
    lessonsCount: 3,
    rating: 4.9,
    studentsCount: 100000,
    level: "Intermediate",
    category: "即梦 AI 图片制作",
    tags: [
      "即梦",
      "图片制作",
      "AI Painting",
      "Image Control",
    ],
    bilibiliBvid: "BV1oPPheLEw5",
    content: "从提示词、参考图、局部重绘到角色一致性，构建稳定的即梦 AI 图片制作工作流。",
    price: null,
    isCollection: true,
    publishedAt: "2026-05-16T11:00:00Z",
    relatedCourseIds: [
      "c14",
      "c24",
    ],
    engagement: {
      views: 100000,
      likes: 4100,
      saves: 1800,
      shares: 390,
    },
  },
  {
    id: "c5",
    contentId: 30001005,
    courseCode: "c5",
    title: "即梦 AI 视频制作零基础教程",
    description: "即梦 AI 视频制作零基础课，覆盖脚本、分镜图、AI 视频生成、配音、音效、剪辑和 AI 漫剧生产流程。",
    thumbnail: localImageResource("/assets/courses/covers/ai-video-creation.svg", "AI Video Creation"),
    instructor: {
      name: "SDKWork Creative Lab",
      avatar: localImageResource("/assets/courses/avatars/sdkwork-creative-lab.svg", "SDKWork Creative Lab"),
      title: "AI Creation Curriculum Team",
      bio: "Curates image, video, and short drama courses for creators and operators.",
    },
    duration: "6h 30m",
    lessonsCount: 3,
    rating: 4.9,
    studentsCount: 6097,
    level: "Advanced",
    category: "即梦 AI 视频制作",
    tags: [
      "即梦",
      "AI Video",
      "AI Comics",
      "视频制作",
      "Voiceover",
      "Editing",
    ],
    bilibiliBvid: "BV19Z421M7LD",
    content: "从脚本和分镜到图生视频、配音、音效和成片剪辑，完成一套即梦 AI 视频制作课程。",
    price: null,
    isCollection: true,
    publishedAt: "2026-05-16T10:00:00Z",
    relatedCourseIds: [
      "c6",
      "c15",
    ],
    engagement: {
      views: 6097,
      likes: 761,
      saves: 208,
      shares: 65,
    },
  },
  {
    id: "c6",
    contentId: 30001006,
    courseCode: "c6",
    title: "AI 图片到视频创作工作流",
    description: "把 AI 图片制作、图生视频、运镜短片、剪辑和本地上传教程资产连接起来的入门课程。",
    thumbnail: localImageResource("/assets/courses/covers/ai-video-creation.svg", "AI Video Creation"),
    instructor: {
      name: "SDKWork Creative Lab",
      avatar: localImageResource("/assets/courses/avatars/sdkwork-creative-lab.svg", "SDKWork Creative Lab"),
      title: "AI Creation Curriculum Team",
      bio: "Curates image, video, and short drama courses for creators and operators.",
    },
    duration: "4h 50m",
    lessonsCount: 3,
    rating: 4.6,
    studentsCount: 776,
    level: "Beginner",
    category: "即梦 AI 视频制作",
    tags: [
      "AI Image",
      "图片制作",
      "AI Video",
      "视频制作",
      "Local Upload",
      "Security",
    ],
    bilibiliBvid: "BV1cS411A7Wp",
    content: "将 AI 图片制作、图生视频和本地上传教程组合为可复用的短视频生产工作流，并加入素材安全检查。",
    price: null,
    isCollection: false,
    publishedAt: "2026-05-16T09:00:00Z",
    relatedCourseIds: [
      "c15",
      "c25",
    ],
    engagement: {
      views: 776,
      likes: 107,
      saves: 30,
      shares: 9,
    },
  },
];

export function filterCoursesForCatalog(
  catalog: readonly Course[],
  filters: CourseCatalogFilters,
): Course[] {
  const normalizedLevel = filters.level;
  const normalizedCategory = normalizeSearchText(filters.category);
  const normalizedSearch = normalizeSearchText(filters.searchQuery);

  return catalog.filter((course) => {
    const matchLevel = normalizedLevel === 'All' || course.level === normalizedLevel;
    const matchCategory = normalizedCategory === '' || normalizedCategory === 'all'
      || normalizeSearchText(course.category) === normalizedCategory;
    const searchableText = normalizeSearchText([
      course.title,
      course.description,
      course.category,
      course.instructor.name,
      ...course.tags,
    ].join(' '));
    const matchSearch = normalizedSearch === '' || searchableText.includes(normalizedSearch);
    return matchLevel && matchCategory && matchSearch;
  });
}

export function deriveCourseCatalogViewModel({
  catalog,
  filters,
}: {
  catalog: readonly Course[];
  filters: CourseCatalogFilters;
}) {
  const filteredCourses = filterCoursesForCatalog(catalog, filters);
  const categories = uniqueSorted(catalog.map((course) => course.category));

  return {
    snapshotSource: COURSE_CONTENT_SNAPSHOT_SOURCE,
    categoryOptions: [
      { id: 'All', label: 'All Categories', count: catalog.length },
      ...categories.map((category) => ({
        id: category,
        label: category,
        count: catalog.filter((course) => course.category === category).length,
      })),
    ] satisfies CourseFilterOption[],
    levelOptions: (['All', 'Beginner', 'Intermediate', 'Advanced'] as CourseLevelFilter[]).map((level) => ({
      id: level,
      label: level === 'All' ? 'All Levels' : level,
      count: level === 'All' ? catalog.length : catalog.filter((course) => course.level === level).length,
    })),
    filteredCourses,
    heading: filters.category === 'All' ? 'Featured Courses' : filters.category,
    resultCount: filteredCourses.length,
  };
}

export function deriveCourseDetailView(
  catalog: readonly Course[],
  courseId: string | undefined,
): CourseDetailViewModel | null {
  const course = catalog.find((item) => item.id === courseId);
  if (!course) {
    return null;
  }

  const metrics = deriveCourseEngagementMetrics(course);

  return {
    course,
    snapshotSource: COURSE_CONTENT_SNAPSHOT_SOURCE,
    info: {
      title: course.title,
      description: course.content || course.description,
      category: course.category,
      tags: course.tags,
      publishedAt: COURSE_CONTENT_SNAPSHOT_SOURCE.observedAt,
      lessonsLabel: `${course.lessonsCount} lessons`,
      viewsLabel: `${metrics.views} views`,
      reactions: metrics,
    },
    video: {
      embedUrl: buildBilibiliEmbedUrl(course.bilibiliBvid),
      unavailableMessage: 'Video content unavailable',
      title: course.title,
    },
    playlist: deriveCoursePlaylist(course),
    relatedCourses: deriveRelatedCourseCards(catalog, course),
    comments: deriveCourseComments(course),
    publisher: {
      name: course.instructor.name,
      avatar: course.instructor.avatar,
      title: course.instructor.title,
      bio: course.instructor.bio,
      followersLabel: `${formatCourseCount(course.studentsCount)} learners`,
    },
  };
}

export function buildBilibiliEmbedUrl(bvid: string | undefined): string | null {
  const safeBvid = bvid?.trim();
  if (!safeBvid || !/^BV[A-Za-z0-9]{8,20}$/.test(safeBvid)) {
    return null;
  }

  const embedUrl = new URL('https://player.bilibili.com/player.html');
  embedUrl.searchParams.set('bvid', safeBvid);
  embedUrl.searchParams.set('page', '1');
  embedUrl.searchParams.set('high_quality', '1');
  embedUrl.searchParams.set('danmaku', '0');
  return embedUrl.toString();
}

export function deriveCoursePlaylist(course: Pick<Course, 'id' | 'title' | 'lessonsCount'>): CoursePlaylistView {
  if (course.lessonsCount <= 0) {
    return { totalLessons: 0, currentLessonNumber: 0, chapters: [] };
  }

  const chapterTitles = [
    'Foundation',
    'Implementation',
    'Production Patterns',
    'Operations and Review',
  ];
  const chapterCount = Math.min(chapterTitles.length, Math.ceil(course.lessonsCount / 6));
  const baseSize = Math.floor(course.lessonsCount / chapterCount);
  const remainder = course.lessonsCount % chapterCount;
  let lessonNumber = 1;

  const chapters = Array.from({ length: chapterCount }, (_, chapterIndex) => {
    const chapterSize = baseSize + (chapterIndex < remainder ? 1 : 0);
    const lessons = Array.from({ length: chapterSize }, () => {
      const number = lessonNumber;
      lessonNumber += 1;
      return {
        id: `${course.id}-lesson-${number}`,
        number,
        title: `${course.title}: Lesson ${number}`,
        duration: deriveLessonDuration(number),
        active: number === 1,
      };
    });

    return {
      id: `${course.id}-chapter-${chapterIndex + 1}`,
      title: `${chapterIndex + 1}. ${chapterTitles[chapterIndex]}`,
      lessons,
    };
  });

  return {
    totalLessons: course.lessonsCount,
    currentLessonNumber: 1,
    chapters,
  };
}

export function deriveCourseEngagementMetrics(course: Pick<Course, 'studentsCount' | 'lessonsCount' | 'engagement'>): CourseEngagementMetrics {
  const views = course.engagement?.views ?? course.studentsCount;
  const likes = course.engagement?.likes ?? Math.round(course.studentsCount * 0.1185);
  const saves = course.engagement?.saves ?? Math.round(course.studentsCount * 0.0324);
  const shares = course.engagement?.shares ?? Math.round(course.studentsCount * 0.0102);
  const discussions = course.engagement?.discussions ?? Math.round(course.lessonsCount * 425);

  return {
    views: formatCourseCount(views),
    likes: formatCourseCount(likes),
    saves: formatCourseCount(saves),
    shares: formatCourseCount(shares),
    discussions: formatCourseCount(discussions),
  };
}

export function formatCourseCount(value: number): string {
  if (value >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(1)}B`;
  }
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`;
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(1)}K`;
  }
  return String(Math.max(0, Math.round(value)));
}

function deriveRelatedCourseCards(catalog: readonly Course[], course: Course): CourseRelatedCardView[] {
  const relatedIds = new Set(course.relatedCourseIds ?? []);
  const prioritized = [
    ...catalog.filter((candidate) => relatedIds.has(candidate.id)),
    ...catalog.filter((candidate) => candidate.id !== course.id && !relatedIds.has(candidate.id)),
  ];

  return prioritized.slice(0, 5).map((related) => {
    const metrics = deriveCourseEngagementMetrics(related);
    return {
      id: related.id,
      title: related.title,
      thumbnail: related.thumbnail,
      instructorName: related.instructor.name,
      duration: related.duration,
      viewsLabel: metrics.views,
      discussionsLabel: metrics.discussions,
    };
  });
}

function deriveCourseComments(course: Course): CourseCommentsView {
  const authors = [
    ['Maya Lin', 5, 'The Claude Code and Codex workflow made our team standards easier to apply.'],
    ['Noah Reed', 4, 'Good pacing and practical checks for each AI engineering lesson.'],
    ['Priya Shah', 3, 'The examples are concise and easy to map to real SDKWork application modules.'],
  ] as const;

  return {
    totalCount: authors.length,
    items: authors.map(([author, level, body], index) => ({
      id: `${course.id}-comment-${index + 1}`,
      author,
      avatar: localImageResource('/assets/courses/avatars/learner.svg', author),
      level,
      body,
      createdAt: `2026-05-0${index + 1} 14:30`,
      likes: 89 - index * 11,
    })),
  };
}

function deriveLessonDuration(lessonNumber: number): string {
  const minutes = 10 + (lessonNumber % 4) * 3;
  const seconds = (lessonNumber * 7) % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

function uniqueSorted(values: string[]): string[] {
  return Array.from(new Set(values)).sort((left, right) => left.localeCompare(right));
}

function normalizeSearchText(value: string): string {
  return value.trim().replace(/\s+/g, ' ').toLowerCase();
}
