"use client";

import { Trash2 } from "lucide-react";
import { useState } from "react";
import { deletePostAction } from "@/lib/actions";

function DeletePostButton({ postId, onClose }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      setError(null);
      await deletePostAction(postId);
      onclose();
      // If successful, deletePostAction will redirect to home
    } catch (err) {
      setError(err.message || "Failed to delete post");
      setIsDeleting(false);
    }
  };

  return (
    <>
      <button
        onClick={() => {
          setShowConfirm(true);
          // onClose();
        }}
        className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 transition-colors text-red-600"
      >
        <Trash2 size={18} />
        <span>Delete post</span>
      </button>

      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 space-y-4">
            <h3 className="text-xl font-semibold">Delete Post?</h3>
            <p className="text-gray-600">
              Are you sure you want to delete this post? This action cannot be
              undone.
            </p>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                {error}
              </div>
            )}

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowConfirm(false)}
                disabled={isDeleting}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default DeletePostButton;
