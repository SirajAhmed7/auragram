"use client";

import { addCommentReplyAction } from "@/lib/actions";
import { getTimeAgo } from "@/lib/utils";
import { Heart } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState, useActionState } from "react";
import LikeButton from "../ui/LikeButton";

// Individual Comment Component
function CommentItem({ postId, comment, user, level = 0 }) {
  const [showReplies, setShowReplies] = useState(true);
  const [isReplying, setIsReplying] = useState(false);
  const [state, formAction] = useActionState(
    addCommentReplyAction.bind(null, {
      level,
      commentId: comment._id,
      postId,
    }),
    null
  );
  const router = useRouter();

  function closeReply() {
    setIsReplying(false);
    setShowReplies(true);
  }

  useEffect(() => {
    if (state?.success) {
      // Update user context with the returned user data
      // Redirect to home
      router.refresh();

      // eslint-disable-next-line react-hooks/set-state-in-effect
      closeReply();
    }
  }, [state, router]);

  return (
    <div className="relative">
      {/* Vertical line from this comment's avatar downward if it has replies */}
      {showReplies && comment.replies && comment.replies.length > 0 && (
        <div
          className="absolute w-0.5 bg-slate-300 left-4 sm:left-5"
          style={{
            top: "32px", // Start from avatar center (py-3 = 12px + 20px)
            bottom: "0",
          }}
        />
      )}

      <div className="flex gap-2 sm:gap-3 py-3">
        {/* User Avatar */}
        <div className="shrink-0">
          <Image
            src={comment.user.avatar || "/images/default-avatar.jpg"}
            alt={comment.user.username}
            width={32}
            height={32}
            className="rounded-full object-cover relative z-10 sm:w-10 sm:h-10"
          />
        </div>

        {/* Comment Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-sm">
              {comment.user.fullName}
            </span>
            <span className="text-gray-500 text-sm">
              {getTimeAgo(comment.createdAt)}
            </span>
          </div>

          {/* Comment Text */}
          <p className="text-sm mb-2 text-gray-800">{comment.content}</p>

          {/* Actions */}
          <div className="flex items-center gap-4 text-sm text-gray-500">
            {/* <button className="flex items-center gap-1 hover:text-red-500 transition-colors">
              <Heart size={16} />
              <span>{comment.likesCount}</span>
            </button> */}
            <LikeButton
              contentType="comments"
              contentId={comment._id}
              isLiked={comment.isLiked}
              likesCount={comment.likesCount}
              size="sm"
            />

            <button
              className="hover:text-cyan-500 transition-colors"
              onClick={() => setIsReplying(!isReplying)}
            >
              Reply
            </button>

            {comment.repliesCount > 0 && (
              <button
                className="hover:text-cyan-500 transition-colors"
                onClick={() => setShowReplies(!showReplies)}
              >
                {showReplies ? "Hide" : "Show"} {comment.repliesCount}{" "}
                {comment.repliesCount === 1 ? "reply" : "replies"}
              </button>
            )}
          </div>

          {/* Reply Input */}
          {isReplying && (
            <div className="mt-3 flex gap-2 items-start">
              <Image
                src={user?.avatar || "/images/default-avatar.jpg"}
                alt="Your avatar"
                width={36}
                height={36}
                className="rounded-full object-cover aspect-square shrink-0"
              />
              <div className="basis-full">
                <form action={formAction}>
                  <input
                    type="text"
                    name="content"
                    placeholder="Write a reply..."
                    className="w-full px-3 py-2 border-b border-gray-300 focus:outline-none focus:border-gray-500 text-sm"
                  />
                  <div className="flex gap-2 mt-2">
                    <button
                      type="submit"
                      className="px-3 py-1 bg-cyan-600 text-white rounded-full text-sm hover:bg-cyan-700 transition-colors"
                    >
                      Post
                    </button>
                    <button
                      type="button"
                      className="px-3 py-1 text-gray-600 text-sm hover:text-gray-800 transition-colors"
                      onClick={() => setIsReplying(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Nested Replies with threading lines */}
      {showReplies && comment.replies && comment.replies.length > 0 && (
        <div className="relative">
          {comment.replies.map((reply, index) => {
            const isLastReply = index === comment.replies.length - 1;

            return (
              <div key={reply._id} className="relative ml-10 sm:ml-12">
                {/* Horizontal line from vertical line to child avatar */}
                <div className="absolute h-0.5 bg-slate-300 -left-6 sm:-left-7 top-5 sm:top-6 w-6 sm:w-7" />

                {/* Cover the vertical line below the last child's horizontal line */}
                {isLastReply && (
                  <div className="absolute w-0.5 bg-white -left-6 sm:-left-7 top-5 sm:top-6 bottom-0" />
                )}

                <CommentItem
                  postId={postId}
                  comment={reply}
                  user={user}
                  level={level + 1}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default CommentItem;
