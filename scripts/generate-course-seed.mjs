import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url)).replace(/\\scripts$/, '');
const seedPath = join(root, 'data', 'courses', 'course-seed.json');
const coversDir = join(root, 'apps', 'sdkwork-claw-router-portal', 'public', 'assets', 'courses', 'covers');
const avatarsDir = join(root, 'apps', 'sdkwork-claw-router-portal', 'public', 'assets', 'courses', 'avatars');
const generatedAt = '2026-05-12T00:00:00Z';
const courseCount = 216;

const categories = [
  {
    id: 30002001,
    code: 'ai-coding',
    name: 'AI Coding',
    description: 'Claude Code, OpenAI Codex, Codex CLI, AI coding, writing code, MCP, and production verification courses.',
    iconKey: 'terminal-square',
    sortWeight: 10,
    tags: ['Claude Code', 'Codex', 'AI Coding', '写代码'],
    palette: ['#0f172a', '#2563eb', '#22d3ee'],
  },
  {
    id: 30002002,
    code: 'openclaw-agent',
    name: 'OpenClaw 智能体',
    description: 'OpenClaw, OpenClaw 养虾指南, Agent workspace setup, agent capability design, and application delivery courses.',
    iconKey: 'bot',
    sortWeight: 20,
    tags: ['OpenClaw', '智能体', 'Agent', '养虾指南'],
    palette: ['#111827', '#dc2626', '#f59e0b'],
  },
  {
    id: 30002003,
    code: 'agent-workflow',
    name: '智能体工作流',
    description: 'Dify, Coze, LangGraph, RAG, Function Calling, multi-agent workflow, and AgentOps courses.',
    iconKey: 'workflow',
    sortWeight: 30,
    tags: ['Dify', 'Coze', 'LangGraph', '智能体'],
    palette: ['#082f49', '#059669', '#a3e635'],
  },
  {
    id: 30002004,
    code: 'ai-image-creation',
    name: '即梦 AI 图片制作',
    description: '即梦、AI 图片制作、图像控制、局部重绘、角色一致性 and commercial visual asset courses.',
    iconKey: 'image',
    sortWeight: 40,
    tags: ['即梦', '图片制作', 'AI Painting'],
    palette: ['#1f2937', '#db2777', '#f97316'],
  },
  {
    id: 30002005,
    code: 'ai-video-creation',
    name: '即梦 AI 视频制作',
    description: '即梦、可灵、Runway, Pika, AI 视频制作, image-to-video, editing, voiceover, and publishing courses.',
    iconKey: 'clapperboard',
    sortWeight: 50,
    tags: ['即梦', '可灵', 'AI Video', '视频制作'],
    palette: ['#18181b', '#7c3aed', '#06b6d4'],
  },
  {
    id: 30002006,
    code: 'ai-short-drama',
    name: 'AI 短剧制作',
    description: 'AI 短剧、AI 漫剧、脚本、分镜、角色、配音、剪辑 and release workflow courses.',
    iconKey: 'film',
    sortWeight: 60,
    tags: ['短剧', 'AI 漫剧', '分镜', '可灵'],
    palette: ['#111827', '#e11d48', '#facc15'],
  },
  {
    id: 30002007,
    code: 'ai-productivity',
    name: 'AI 办公与生产力',
    description: 'AI office automation, research, documents, presentations, spreadsheets, and knowledge work courses.',
    iconKey: 'briefcase',
    sortWeight: 70,
    tags: ['AI 办公', '知识库', '自动化'],
    palette: ['#0c4a6e', '#0284c7', '#f8fafc'],
  },
  {
    id: 30002008,
    code: 'ai-marketing-content',
    name: 'AI 内容营销',
    description: 'AI content marketing, social media planning, copywriting, video account operations, and growth courses.',
    iconKey: 'megaphone',
    sortWeight: 80,
    tags: ['内容营销', '小红书', '短视频'],
    palette: ['#312e81', '#f43f5e', '#fbbf24'],
  },
  {
    id: 30002009,
    code: 'ai-design-commerce',
    name: 'AI 设计电商',
    description: 'AI design, product images, e-commerce poster, digital human display, and brand visual courses.',
    iconKey: 'palette',
    sortWeight: 90,
    tags: ['电商图', '海报', '设计'],
    palette: ['#164e63', '#14b8a6', '#f97316'],
  },
  {
    id: 30002010,
    code: 'ai-data-automation',
    name: 'AI 数据与自动化',
    description: 'AI data analysis, crawler workflow, low-code automation, enterprise assistant, and dashboard courses.',
    iconKey: 'database-zap',
    sortWeight: 100,
    tags: ['数据分析', '自动化', 'RPA'],
    palette: ['#1e293b', '#65a30d', '#38bdf8'],
  },
].map((category) => ({
  ...category,
  uuid: `sdkwork-course-category-${category.code}`,
}));

const instructors = [
  {
    key: 'sdkwork-academy',
    name: 'SDKWork Academy',
    title: 'AI Coding Curriculum Team',
    bio: 'Curates practical AI coding courses from Bilibili and local tutorial uploads.',
  },
  {
    key: 'sdkwork-agent-lab',
    name: 'SDKWork Agent Lab',
    title: 'Agent Curriculum Team',
    bio: 'Builds OpenClaw and intelligent agent learning tracks for product teams.',
  },
  {
    key: 'sdkwork-creative-lab',
    name: 'SDKWork Creative Lab',
    title: 'AI Creation Curriculum Team',
    bio: 'Curates image, video, and short drama courses for creators and operators.',
  },
  {
    key: 'sdkwork-growth-lab',
    name: 'SDKWork Growth Lab',
    title: 'AI Business Curriculum Team',
    bio: 'Turns AI tools into repeatable business, marketing, and automation workflows.',
  },
];

function mediaResource(locator, kind = 'image', title) {
  return {
    kind,
    source: locator.startsWith('data:') ? 'data_url' : 'external_url',
    url: locator,
    publicUrl: locator,
    ...(title ? { title } : {}),
  };
}

function providerVideoResource(externalBvid) {
  return {
    kind: 'video',
    source: 'provider_asset',
    uri: externalBvid,
    provider: 'bilibili',
  };
}

const categoryBvidPools = {
  'ai-coding': [
    'BV14rzQB9EJj',
    'BV11erUBUEEX',
    'BV1Kk9kBAEJv',
    'BV1oJAoz2Emf',
    'BV13KR1BEEBm',
    'BV1n55BztEwJ',
    'BV11q6cB7EQd',
    'BV1Ag5BzwEgi',
    'BV15G58zoEcQ',
    'BV1HP5ezUEqg',
    'BV1stQgBvEmU',
    'BV1kPAXz3Eqe',
  ],
  'openclaw-agent': [
    'BV1sMZ5B4EEY',
    'BV1WbPTzHEaa',
    'BV1X4wAzEEMe',
    'BV1dqffBMEcg',
    'BV1mScqzqEDN',
    'BV1Vcf4BCE5Q',
    'BV1S1fiBeEFo',
    'BV123AbzEEY9',
    'BV1Npw7zEE9x',
    'BV1GtDHB3ECC',
  ],
  'agent-workflow': [
    'BV1aA6uBCEvD',
    'BV1kPAXz3Eqe',
    'BV1X4wAzEEMe',
    'BV1mScqzqEDN',
    'BV1BPPozDE9S',
    'BV1Vcf4BCE5Q',
    'BV1Npw7zEE9x',
    'BV1q8fwB2Ewr',
  ],
  'ai-image-creation': [
    'BV1oPPheLEw5',
    'BV1MNADeWEgm',
    'BV15QYwzwE6A',
    'BV1LtKWeeEnz',
    'BV15sXxYTEge',
    'BV1XJkYY4EmX',
    'BV1AAjUzeETf',
    'BV1xB9XYKE1u',
    'BV1GH1aBtEzS',
    'BV1yTgPz8EeQ',
  ],
  'ai-video-creation': [
    'BV19Z421M7LD',
    'BV1R2dHBdEH1',
    'BV17PciznECE',
    'BV1oZTszNEWV',
    'BV18mgkz2EHB',
    'BV1WhBLYHEmx',
    'BV1yTgPz8EeQ',
    'BV1cS411A7Wp',
  ],
  'ai-short-drama': [
    'BV1R2dHBdEH1',
    'BV1rvPrz5ESn',
    'BV1DmQmBjE5v',
    'BV1rRPHzfE9x',
    'BV1YuWkzSEpL',
    'BV1dqWSzCEwS',
    'BV1TUbgzaEhf',
    'BV17PciznECE',
  ],
  'ai-productivity': [
    'BV1kPAXz3Eqe',
    'BV1VUzrBuE9q',
    'BV1mVXYBTEwZ',
    'BV1aA6uBCEvD',
    'BV1rUJZzeEhK',
    'BV1wG6qB3Eor',
  ],
  'ai-marketing-content': [
    'BV17PciznECE',
    'BV1rvPrz5ESn',
    'BV1MNADeWEgm',
    'BV1LtKWeeEnz',
    'BV1oZTszNEWV',
    'BV1yTgPz8EeQ',
  ],
  'ai-design-commerce': [
    'BV1MNADeWEgm',
    'BV15sXxYTEge',
    'BV1LtKWeeEnz',
    'BV1xB9XYKE1u',
    'BV15QYwzwE6A',
    'BV1XJkYY4EmX',
  ],
  'ai-data-automation': [
    'BV1VUzrBuE9q',
    'BV11erUBUEEX',
    'BV1n55BztEwJ',
    'BV1Kk9kBAEJv',
    'BV1e4JtzTESc',
    'BV1oJAoz2Emf',
  ],
};

const fallbackBvidPool = [
  'BV18VX2ByEfA',
  'BV1vsZWBiEyM',
  'BV14rzQB9EJj',
  'BV1oPPheLEw5',
  'BV19Z421M7LD',
  'BV1cS411A7Wp',
  'BV1FAiPBeEZf',
  'BV1uT421k7jN',
  'BV1cN411y7K8',
  'BV1HM411X7yS',
  'BV1QK4y1u7Z2',
  'BV1xx411c7mD',
];

const tracks = {
  'ai-coding': [
    'Claude Code 工程项目实战',
    'OpenAI Codex CLI 写代码入门',
    'Codex AGENTS.md 团队规范',
    'Claude Code MCP 工具链',
    'AI 编程代码审查',
    '前端应用重构与测试',
    'Rust 服务端 AI 协作',
    '智能 IDE 与云端任务',
    'AI 写代码安全基线',
    'Agentic Coding 交付流水线',
  ],
  'openclaw-agent': [
    'OpenClaw 快速入门',
    'OpenClaw 养虾指南工作流',
    'OpenClaw 应用插件开发',
    'OpenClaw 智能体角色设计',
    'OpenClaw 多模型路由',
    'OpenClaw 企业知识助手',
    'OpenClaw 工具调用实战',
    'OpenClaw 工作台发布',
    'OpenClaw 团队协作规范',
    'OpenClaw AgentOps 运维',
  ],
  'agent-workflow': [
    'Dify 智能体编排',
    'Coze 扣子 Bot 工作流',
    'LangGraph 多智能体协作',
    'RAG 知识库问答',
    'Function Calling 工具调用',
    'MCP Server 接入',
    '多智能体任务分解',
    '客服智能体上线',
    '销售线索智能体',
    'Agent 评测与监控',
  ],
  'ai-image-creation': [
    '即梦 AI 图片制作',
    'DeepSeek + 即梦海报设计',
    'AI 图片提示词工程',
    '角色一致性图片生成',
    '局部重绘与扩图',
    '电商主图制作',
    '小红书封面设计',
    '品牌视觉素材库',
    'AI 插画风格训练',
    '图片制作商用审核',
  ],
  'ai-video-creation': [
    '即梦 AI 视频制作',
    '可灵图生视频实战',
    'Runway 镜头生成',
    'Pika 动态镜头',
    'AI 视频脚本到成片',
    'AI 配音与音效',
    '剪映智能剪辑',
    '数字人口播视频',
    '视频制作发布检查',
    'AI 视频素材管理',
  ],
  'ai-short-drama': [
    'AI 短剧制作入门',
    '短剧剧本与爽点设计',
    'AI 分镜脚本生成',
    '短剧角色图一致性',
    '可灵短剧镜头生成',
    '即梦短剧视觉开发',
    'AI 漫剧制作流程',
    '短剧配音与字幕',
    '短剧剪辑节奏',
    'AI 短剧矩阵发布',
  ],
  'ai-productivity': [
    'AI 文档写作',
    'AI PPT 生成',
    'AI 表格分析',
    '知识库整理',
    '会议纪要自动化',
    '研究报告助手',
    '企业 SOP 生成',
    'AI 邮件与客服',
    '办公流程自动化',
    '个人知识管理',
  ],
  'ai-marketing-content': [
    'AI 小红书选题',
    'AI 短视频脚本',
    'AI 直播切片',
    '内容营销日历',
    '社媒文案矩阵',
    '品牌账号冷启动',
    'AI 爆款标题',
    '带货视频制作',
    '私域内容运营',
    '增长实验复盘',
  ],
  'ai-design-commerce': [
    'AI 电商商品图',
    'AI 海报批量生产',
    '详情页视觉制作',
    '服装模特换装',
    '包装设计提案',
    '品牌 KV 生成',
    '活动物料制作',
    'AI 商拍修图',
    '跨境电商素材',
    '视觉资产审核',
  ],
  'ai-data-automation': [
    'AI 数据分析入门',
    '爬虫与信息整理',
    '低代码自动化',
    'RPA 助手搭建',
    '数据看板生成',
    'Excel Agent 实战',
    '运营日报自动化',
    '合同信息抽取',
    '财务数据核对',
    '企业自动化治理',
  ],
};

const firstCourses = [
  {
    courseCode: 'c1',
    category: 'ai-coding',
    title: '飞书 CLI 与 Claude Code/Codex 远程开发实战',
    description: '基于 Bilibili 的飞书 CLI、Claude Code、Codex 课程，覆盖远程开发、Agent 协作、上下文规则和生产任务交付。',
    tags: ['Claude Code', 'Codex', 'Remote Development', 'AI Coding'],
    externalBvid: 'BV18VX2ByEfA',
    content: '从飞书 CLI、Claude Code 和 Codex 远程协作入手，把上下文规则、团队流程和真实项目交付连接起来。',
    instructorKey: 'sdkwork-academy',
    durationText: '3h 20m',
    ratingScore: '4.9',
    studentsCount: 3851,
    level: 1,
    isCollection: true,
    publishedAt: '2026-05-16T14:00:00Z',
    engagement: { views: 3851, likes: 155, saves: 22, shares: 11 },
  },
  {
    courseCode: 'c2',
    category: 'ai-coding',
    title: 'OpenAI Codex CLI 超级入门教程',
    description: '面向在线学习的 Codex 课程，覆盖 Codex CLI、IDE 协作、AGENTS.md、代码审查、上下文处理、MCP 和云端任务委派。',
    tags: ['Codex', 'Codex CLI', 'AGENTS.md', 'MCP', 'Security'],
    externalBvid: 'BV1vsZWBiEyM',
    content: '学习 Codex 从仓库阅读、代码审查、命令行会话到云端任务委派的完整工程闭环。',
    instructorKey: 'sdkwork-academy',
    durationText: '2h 10m',
    ratingScore: '4.8',
    studentsCount: 6808,
    level: 3,
    isCollection: false,
    publishedAt: '2026-05-16T13:00:00Z',
    engagement: { views: 6808, likes: 984, saves: 269, shares: 85 },
  },
  {
    courseCode: 'c3',
    category: 'ai-coding',
    title: 'Claude Code 从 0 到 1 全攻略',
    description: '面向真实项目的 Claude Code 课程，从安装授权、Plan Mode、MCP、图片处理、上下文压缩到 Hook、Agent Skill 和 SubAgent。',
    tags: ['Claude Code', 'MCP', 'Playwright', 'Parallel Tasks'],
    externalBvid: 'BV14rzQB9EJj',
    content: '把 Claude Code 应用到真实工程系统，系统学习 Plan Mode、MCP、后台任务、图片处理、Hook、Agent Skill 和 SubAgent。',
    instructorKey: 'sdkwork-academy',
    durationText: '5h 40m',
    ratingScore: '4.7',
    studentsCount: 59000,
    level: 2,
    isCollection: false,
    publishedAt: '2026-05-16T12:00:00Z',
    engagement: { views: 59000, likes: 2300, saves: 760, shares: 180 },
  },
  {
    courseCode: 'c4',
    category: 'ai-image-creation',
    title: 'DeepSeek + 即梦 AI 图片制作',
    description: '围绕 DeepSeek + 即梦 AI 生成图片的在线课程，覆盖图片描述词、图片制作、局部重绘、角色一致性和商业海报素材。',
    tags: ['即梦', '图片制作', 'AI Painting', 'Image Control'],
    externalBvid: 'BV1oPPheLEw5',
    content: '从提示词、参考图、局部重绘到角色一致性，构建稳定的即梦 AI 图片制作工作流。',
    instructorKey: 'sdkwork-creative-lab',
    durationText: '1h 45m',
    ratingScore: '4.9',
    studentsCount: 100000,
    level: 2,
    isCollection: true,
    publishedAt: '2026-05-16T11:00:00Z',
    engagement: { views: 100000, likes: 4100, saves: 1800, shares: 390 },
  },
  {
    courseCode: 'c5',
    category: 'ai-video-creation',
    title: '即梦 AI 视频制作零基础教程',
    description: '即梦 AI 视频制作零基础课，覆盖脚本、分镜图、AI 视频生成、配音、音效、剪辑和 AI 漫剧生产流程。',
    tags: ['即梦', 'AI Video', 'AI Comics', '视频制作', 'Voiceover', 'Editing'],
    externalBvid: 'BV19Z421M7LD',
    content: '从脚本和分镜到图生视频、配音、音效和成片剪辑，完成一套即梦 AI 视频制作课程。',
    instructorKey: 'sdkwork-creative-lab',
    durationText: '6h 30m',
    ratingScore: '4.9',
    studentsCount: 6097,
    level: 3,
    isCollection: true,
    publishedAt: '2026-05-16T10:00:00Z',
    engagement: { views: 6097, likes: 761, saves: 208, shares: 65 },
  },
  {
    courseCode: 'c6',
    category: 'ai-video-creation',
    title: 'AI 图片到视频创作工作流',
    description: '把 AI 图片制作、图生视频、运镜短片、剪辑和本地上传教程资产连接起来的入门课程。',
    tags: ['AI Image', '图片制作', 'AI Video', '视频制作', 'Local Upload', 'Security'],
    externalBvid: 'BV1cS411A7Wp',
    content: '将 AI 图片制作、图生视频和本地上传教程组合为可复用的短视频生产工作流，并加入素材安全检查。',
    instructorKey: 'sdkwork-creative-lab',
    durationText: '4h 50m',
    ratingScore: '4.6',
    studentsCount: 776,
    level: 1,
    isCollection: false,
    publishedAt: '2026-05-16T09:00:00Z',
    engagement: { views: 776, likes: 107, saves: 30, shares: 9 },
  },
];

const levelNames = {
  1: '入门',
  2: '进阶',
  3: '高级',
};

const courses = [];
const sections = [];
const lessons = [];
const relations = [];
const comments = [];

for (let index = 0; index < courseCount; index += 1) {
  const courseCode = `c${index + 1}`;
  const first = firstCourses[index];
  const category = first?.category ?? categories[index % categories.length].code;
  const categoryMeta = categories.find((item) => item.code === category);
  const trackList = tracks[category];
  const track = trackList[Math.floor(index / categories.length) % trackList.length];
  const level = first?.level ?? ((index % 3) + 1);
  const title = first?.title ?? `${track} ${levelNames[level]}实战 ${String(Math.floor(index / categories.length) + 1).padStart(2, '0')}`;
  const description = first?.description ?? `${title} 在线教程，覆盖 ${categoryMeta.tags.join('、')}，包含可内嵌的 Bilibili 视频课程和本地上传视频教程。`;
  const tags = first?.tags ?? buildTags(categoryMeta, track, index);
  const externalBvid = first?.externalBvid ?? bvidForCategory(category, index, 0);
  const instructorKey = first?.instructorKey ?? instructorForCategory(category);
  const instructor = instructors.find((item) => item.key === instructorKey);
  const courseId = 30001001 + index;
  const publishedAt = first?.publishedAt ?? publishedAtForIndex(index);
  const studentsCount = first?.studentsCount ?? 1200 + ((index * 379) % 96000);
  const engagement = first?.engagement ?? {
    views: studentsCount + ((index * 97) % 24000),
    likes: Math.max(36, Math.round(studentsCount * (0.065 + (index % 7) * 0.006))),
    saves: Math.max(12, Math.round(studentsCount * (0.026 + (index % 5) * 0.003))),
    shares: Math.max(5, Math.round(studentsCount * (0.009 + (index % 4) * 0.002))),
  };
  const durationMinutes = first ? null : 74 + ((index * 13) % 360);
  const durationText = first?.durationText ?? `${Math.floor(durationMinutes / 60)}h ${durationMinutes % 60}m`;
  const ratingScore = first?.ratingScore ?? (4.5 + (index % 5) * 0.1).toFixed(1);
  const content = first?.content ?? buildCourseContent(category, title, track);

  courses.push({
    id: courseId,
    uuid: `sdkwork-course-${courseCode}`,
    courseCode,
    title,
    description,
    thumbnail: mediaResource(`/assets/courses/covers/${category}.svg`, 'image', category),
    instructor: {
      name: instructor.name,
      avatar: mediaResource(`/assets/courses/avatars/${instructor.key}.svg`, 'image', instructor.name),
      title: instructor.title,
      bio: instructor.bio,
    },
    durationText,
    lessonsCount: 3,
    ratingScore,
    studentsCount,
    level,
    category,
    tags,
    externalBvid,
    content,
    priceAmount: null,
    currency: 'CNY',
    isCollection: first?.isCollection ?? index % 4 === 0,
    publishedAt,
    engagement,
  });

  sections.push({
    id: 30003001 + index,
    uuid: `sdkwork-course-${courseCode}-section-1`,
    courseCode,
    sectionNo: 1,
    title: '核心课程',
    description: `${title} 的在线学习主线，混合 Bilibili 嵌入视频和本地上传视频教程。`,
    sortOrder: 10,
    lessonCount: 3,
    durationSeconds: 2820 + (index % 8) * 300,
  });

  const lessonBase = 30004001 + index * 3;
  lessons.push(
    {
      id: lessonBase,
      uuid: `sdkwork-course-${courseCode}-lesson-1`,
      courseCode,
      sectionNo: 1,
      lessonNo: 1,
      title: `${track}：课程导学`,
      description: `通过 Bilibili 课程了解 ${title} 的应用场景、工具准备和学习路径。`,
      video: providerVideoResource(externalBvid),
      externalBvid,
      sourceProvider: 'bilibili',
      durationSeconds: 720 + (index % 6) * 60,
      durationText: `${12 + (index % 6)}:00`,
      content: `${categoryMeta.name} 的课程导学，适合在线学习和团队统一训练。`,
      sortOrder: 10,
      freePreview: true,
    },
    {
      id: lessonBase + 1,
      uuid: `sdkwork-course-${courseCode}-lesson-2`,
      courseCode,
      sectionNo: 1,
      lessonNo: 2,
      title: `${track}：关键步骤拆解`,
      description: `继续使用 Bilibili 嵌入视频拆解 ${categoryMeta.tags.slice(0, 3).join('、')} 的核心操作。`,
      video: providerVideoResource(bvidForCategory(category, index, 3)),
      externalBvid: bvidForCategory(category, index, 3),
      sourceProvider: 'bilibili',
      durationSeconds: 900 + (index % 5) * 90,
      durationText: `${15 + (index % 5) * 2}:00`,
      content: `把工具调用、素材准备、提示词、验证和发布流程拆成可以复盘的学习步骤。`,
      sortOrder: 20,
      freePreview: index % 2 === 0,
    },
    {
      id: lessonBase + 2,
      uuid: `sdkwork-course-${courseCode}-lesson-3`,
      courseCode,
      sectionNo: 1,
      lessonNo: 3,
      title: `${track}：本地上传实战教程`,
      description: `使用平台本地上传视频复盘 ${title} 的完整实操过程。`,
      video: mediaResource(`/uploads/courses/${courseCode}/local-uploaded-tutorial.mp4`, 'video'),
      externalBvid: '',
      sourceProvider: 'local',
      durationSeconds: 600 + (index % 4) * 120,
      durationText: `${10 + (index % 4) * 2}:00`,
      content: `本地上传视频用于承载团队自制教程、版权受控素材和内部复盘内容。`,
      sortOrder: 30,
      freePreview: index % 3 === 0,
    },
  );

  comments.push({
    id: 30006001 + index,
    uuid: `sdkwork-course-${courseCode}-comment-1`,
    courseCode,
    userId: 301 + (index % 70),
    content: commentForCategory(category, title),
    likes: 8 + (index % 47),
    createdAt: publishedAtForIndex(index + 6),
  });
}

for (let index = 0; index < courseCount; index += 1) {
  const courseCode = `c${index + 1}`;
  const relatedCodes = relationTargets(index);
  relatedCodes.forEach((relatedCourseCode, relatedIndex) => {
    relations.push({
      id: 30005001 + index * 2 + relatedIndex,
      uuid: `sdkwork-course-${courseCode}-related-${relatedCourseCode}`,
      courseCode,
      relatedCourseCode,
      relationType: 1,
      sortOrder: (relatedIndex + 1) * 10,
    });
  });
}

writeAssets();
writeFileSync(seedPath, `${JSON.stringify({
  schemaVersion: 1,
  kind: 'sdkwork-claw-router-course-seed',
  generatedAt,
  categories: categories.map(({ palette: _palette, ...category }) => category),
  courses,
  sections,
  lessons,
  relations,
  comments,
}, null, 2)}\n`, 'utf8');

console.log(`Generated ${courses.length} courses, ${lessons.length} lessons, ${relations.length} relations.`);

function buildTags(category, track, index) {
  const shared = ['Bilibili', 'Local Upload', '在线学习'];
  const topicTags = category.tags;
  const variants = [
    '实战教程',
    '工作流',
    '案例复盘',
    '团队标准',
    '提示词',
    '发布检查',
  ];
  return Array.from(new Set([track, ...topicTags, shared[index % shared.length], variants[index % variants.length]])).slice(0, 6);
}

function buildCourseContent(categoryCode, title, track) {
  const map = {
    'ai-coding': `${title} 聚焦 Claude Code、Codex、写代码、测试、代码审查和交付验证。`,
    'openclaw-agent': `${title} 聚焦 OpenClaw、智能体能力设计、工具调用和应用上线。`,
    'agent-workflow': `${title} 聚焦智能体工作流、Dify、Coze、LangGraph、RAG 和多智能体协作。`,
    'ai-image-creation': `${title} 聚焦即梦、图片制作、角色一致性、局部重绘和商业素材生产。`,
    'ai-video-creation': `${title} 聚焦即梦、可灵、AI 视频制作、图生视频、配音和剪辑发布。`,
    'ai-short-drama': `${title} 聚焦 AI 短剧、AI 漫剧、分镜、角色、镜头、配音和矩阵发布。`,
    'ai-productivity': `${title} 聚焦 AI 办公、文档、演示、表格、会议纪要和知识管理。`,
    'ai-marketing-content': `${title} 聚焦 AI 内容营销、短视频脚本、账号运营和增长复盘。`,
    'ai-design-commerce': `${title} 聚焦 AI 设计、电商图、海报、商拍修图和视觉资产审核。`,
    'ai-data-automation': `${title} 聚焦 AI 数据分析、自动化、RPA、看板和企业流程治理。`,
  };
  return map[categoryCode] ?? `${title} 聚焦 ${track} 的在线教程和实战复盘。`;
}

function instructorForCategory(category) {
  if (category === 'ai-coding') {
    return 'sdkwork-academy';
  }
  if (category === 'openclaw-agent' || category === 'agent-workflow') {
    return 'sdkwork-agent-lab';
  }
  if (category.includes('creation') || category === 'ai-short-drama' || category === 'ai-design-commerce') {
    return 'sdkwork-creative-lab';
  }
  return 'sdkwork-growth-lab';
}

function bvidForCategory(category, index, offset = 0) {
  const pool = categoryBvidPools[category] ?? fallbackBvidPool;
  return pool[(index + offset) % pool.length];
}

function publishedAtForIndex(index) {
  const date = new Date(Date.UTC(2026, 4, 12, 9, 0, 0));
  date.setUTCMinutes(date.getUTCMinutes() + index * 7);
  return date.toISOString().replace('.000Z', 'Z');
}

function commentForCategory(category, title) {
  if (category === 'ai-coding') {
    return `${title} 对 Claude Code、Codex 和写代码流程很实用。`;
  }
  if (category === 'openclaw-agent') {
    return `${title} 把 OpenClaw 智能体课程拆得很清楚。`;
  }
  if (category === 'agent-workflow') {
    return `${title} 适合系统学习智能体工作流。`;
  }
  if (category === 'ai-image-creation') {
    return `${title} 的即梦图片制作案例很容易跟练。`;
  }
  if (category === 'ai-video-creation') {
    return `${title} 的视频制作链路清晰，本地教程也方便复盘。`;
  }
  if (category === 'ai-short-drama') {
    return `${title} 覆盖短剧脚本、分镜和成片流程。`;
  }
  return `${title} 的在线教程适合团队集中学习。`;
}

function relationTargets(index) {
  if (index === 0) {
    return ['c2', 'c6'];
  }
  if (index === 1) {
    return ['c1', 'c5'];
  }
  const sameCategory = [];
  const currentCategory = courses[index].category;
  for (let offset = 1; offset < courseCount && sameCategory.length < 2; offset += 1) {
    const candidateIndex = (index + offset) % courseCount;
    if (candidateIndex !== index && courses[candidateIndex].category === currentCategory) {
      sameCategory.push(courses[candidateIndex].courseCode);
    }
  }
  if (sameCategory.length < 2) {
    sameCategory.push(`c${((index + 1) % courseCount) + 1}`);
  }
  return sameCategory.slice(0, 2);
}

function writeAssets() {
  mkdirSync(coversDir, { recursive: true });
  mkdirSync(avatarsDir, { recursive: true });
  for (const category of categories) {
    writeFileSync(
      join(coversDir, `${category.code}.svg`),
      coverSvg(category.name, category.code, category.palette, category.iconKey),
      'utf8',
    );
  }
  for (const instructor of instructors) {
    writeFileSync(
      join(avatarsDir, `${instructor.key}.svg`),
      avatarSvg(instructor.name, instructor.key),
      'utf8',
    );
  }
  writeFileSync(join(avatarsDir, 'learner.svg'), avatarSvg('Learner', 'learner'), 'utf8');
}

function coverSvg(name, code, palette, icon) {
  const [base, accent, highlight] = palette;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="960" height="540" viewBox="0 0 960 540" role="img" aria-label="${escapeXml(name)} course cover">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${base}"/>
      <stop offset="0.58" stop-color="${accent}"/>
      <stop offset="1" stop-color="${highlight}"/>
    </linearGradient>
    <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
      <path d="M 48 0 L 0 0 0 48" fill="none" stroke="rgba(255,255,255,0.16)" stroke-width="1"/>
    </pattern>
  </defs>
  <rect width="960" height="540" rx="0" fill="url(#bg)"/>
  <rect width="960" height="540" fill="url(#grid)" opacity="0.55"/>
  <circle cx="770" cy="98" r="150" fill="rgba(255,255,255,0.16)"/>
  <circle cx="126" cy="456" r="118" fill="rgba(15,23,42,0.22)"/>
  <rect x="72" y="82" width="116" height="116" rx="28" fill="rgba(255,255,255,0.16)" stroke="rgba(255,255,255,0.36)" stroke-width="2"/>
  <path d="${iconPath(icon)}" fill="none" stroke="white" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>
  <text x="72" y="310" fill="white" font-family="Arial, 'Microsoft YaHei', sans-serif" font-size="54" font-weight="700">${escapeXml(name)}</text>
  <text x="76" y="368" fill="rgba(255,255,255,0.82)" font-family="Arial, 'Microsoft YaHei', sans-serif" font-size="28">Bilibili + Local Upload Tutorial</text>
  <text x="76" y="426" fill="rgba(255,255,255,0.72)" font-family="Arial, 'Microsoft YaHei', sans-serif" font-size="22">${escapeXml(code)}</text>
</svg>
`;
}

function avatarSvg(name, key) {
  const initials = name
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
  const colors = {
    'sdkwork-academy': ['#0f172a', '#2563eb'],
    'sdkwork-agent-lab': ['#14532d', '#16a34a'],
    'sdkwork-creative-lab': ['#831843', '#f97316'],
    'sdkwork-growth-lab': ['#312e81', '#f43f5e'],
    learner: ['#334155', '#64748b'],
  }[key] ?? ['#1f2937', '#475569'];
  return `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160" role="img" aria-label="${escapeXml(name)} avatar">
  <defs>
    <linearGradient id="avatar-bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${colors[0]}"/>
      <stop offset="1" stop-color="${colors[1]}"/>
    </linearGradient>
  </defs>
  <rect width="160" height="160" rx="80" fill="url(#avatar-bg)"/>
  <circle cx="116" cy="38" r="34" fill="rgba(255,255,255,0.16)"/>
  <text x="80" y="94" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="42" font-weight="700">${escapeXml(initials)}</text>
</svg>
`;
}

function iconPath(icon) {
  const paths = {
    'terminal-square': 'M102 116h56M102 164l28-28-28-28M78 94h84v92H78z',
    bot: 'M100 112h60v52h-60zM116 112V94h28v18M116 136h1M144 136h1M112 170h36',
    workflow: 'M96 110h36M132 110v54M132 164h36M96 110a18 18 0 1 0 0.1 0M168 164a18 18 0 1 0 0.1 0',
    image: 'M82 96h96v92H82zM102 168l24-28 18 20 14-16 20 24M114 124h1',
    clapperboard: 'M78 112h104v76H78zM84 112l22-32h28l-22 32M132 112l22-32h28l-22 32',
    film: 'M78 96h104v92H78zM100 96v92M160 96v92M78 124h104M78 160h104',
    briefcase: 'M82 116h100v64H82zM116 116v-18h32v18M82 142h100',
    megaphone: 'M86 136l74-34v72l-74-30zM86 136v28M116 154l14 30',
    palette: 'M132 88a56 56 0 1 0 38 98c10-10 4-24-10-24h-14c-10 0-18-8-18-18 0-10 8-18 18-18h10c10 0 12-14 4-22a56 56 0 0 0-28-16zM104 126h1M120 108h1M146 108h1',
    'database-zap': 'M86 106c0-16 94-16 94 0s-94 16-94 0M86 106v64c0 16 94 16 94 0v-64M126 136l-14 28h22l-12 24',
  };
  return paths[icon] ?? paths.image;
}

function escapeXml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}
