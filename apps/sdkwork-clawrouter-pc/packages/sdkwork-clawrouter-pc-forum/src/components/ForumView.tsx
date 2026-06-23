import { useEffect, useState } from 'react';
import type { FormEvent, ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Clock,
  Heart,
  MessageCircle,
  MessageSquare,
  Music,
  PenSquare,
  Search,
  ThumbsUp,
  TrendingUp,
  Users,
  Video,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

import {
  buildPortalAuthLoginRedirect,
  hasStoredPortalSession,
  readMediaResourceUrl,
} from 'sdkwork-clawrouter-pc-commons/runtime';
import {
  deriveForumCatalogViewModel,
  type ForumCategory,
  type ForumCategoryFilter,
  type ForumCommunityLinkView,
  type ForumOverviewViewInput,
  type ForumPost,
  type ForumSortKey,
} from '../forumCatalog';
import { forumService } from '../forumService.ts';

const communityToneClassById: Record<ForumCommunityLinkView['tone'], string> = {
  green: 'hover:border-[#07C160]/50 dark:hover:border-[#07C160]/50',
  blue: 'hover:border-[#12B7F5]/50 dark:hover:border-[#12B7F5]/50',
  teal: 'hover:border-[#00D6B9]/50 dark:hover:border-[#00D6B9]/50',
  red: 'hover:border-[#FA5151]/50 dark:hover:border-[#FA5151]/50',
  pink: 'hover:border-[#FE2C55]/50 dark:hover:border-[#FE2C55]/50',
};

const forumCategoryIds: Record<ForumCategory, number> = {
  'General Discussion': 1000,
  Performance: 1001,
  'Best Practices': 1002,
  'Help & Support': 1003,
  Announcements: 1004,
};

const composerCategories: ForumCategory[] = [
  'General Discussion',
  'Performance',
  'Best Practices',
  'Help & Support',
  'Announcements',
];

const emptyForumOverview: ForumOverviewViewInput = {
  totalPosts: 0,
  memberCount: 0,
  onlineMembers: 0,
  communityLinks: [],
};

export function ForumView() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState<ForumCategoryFilter>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSort, setActiveSort] = useState<ForumSortKey>('latest');
  const [forumPosts, setForumPosts] = useState<ForumPost[]>([]);
  const [forumOverview, setForumOverview] = useState<ForumOverviewViewInput>(emptyForumOverview);
  const [loadingFailed, setLoadingFailed] = useState(false);
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [newDiscussionTitle, setNewDiscussionTitle] = useState('');
  const [newDiscussionContent, setNewDiscussionContent] = useState('');
  const [newDiscussionCategory, setNewDiscussionCategory] = useState<ForumCategory>('General Discussion');
  const [newDiscussionTags, setNewDiscussionTags] = useState('');
  const [isCreatingDiscussion, setIsCreatingDiscussion] = useState(false);
  const [composerError, setComposerError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    Promise.allSettled([
      forumService.fetchForumFeeds({ size: 50 }),
      forumService.fetchForumOverview(),
    ])
      .then(([postsResult, overviewResult]) => {
        if (cancelled) {
          return;
        }
        if (postsResult.status === 'fulfilled') {
          setForumPosts(postsResult.value);
        }
        if (overviewResult.status === 'fulfilled') {
          const overview = overviewResult.value;
          setForumOverview({
            totalPosts: overview.stats.totalPosts,
            memberCount: overview.stats.memberCount,
            onlineMembers: overview.stats.onlineMembers,
            communityLinks: overview.communityLinks,
            source: overview.source,
          });
        }
        setLoadingFailed(postsResult.status === 'rejected' || overviewResult.status === 'rejected');
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const view = deriveForumCatalogViewModel({
    posts: forumPosts,
    filters: {
      category: activeCategory,
      searchQuery,
      sort: activeSort,
    },
    overview: forumOverview,
  });

  const requirePortalLoginForAction = () => {
    if (hasStoredPortalSession()) {
      return true;
    }
    navigate(buildPortalAuthLoginRedirect(location));
    return false;
  };

  const openComposer = () => {
    if (!requirePortalLoginForAction()) {
      return;
    }
    setIsComposerOpen((value) => !value);
  };

  const submitNewDiscussion = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!requirePortalLoginForAction()) {
      return;
    }
    const content = newDiscussionContent.trim();
    const title = newDiscussionTitle.trim();
    if (!title || !content) {
      setComposerError('Title and discussion content are required.');
      return;
    }

    setIsCreatingDiscussion(true);
    setComposerError(null);
    try {
      const created = await forumService.createForumFeed({
        title,
        content,
        categoryId: forumCategoryIds[newDiscussionCategory],
        tags: newDiscussionTags.split(',').map((tag) => tag.trim()).filter(Boolean),
      });
      setForumPosts((posts) => [created, ...posts.filter((post) => post.id !== created.id)]);
      setNewDiscussionTitle('');
      setNewDiscussionContent('');
      setNewDiscussionTags('');
      setNewDiscussionCategory('General Discussion');
      setIsComposerOpen(false);
      setLoadingFailed(false);
    } catch (error) {
      setComposerError(error instanceof Error ? error.message : 'Failed to create discussion.');
    } finally {
      setIsCreatingDiscussion(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#010409] pt-24 pb-16">
      <div className="w-full px-4 md:px-6 lg:px-8 xl:px-12 2xl:px-16">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-3">
              {t('forum.title')}
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
              {t('forum.subtitle')}
            </p>
            <div className="mt-3 text-sm text-slate-500 dark:text-slate-400">
              <span>{loadingFailed ? 'Live community feed unavailable' : 'Live community feed'}</span>
              <span> - {view.resultCount} discussions</span>
            </div>
          </div>
          <button
            type="button"
            onClick={openComposer}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors whitespace-nowrap self-start md:self-auto"
          >
            <PenSquare className="w-5 h-5" />
            {t('forum.newDiscussion')}
          </button>
        </div>

        {isComposerOpen && (
          <form
            onSubmit={submitNewDiscussion}
            className="mb-8 rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#0d1117]"
          >
            <div className="grid gap-4 md:grid-cols-[1fr_220px]">
              <input
                type="text"
                value={newDiscussionTitle}
                onChange={(event) => setNewDiscussionTitle(event.target.value)}
                placeholder="Discussion title"
                className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:border-white/10 dark:bg-[#161b22] dark:text-white"
              />
              <select
                value={newDiscussionCategory}
                onChange={(event) => setNewDiscussionCategory(event.target.value as ForumCategory)}
                className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:border-white/10 dark:bg-[#161b22] dark:text-white"
              >
                {composerCategories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <textarea
              value={newDiscussionContent}
              onChange={(event) => setNewDiscussionContent(event.target.value)}
              placeholder="Start a discussion..."
              className="mt-4 h-28 w-full resize-none rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:border-white/10 dark:bg-[#161b22] dark:text-white"
            />
            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <input
                type="text"
                value={newDiscussionTags}
                onChange={(event) => setNewDiscussionTags(event.target.value)}
                placeholder="Tags, separated by commas"
                className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50 sm:max-w-md dark:border-white/10 dark:bg-[#161b22] dark:text-white"
              />
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsComposerOpen(false)}
                  className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/5"
                >
                  {t('common.actions.cancel')}
                </button>
                <button
                  type="submit"
                  disabled={isCreatingDiscussion}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isCreatingDiscussion ? t('common.actions.posting') : t('common.actions.postDiscussion')}
                </button>
              </div>
            </div>
            {composerError && (
              <div className="mt-3 text-sm text-red-600 dark:text-red-400">{composerError}</div>
            )}
          </form>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          <div className="hidden lg:block lg:col-span-3 xl:col-span-2 space-y-6">
            <div className="bg-white dark:bg-[#0d1117] rounded-xl p-5 border border-slate-200 dark:border-white/10 shadow-sm sticky top-28">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-blue-500" />
                {t('forum.categories.title')}
              </h3>
              <div className="space-y-1">
                {view.categoryOptions.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    type="button"
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                      activeCategory === category.id
                        ? 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 font-medium'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white'
                    }`}
                  >
                    <span>{category.label}</span>
                    <span className="bg-slate-100 dark:bg-[#161b22] px-2 py-0.5 rounded-full text-[10px] font-medium">
                      {category.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 xl:col-span-7 space-y-6">
            <div className="bg-white dark:bg-[#0d1117] rounded-xl p-4 border border-slate-200 dark:border-white/10 shadow-sm flex flex-col sm:flex-row gap-4 items-center">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder={t('forum.searchPlaceholder')}
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  aria-label={t('forum.searchPlaceholder')}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-[#161b22] border border-slate-200 dark:border-white/5 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-shadow"
                />
              </div>
              <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar w-full sm:w-auto pb-2 sm:pb-0">
                <div className="flex bg-slate-100 dark:bg-[#161b22] p-1 rounded-lg">
                  {view.sortTabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveSort(tab.id)}
                      type="button"
                      className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                        activeSort === tab.id
                          ? 'bg-white text-slate-900 shadow-sm dark:bg-[#0d1117] dark:text-white'
                          : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {view.filteredPosts.length === 0 && (
                <div className="bg-white dark:bg-[#0d1117] border border-dashed border-slate-300 dark:border-white/10 rounded-xl p-8 text-center">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                    {loadingFailed ? 'Unable to load discussions' : 'No discussions found'}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {loadingFailed ? 'Check the community service and try again.' : 'Try a different search or category filter.'}
                  </p>
                </div>
              )}
              {view.filteredPosts.map((post) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-[#0d1117] border border-slate-200 dark:border-white/10 hover:border-blue-300 dark:hover:border-blue-500/30 rounded-xl p-6 transition-colors group"
                >
                  <Link to={`/forum/${post.id}`} className="flex items-start gap-4">
                    <img src={readMediaResourceUrl(post.author.avatar)} alt={post.author.name} className="w-10 h-10 rounded-full" />
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="font-semibold text-slate-900 dark:text-white">{post.author.name}</span>
                        {post.author.role && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400">
                            {post.author.role}
                          </span>
                        )}
                        <span className="text-sm text-slate-500 dark:text-slate-400">{post.publishedAtLabel}</span>
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {post.isPinned && (
                          <span className="mr-2 text-orange-500 text-sm">{t('forum.pinned', 'Pinned')}</span>
                        )}
                        {post.title}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                        {post.contentSnippet}
                      </p>

                      <div className="flex items-center justify-between gap-4">
                        <div className="flex flex-wrap gap-2">
                          <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 dark:bg-[#161b22] dark:text-slate-300">
                            {post.category}
                          </span>
                          {post.tags.map((tag) => (
                            <span key={tag} className="px-2.5 py-1 rounded-full text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                              <span className="opacity-50">#</span>{tag}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400 text-sm font-medium">
                          <div className="flex items-center gap-1.5">
                            <ThumbsUp className="w-4 h-4" />
                            {post.likesLabel}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <MessageCircle className="w-4 h-4" />
                            {post.commentsLabel}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-3 xl:col-span-3 space-y-6 lg:sticky top-28 self-start">
            <div className="bg-gradient-to-b from-blue-50 to-white dark:from-blue-900/10 dark:to-[#0d1117] rounded-xl p-5 border border-blue-100 dark:border-blue-500/20 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl" />
              <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2 relative z-10">
                <Heart className="w-5 h-5 text-red-500" />
                {t('forum.community.title', 'Join our Community')}
              </h3>

              <div className="grid grid-cols-2 gap-3 relative z-10">
                {view.communityLinks.length === 0 && (
                  <div className="col-span-2 rounded-lg border border-dashed border-slate-200 bg-white/80 px-3 py-5 text-center text-sm text-slate-500 dark:border-white/10 dark:bg-[#161b22]/80 dark:text-slate-400">
                    Community links are not configured.
                  </div>
                )}
                {view.communityLinks.map((link) => (
                  <div
                    key={link.id}
                    className={`bg-white dark:bg-[#161b22] border border-slate-200 dark:border-white/10 rounded-lg p-3 flex flex-col items-center group hover:shadow-md transition-all ${communityToneClassById[link.tone]}`}
                  >
                    <div className="bg-white p-1.5 rounded-lg mb-2 shadow-sm border border-slate-100">
                      <img src={readMediaResourceUrl(link.qrCode)} alt={`${link.label} QR Code`} className="w-full aspect-square object-contain group-hover:scale-105 transition-transform" />
                    </div>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      {link.id === 'douyin' ? <Music className="w-3.5 h-3.5 text-[#FE2C55]" /> : null}
                      {link.id === 'video' ? <Video className="w-3.5 h-3.5 text-[#FA5151]" /> : null}
                      {link.id !== 'douyin' && link.id !== 'video' ? <MessageSquare className="w-3.5 h-3.5 text-blue-500" /> : null}
                      {link.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-[#0d1117] rounded-xl p-5 border border-slate-200 dark:border-white/10 shadow-sm">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-500" />
                {t('forum.stats.title')}
              </h3>
              <div className="space-y-4">
                <StatRow icon={<Users className="w-4 h-4" />} label={t('forum.stats.members')} value={view.stats.membersLabel} />
                <StatRow icon={<MessageSquare className="w-4 h-4" />} label={t('forum.stats.posts')} value={view.stats.totalPostsLabel} />
                <StatRow
                  icon={<Clock className="w-4 h-4" />}
                  label={t('forum.stats.online')}
                  value={view.stats.onlineMembersLabel}
                  valueClassName="text-green-600 dark:text-green-400"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatRow({
  icon,
  label,
  value,
  valueClassName = 'text-slate-900 dark:text-white',
}: {
  icon: ReactNode;
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 last:border-0 pb-4 last:pb-0">
      <span className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2">
        {icon} {label}
      </span>
      <span className={`font-medium ${valueClassName}`}>{value}</span>
    </div>
  );
}
