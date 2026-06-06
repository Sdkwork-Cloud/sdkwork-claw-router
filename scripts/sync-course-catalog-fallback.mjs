import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url)).replace(/\\scripts$/, '');
const seedPath = join(root, 'data', 'courses', 'course-seed.json');
const catalogPath = join(
  root,
  'apps',
  'sdkwork-clawrouter-pc',
  'packages',
  'sdkwork-clawrouter-pc-courses',
  'src',
  'courseCatalog.ts',
);

const levelLabels = {
  1: 'Beginner',
  2: 'Intermediate',
  3: 'Advanced',
};

const seed = JSON.parse(readFileSync(seedPath, 'utf8'));
const categories = new Map(seed.categories.map((category) => [category.code, category.name]));
const relationMap = new Map();
for (const relation of seed.relations) {
  if (!relationMap.has(relation.courseCode)) {
    relationMap.set(relation.courseCode, []);
  }
  relationMap.get(relation.courseCode).push(relation.relatedCourseCode);
}

const fallbackCourses = seed.courses.slice(0, 6).map((course) => ({
  id: course.courseCode,
  contentId: course.id,
  courseCode: course.courseCode,
  title: course.title,
  description: course.description,
  thumbnail: course.thumbnail,
  instructor: {
    name: course.instructor.name,
    avatar: course.instructor.avatar,
    title: course.instructor.title,
    bio: course.instructor.bio,
  },
  duration: course.durationText,
  lessonsCount: course.lessonsCount,
  rating: Number(course.ratingScore),
  studentsCount: course.studentsCount,
  level: levelLabels[course.level] ?? 'Beginner',
  category: categories.get(course.category) ?? course.category,
  tags: course.tags,
  bilibiliBvid: course.externalBvid,
  content: course.content,
  price: course.priceAmount === null ? null : Number(course.priceAmount),
  isCollection: course.isCollection,
  publishedAt: course.publishedAt,
  relatedCourseIds: relationMap.get(course.courseCode) ?? [],
  engagement: course.engagement,
}));

const source = readFileSync(catalogPath, 'utf8');
const start = source.indexOf('export const COURSE_CATALOG: Course[] = [');
if (start === -1) {
  throw new Error('COURSE_CATALOG declaration not found');
}
const endMarker = '];';
const end = source.indexOf(endMarker, start);
if (end === -1) {
  throw new Error('COURSE_CATALOG closing marker not found');
}

const literal = toTypeScript(fallbackCourses);
const next = `${source.slice(0, start)}export const COURSE_CATALOG: Course[] = ${literal};${source.slice(end + endMarker.length)}`;
writeFileSync(catalogPath, next, 'utf8');
console.log(`Synced ${fallbackCourses.length} fallback courses to courseCatalog.ts.`);

function toTypeScript(value, indent = 0) {
  const pad = ' '.repeat(indent);
  const nextPad = ' '.repeat(indent + 2);
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return '[]';
    }
    return `[\n${value.map((item) => `${nextPad}${toTypeScript(item, indent + 2)}`).join(',\n')},\n${pad}]`;
  }
  if (value && typeof value === 'object') {
    const entries = Object.entries(value).filter(([, entryValue]) => entryValue !== undefined);
    if (entries.length === 0) {
      return '{}';
    }
    return `{\n${entries.map(([key, entryValue]) => `${nextPad}${key}: ${toTypeScript(entryValue, indent + 2)}`).join(',\n')},\n${pad}}`;
  }
  return JSON.stringify(value);
}
