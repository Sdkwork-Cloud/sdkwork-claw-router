import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  Bookmark,
  ChevronLeft,
  MessageCircle,
  MessageSquare,
  Share2,
  ThumbsUp,
} from 'lucide-react';
import {
  buildPortalAuthLoginRedirect,
  hasStoredPortalSession,
  readMediaResourceUrl,
} from 'sdkwork-claw-router-commons/runtime';
import { useTranslation } from 'react-i18next';

import {
  deriveForumPostDetailView,
  type ForumComment,
  type ForumPost,
  type ForumPostDetailViewModel,
} from '../forumCatalog';
import { forumService } from '../forumService.ts';

function CommentThread({
  comment,
  depth = 0,
  onReply,
  onStartReply,
  onLike,
}: {
  comment: ForumComment;
  depth?: number;
  onReply: (commentId: string, content: string) => Promise<void>;
  onStartReply: () => boolean;
  onLike: (commentId: string) => Promise<void>;
}) {
  const { t } = useTranslation();
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const isNested = depth > 0;

  const submitReply = async () => {
    const content = replyText.trim();
    if (!content) {
      setActionError('Reply content is required.');
      return;
    }

    setIsSubmittingReply(true);
    setActionError(null);
    try {
      await onReply(comment.id, content);
      setReplyText('');
      setIsReplying(false);
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'Failed to post reply.');
    } finally {
      setIsSubmittingReply(false);
    }
  };

  const likeComment = async () => {
    setIsLiking(true);
    setActionError(null);
    try {
      await onLike(comment.id);
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'Failed to like comment.');
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <div className={`flex gap-4 ${isNested ? 'mt-4' : 'mt-6 pt-6 border-t border-slate-100 dark:border-white/10'}`}>
      <img
        src={readMediaResourceUrl(comment.author.avatar)}
        alt={comment.author.name}
        className={`${isNested ? 'w-8 h-8' : 'w-10 h-10'} rounded-full mt-1 shrink-0`}
      />
      <div className="flex-1 min-w-0">
        <div className="bg-slate-50 dark:bg-white/5 rounded-2xl p-4 border border-slate-100 dark:border-white/5">
          <div className="flex items-center justify-between gap-3 mb-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-semibold text-slate-900 dark:text-white text-sm">{comment.author.name}</span>
              {comment.author.role && (
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400">
                  {comment.author.role}
                </span>
              )}
              <span className="text-xs text-slate-500 dark:text-slate-400">{comment.publishedAt}</span>
            </div>
          </div>
          <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-line">
            {comment.content}
          </p>
        </div>

        <div className="flex items-center gap-4 mt-2 ml-2 text-xs font-medium text-slate-500 dark:text-slate-400">
          <button
            type="button"
            onClick={() => void likeComment()}
            disabled={isLiking}
            className="flex items-center gap-1.5 hover:text-blue-600 dark:hover:text-blue-400 transition-colors disabled:cursor-not-allowed disabled:opacity-60"
          >
            <ThumbsUp className="w-3.5 h-3.5" />
            {comment.likes}
          </button>
          <button
            type="button"
            onClick={() => {
              if (!isReplying && !onStartReply()) {
                return;
              }
              setIsReplying((value) => !value);
            }}
            className="flex items-center gap-1.5 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            {t('common.actions.reply')}
          </button>
        </div>
        {actionError && (
          <div className="mt-2 ml-2 text-xs font-medium text-red-600 dark:text-red-400">{actionError}</div>
        )}

        {isReplying && (
          <div className="mt-4 flex gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center shrink-0">
              <span className="text-blue-600 dark:text-blue-400 text-xs font-bold">You</span>
            </div>
            <div className="flex-1 space-y-2">
              <textarea
                value={replyText}
                onChange={(event) => setReplyText(event.target.value)}
                placeholder={`Replying to ${comment.author.name}...`}
                className="w-full bg-white dark:bg-[#0d1117] border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none h-20"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsReplying(false)}
                  className="px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg transition-colors"
                >
                  {t('common.actions.cancel')}
                </button>
                <button
                  type="button"
                  onClick={() => void submitReply()}
                  disabled={isSubmittingReply}
                  className="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmittingReply ? t('common.actions.posting') : t('common.actions.postReply')}
                </button>
              </div>
            </div>
          </div>
        )}

        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-2 border-l-2 border-slate-100 dark:border-white/10 pl-4 md:pl-6 ml-2 md:ml-4">
            {comment.replies.map((reply) => (
              <CommentThread
                key={reply.id}
                comment={reply}
                depth={depth + 1}
                onReply={onReply}
                onStartReply={onStartReply}
                onLike={onLike}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function ForumPostView() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const [detail, setDetail] = useState<ForumPostDetailViewModel | null>(null);
  const [detailLoadFailed, setDetailLoadFailed] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [isMutatingFeed, setIsMutatingFeed] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    if (!id) {
      setDetail(null);
      return () => {
        cancelled = true;
      };
    }
    const numericPostId = parsePositiveIntegerId(id);
    if (!numericPostId) {
      setDetail(null);
      setDetailLoadFailed(false);
      return () => {
        cancelled = true;
      };
    }

    loadLiveForumPostDetail(numericPostId)
      .then((nextDetail) => {
        if (cancelled) {
          return;
        }
        setDetail(nextDetail);
        setDetailLoadFailed(false);
      })
      .catch(() => {
        if (!cancelled) {
          setDetail(null);
          setDetailLoadFailed(true);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (!detail) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#010409] pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/forum" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors mb-6 font-medium">
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Forum</span>
          </Link>
          <div className="bg-white dark:bg-[#0d1117] rounded-2xl border border-slate-200 dark:border-white/10 p-8 text-center text-slate-600 dark:text-slate-300">
            {detailLoadFailed ? 'Unable to load discussion.' : 'Discussion not found.'}
          </div>
        </div>
      </div>
    );
  }

  const { post } = detail;
  const contentId = parsePositiveIntegerId(post.id);

  const updateCurrentPost = (updater: (currentPost: ForumPost) => ForumPost) => {
    setDetail((current) => {
      if (!current) {
        return current;
      }
      const nextDetail = deriveLiveForumPostDetail(updater(current.post));
      if (!nextDetail) {
        return current;
      }
      return {
        ...nextDetail,
        relatedPosts: current.relatedPosts,
      };
    });
  };

  const requirePortalLoginForAction = () => {
    if (hasStoredPortalSession()) {
      return true;
    }
    navigate(buildPortalAuthLoginRedirect(location));
    return false;
  };

  const mutateFeed = async (operation: (feedId: string) => Promise<ForumPost>) => {
    if (!requirePortalLoginForAction()) {
      return;
    }
    setIsMutatingFeed(true);
    setActionError(null);
    try {
      const updatedPost = await operation(post.id);
      updateCurrentPost((currentPost) => ({
        ...updatedPost,
        comments: currentPost.comments,
        commentCount: Math.max(updatedPost.commentCount, currentPost.commentCount),
      }));
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'Failed to update discussion.');
    } finally {
      setIsMutatingFeed(false);
    }
  };

  const submitComment = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!requirePortalLoginForAction()) {
      return;
    }
    const content = commentText.trim();
    if (!content) {
      setActionError('Comment content is required.');
      return;
    }
    if (!contentId) {
      setActionError('Discussion id must be a positive integer before commenting.');
      return;
    }

    setIsSubmittingComment(true);
    setActionError(null);
    try {
      const createdComment = await forumService.createForumComment({
        contentType: 'feeds',
        contentId,
        content,
      });
      updateCurrentPost((currentPost) => ({
        ...currentPost,
        commentCount: currentPost.commentCount + 1,
        comments: appendRootComment(currentPost.comments, createdComment),
      }));
      setCommentText('');
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'Failed to post comment.');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const replyToComment = async (commentId: string, content: string) => {
    if (!requirePortalLoginForAction()) {
      return;
    }
    const createdReply = await forumService.replyForumComment(commentId, {
      content,
    });
    updateCurrentPost((currentPost) => ({
      ...currentPost,
      commentCount: currentPost.commentCount + 1,
      comments: appendReplyToComment(currentPost.comments, commentId, createdReply),
    }));
  };

  const likeComment = async (commentId: string) => {
    if (!requirePortalLoginForAction()) {
      return;
    }
    const updatedComment = await forumService.likeForumComment(commentId);
    updateCurrentPost((currentPost) => ({
      ...currentPost,
      comments: replaceComment(currentPost.comments, updatedComment),
    }));
  };

  const toggleLikeFeed = async () => {
    await mutateFeed((feedId) => (
      detail.isLiked ? forumService.unlikeForumFeed(feedId) : forumService.likeForumFeed(feedId)
    ));
  };

  const toggleCollectFeed = async () => {
    await mutateFeed((feedId) => (
      detail.isCollected ? forumService.uncollectForumFeed(feedId) : forumService.collectForumFeed(feedId)
    ));
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#010409] pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/forum" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors mb-6 font-medium">
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Forum</span>
        </Link>

        <div className="bg-white dark:bg-[#0d1117] rounded-2xl border border-slate-200 dark:border-white/10 p-6 md:p-8 shadow-sm mb-8">
          <div className="flex flex-wrap items-center gap-3 mb-6 border-b border-slate-100 dark:border-white/10 pb-6">
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400">
              {post.category}
            </span>
            <span className="text-slate-400 dark:text-slate-500 text-sm">{detail.publishedAtLabel}</span>
            <span className="text-slate-400 dark:text-slate-500 text-sm">{detail.viewsLabel} views</span>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
            {post.title}
          </h1>

          <div className="flex items-center gap-3 mb-8">
            <img src={readMediaResourceUrl(post.author.avatar)} alt={post.author.name} className="w-12 h-12 rounded-full" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 dark:text-white">{post.author.name}</span>
                {post.author.role && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400">
                    {post.author.role}
                  </span>
                )}
              </div>
              <span className="text-sm text-slate-500 dark:text-slate-400">{detail.authorHandle}</span>
            </div>
          </div>

          <div className="prose dark:prose-invert max-w-none prose-slate dark:prose-slate mb-10 w-full text-slate-700 dark:text-slate-300 leading-loose whitespace-pre-line">
            {post.content}
          </div>

          <div className="flex flex-wrap gap-2 mb-8">
            {post.tags.map((tag) => (
              <span key={tag} className="px-3 py-1.5 rounded-lg text-sm text-slate-600 bg-slate-100 dark:text-slate-300 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                #{tag}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-white/10">
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => void toggleLikeFeed()}
                disabled={isMutatingFeed}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors font-medium text-sm disabled:cursor-not-allowed disabled:opacity-60 ${
                  detail.isLiked
                    ? 'bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-500/10 dark:text-blue-300 dark:hover:bg-blue-500/20'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10'
                }`}
              >
                <ThumbsUp className="w-4 h-4" />
                {detail.likesLabel}
              </button>
              <button
                type="button"
                onClick={() => void toggleCollectFeed()}
                disabled={isMutatingFeed}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors font-medium text-sm disabled:cursor-not-allowed disabled:opacity-60 ${
                  detail.isCollected
                    ? 'bg-amber-50 text-amber-700 hover:bg-amber-100 dark:bg-amber-500/10 dark:text-amber-300 dark:hover:bg-amber-500/20'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10'
                }`}
              >
                <Bookmark className="w-4 h-4" />
                {detail.isCollected ? t('common.actions.saved') : t('common.actions.save')}
              </button>
              <button
                type="button"
                onClick={() => void mutateFeed((feedId) => forumService.shareForumFeed(feedId))}
                disabled={isMutatingFeed}
                className="flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-slate-100 dark:bg-white/5 dark:hover:bg-white/10 rounded-full transition-colors text-slate-700 dark:text-slate-300 font-medium text-sm disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Share2 className="w-4 h-4" />
                {detail.shareCountLabel}
              </button>
            </div>
          </div>
          {actionError && (
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
              {actionError}
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-[#0d1117] rounded-2xl border border-slate-200 dark:border-white/10 p-6 md:p-8 shadow-sm mb-8">
          <div className="flex items-center gap-2 mb-8">
            <MessageSquare className="w-5 h-5 text-blue-500" />
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Discussion ({detail.totalCommentCount})
            </h3>
          </div>

          <form onSubmit={submitComment} className="flex gap-4 mb-10">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center shrink-0 text-white font-bold text-sm">
              YOU
            </div>
            <div className="flex-1 space-y-3">
              <textarea
                value={commentText}
                onChange={(event) => setCommentText(event.target.value)}
                placeholder="What are your thoughts?"
                className="w-full bg-slate-50 dark:bg-[#161b22] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none h-24"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmittingComment}
                  className="px-6 py-2.5 font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-sm shadow-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmittingComment ? t('common.actions.posting') : t('common.actions.postComment')}
                </button>
              </div>
            </div>
          </form>

          <div className="space-y-2">
            {post.comments.map((comment) => (
              <CommentThread
                key={comment.id}
                comment={comment}
                onReply={replyToComment}
                onStartReply={requirePortalLoginForAction}
                onLike={likeComment}
              />
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-[#0d1117] rounded-2xl border border-slate-200 dark:border-white/10 p-6 md:p-8 shadow-sm">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-5 flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-blue-500" />
            Related discussions
          </h3>
          <div className="grid gap-3">
            {detail.relatedPosts.map((related) => (
              <Link
                key={related.id}
                to={`/forum/${related.id}`}
                className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 dark:border-white/10 px-4 py-3 hover:border-blue-300 dark:hover:border-blue-500/30 transition-colors"
              >
                <div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">{related.category}</div>
                  <div className="font-semibold text-slate-900 dark:text-white">{related.title}</div>
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400 whitespace-nowrap">
                  {related.commentsLabel} replies
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

async function loadLiveForumPostDetail(postId: number): Promise<ForumPostDetailViewModel | null> {
  const postIdText = String(postId);
  const [post, comments, relatedPosts] = await Promise.all([
    forumService.fetchForumFeedDetail(postIdText),
    forumService.fetchForumComments({ contentType: 'feeds', contentId: postId }),
    forumService.fetchForumFeeds({ size: 50 }),
  ]);
  if (!post) {
    return null;
  }
  return deriveLiveForumPostDetail({
    ...post,
    comments,
  }, relatedPosts);
}

function deriveLiveForumPostDetail(post: ForumPost, relatedPosts: ForumPost[] = []): ForumPostDetailViewModel | null {
  const livePosts = [
    post,
    ...relatedPosts.filter((candidate) => candidate.id !== post.id),
  ];
  return deriveForumPostDetailView(livePosts, post.id);
}

function appendRootComment(comments: ForumComment[], comment: ForumComment): ForumComment[] {
  return [...comments, { ...comment, replies: comment.replies ?? [] }];
}

function appendReplyToComment(
  comments: ForumComment[],
  parentId: string,
  reply: ForumComment,
): ForumComment[] {
  return comments.map((comment) => {
    if (comment.id === parentId) {
      return {
        ...comment,
        replies: [...(comment.replies ?? []), { ...reply, replies: reply.replies ?? [] }],
      };
    }
    return {
      ...comment,
      replies: appendReplyToComment(comment.replies ?? [], parentId, reply),
    };
  });
}

function replaceComment(comments: ForumComment[], updatedComment: ForumComment): ForumComment[] {
  return comments.map((comment) => {
    if (comment.id === updatedComment.id) {
      return {
        ...updatedComment,
        replies: updatedComment.replies ?? comment.replies ?? [],
      };
    }
    return {
      ...comment,
      replies: replaceComment(comment.replies ?? [], updatedComment),
    };
  });
}

function parsePositiveIntegerId(value: string): number | null {
  const parsed = Number(value);
  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : null;
}
