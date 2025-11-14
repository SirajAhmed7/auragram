"use client";

import Image from "next/image";
import { useState } from "react";

// Individual Comment Component
function CommentItem({ comment, user, level = 0 }) {
  const [showReplies, setShowReplies] = useState(true);
  const [isReplying, setIsReplying] = useState(false);

  // Calculate left margin based on nesting level
  const marginLeft = level > 0 ? `${level * 48}px` : "0px";

  return (
    <div className="relative" style={{ marginLeft }}>
      {/* Vertical line for nested comments */}
      {level > 0 && (
        <div
          className="absolute top-0 bottom-0 w-[2px] bg-gray-200"
          style={{ left: "-24px" }}
        />
      )}

      <div className="flex gap-3 py-3">
        {/* User Avatar */}
        <div className="flex-shrink-0">
          <Image
            src={comment.user.avatar}
            alt={comment.user.username}
            width={40}
            height={40}
            className="rounded-full object-cover"
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
              {formatTimeAgo(comment.createdAt)}
            </span>
          </div>

          {/* Comment Text */}
          <p className="text-sm mb-2 text-gray-800">{comment.content}</p>

          {/* Actions */}
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <button className="flex items-center gap-1 hover:text-red-500 transition-colors">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              <span>{comment.likesCount}</span>
            </button>

            <button
              className="hover:text-blue-500 transition-colors"
              onClick={() => setIsReplying(!isReplying)}
            >
              Reply
            </button>

            {comment.repliesCount > 0 && (
              <button
                className="hover:text-blue-500 transition-colors"
                onClick={() => setShowReplies(!showReplies)}
              >
                {showReplies ? "Hide" : "Show"} {comment.repliesCount}{" "}
                {comment.repliesCount === 1 ? "reply" : "replies"}
              </button>
            )}
          </div>

          {/* Reply Input */}
          {isReplying && (
            <div className="mt-3 flex gap-2">
              <Image
                src={user?.avatar || "/images/default-avatar.jpg"}
                alt="Your avatar"
                width={32}
                height={32}
                className="rounded-full object-cover"
              />
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Write a reply..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
                <div className="flex gap-2 mt-2">
                  <button className="px-3 py-1 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition-colors">
                    Post
                  </button>
                  <button
                    className="px-3 py-1 text-gray-600 text-sm hover:text-gray-800 transition-colors"
                    onClick={() => setIsReplying(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Nested Replies */}
      {showReplies &&
        comment.replies &&
        comment.replies.length > 0 &&
        comment.replies.map((reply) => (
          <CommentItem
            key={reply._id}
            comment={reply}
            user={user}
            level={level + 1}
          />
        ))}
    </div>
  );
}

// Helper function to format time
function formatTimeAgo(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);

  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks}w ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  const years = Math.floor(days / 365);
  return `${years}y ago`;
}

function Comments({ comments, user }) {
  return (
    <div className="w-full">
      {comments && comments.length > 0 ? (
        <div className="divide-y divide-gray-100">
          {comments.map((comment) => (
            <CommentItem key={comment._id} comment={comment} user={user} />
          ))}
        </div>
      ) : (
        <div className="py-8 text-center text-gray-500">
          <p>No comments yet. Be the first to comment!</p>
        </div>
      )}
    </div>
  );
}

export default Comments;
