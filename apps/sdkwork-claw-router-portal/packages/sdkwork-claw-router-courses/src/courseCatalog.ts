export type CourseLevel = 'Beginner' | 'Intermediate' | 'Advanced';
export type CourseLevelFilter = 'All' | CourseLevel;

export type CourseInstructor = {
  name: string;
  avatar: string;
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
  title: string;
  description: string;
  thumbnail: string;
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
  duration: string;
  active: boolean;
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
  unavailableMessage: string;
  title: string;
};

export type CourseRelatedCardView = {
  id: string;
  title: string;
  thumbnail: string;
  instructorName: string;
  duration: string;
  viewsLabel: string;
  discussionsLabel: string;
};

export type CourseCommentView = {
  id: string;
  author: string;
  avatarUrl: string;
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
  avatar: string;
  title: string;
  bio: string;
  followersLabel: string;
};

export type CourseDetailViewModel = {
  course: Course;
  snapshotSource: typeof COURSE_CONTENT_SNAPSHOT_SOURCE;
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

export const COURSE_CATALOG: Course[] = [
  {
    id: 'c1',
    title: 'Claw Router Fundamentals: Zero to Hero',
    description: 'Master the core concepts of Claw Router. Learn how to define schemas, set up middleware, and configure performant API resolving.',
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    instructor: {
      name: 'Sarah Chen',
      avatar: 'https://i.pravatar.cc/150?u=2',
      title: 'Principal API Architect',
      bio: 'Designs production API routing systems and developer education programs for enterprise teams.',
    },
    duration: '4h 30m',
    lessonsCount: 24,
    rating: 4.9,
    studentsCount: 15420,
    level: 'Beginner',
    category: 'Core Concepts',
    tags: ['Core', 'Routing'],
    bilibiliBvid: 'BV1GJ411x7h7',
    content: "Welcome to Claw Router Fundamentals. This course walks through production-ready routing configuration, schema design, and operational checks.",
    price: null,
    isCollection: true,
    relatedCourseIds: ['c2', 'c6'],
    engagement: {
      likes: 19521,
      saves: 6820,
      shares: 2110,
      discussions: 1240,
    },
  },
  {
    id: 'c2',
    title: 'Advanced API Architecture and Design',
    description: 'Learn how to handle hundreds of endpoints gracefully. We cover spec splitting, dynamic routing, and enterprise-grade security middleware.',
    thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    instructor: {
      name: 'David Smith',
      avatar: 'https://i.pravatar.cc/150?u=3',
      title: 'API Platform Lead',
      bio: 'Builds large-scale gateway architecture and governance systems for distributed engineering teams.',
    },
    duration: '6h 15m',
    lessonsCount: 38,
    rating: 4.8,
    studentsCount: 8312,
    level: 'Advanced',
    category: 'Architecture',
    tags: ['Architecture', 'Security', 'API'],
    bilibiliBvid: 'BV1hY411N7xL',
    content: 'A deep course on API surface design, schema evolution, route isolation, and secure platform boundaries.',
    price: 49.99,
    isCollection: false,
    relatedCourseIds: ['c1', 'c5'],
  },
  {
    id: 'c3',
    title: 'Real-time Integrations and Webhooks',
    description: 'Extend your router with WebSockets and Webhooks. This course covers everything from basic event publishing to scalable real-time architectures.',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    instructor: {
      name: 'Alex Johnson',
      avatar: 'https://i.pravatar.cc/150?u=1',
      title: 'Realtime Systems Engineer',
      bio: 'Specializes in event-driven integration, webhook contracts, and production incident response.',
    },
    duration: '3h 45m',
    lessonsCount: 18,
    rating: 4.7,
    studentsCount: 5210,
    level: 'Intermediate',
    category: 'Integrations',
    tags: ['WebSockets', 'Events'],
    bilibiliBvid: 'BV1xx411c7mD',
    price: null,
    isCollection: false,
    relatedCourseIds: ['c1'],
  },
  {
    id: 'c4',
    title: 'Frontend State Management with Claw',
    description: 'Deep dive into managing global state and caching API responses effectively on the client side using Claw Router.',
    thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    instructor: {
      name: 'Emily Davis',
      avatar: 'https://i.pravatar.cc/150?u=4',
      title: 'Frontend Platform Engineer',
      bio: 'Focuses on typed client architecture, cache strategy, and resilient React application delivery.',
    },
    duration: '5h 20m',
    lessonsCount: 30,
    rating: 4.9,
    studentsCount: 11204,
    level: 'Intermediate',
    category: 'Frontend',
    tags: ['State', 'React', 'Caching'],
    bilibiliBvid: 'BV1GJ411x7h7',
    price: 29.99,
    isCollection: true,
    relatedCourseIds: ['c2'],
  },
  {
    id: 'c5',
    title: 'Microservices and Distributed Tracing',
    description: 'Build observability into your distributed API mesh. Learn how to track requests across multiple services seamlessly.',
    thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    instructor: {
      name: 'Michael Chen',
      avatar: 'https://i.pravatar.cc/150?u=5',
      title: 'Observability Architect',
      bio: 'Leads service reliability, trace design, and production diagnostics for multi-service platforms.',
    },
    duration: '8h 10m',
    lessonsCount: 45,
    rating: 4.9,
    studentsCount: 6420,
    level: 'Advanced',
    category: 'DevOps and Observability',
    tags: ['Tracing', 'Microservices', 'Monitoring'],
    bilibiliBvid: 'BV1hY411N7xL',
    price: 99.0,
    isCollection: true,
    relatedCourseIds: ['c2', 'c3'],
  },
  {
    id: 'c6',
    title: 'Authentication and Authorization Flows',
    description: 'Implement secure JWT, OAuth2, and Role-Based Access Control inside your routes with minimal boilerplate.',
    thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    instructor: {
      name: 'Sarah Chen',
      avatar: 'https://i.pravatar.cc/150?u=2',
      title: 'Principal API Architect',
      bio: 'Designs production API routing systems and developer education programs for enterprise teams.',
    },
    duration: '4h 00m',
    lessonsCount: 20,
    rating: 4.6,
    studentsCount: 9340,
    level: 'Beginner',
    category: 'Security',
    tags: ['OAuth', 'JWT', 'RBAC', 'Security'],
    bilibiliBvid: 'BV1xx411c7mD',
    price: null,
    isCollection: false,
    relatedCourseIds: ['c2'],
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
    ['Maya Lin', 5, 'The schema-first walkthrough made our gateway migration plan much clearer.'],
    ['Noah Reed', 4, 'Good pacing and useful production checklists for each lesson.'],
    ['Priya Shah', 3, 'The examples are concise and easy to map to a real routing service.'],
  ] as const;

  return {
    totalCount: authors.length,
    items: authors.map(([author, level, body], index) => ({
      id: `${course.id}-comment-${index + 1}`,
      author,
      avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(author)}&background=0f172a&color=ffffff`,
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
