"use client";

import { Edit, MoreVertical } from "lucide-react";
import { useState } from "react";
import DeletePostButton from "./DeletePostButton";
import EditPostModal from "./EditPostModal";

function PostOptions({ post }) {
  const [isOpen, setIsOpen] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  return (
    <>
      <div className="relative z-30">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <MoreVertical size={20} />
        </button>

        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            />
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-20">
              <button
                onClick={() => {
                  setShowEditModal(true);
                  setIsOpen(false);
                }}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 transition-colors"
              >
                <Edit size={18} />
                <span>Edit post</span>
              </button>
              <DeletePostButton
                postId={post._id}
                onClose={() => setIsOpen(false)}
              />
            </div>
          </>
        )}
      </div>

      {showEditModal && (
        <EditPostModal post={post} onClose={() => setShowEditModal(false)} />
      )}
    </>
  );
}

export default PostOptions;
