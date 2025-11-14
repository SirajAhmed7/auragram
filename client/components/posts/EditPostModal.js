"use client";

import { X } from "lucide-react";
import { useFormState, useFormStatus } from "react-dom";
import { updatePostAction } from "@/lib/actions";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="px-6 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
    >
      {pending ? (
        <>
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          Saving...
        </>
      ) : (
        "Save Changes"
      )}
    </button>
  );
}

function EditPostModal({ post, onClose }) {
  const router = useRouter();
  const textareaRef = useRef(null);
  const [state, formAction] = useFormState(
    updatePostAction.bind(null, post._id),
    {
      success: false,
      error: null,
    }
  );

  useEffect(() => {
    if (state.success) {
      onClose();
      router.refresh();
    }
  }, [state.success, onClose, router]);

  useEffect(() => {
    // Focus and set cursor to end of text
    if (textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(
        textareaRef.current.value.length,
        textareaRef.current.value.length
      );
    }
  }, []);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Edit Post</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form action={formAction} className="p-6">
          <div className="space-y-4">
            <div>
              <textarea
                ref={textareaRef}
                name="content"
                defaultValue={post.content}
                className="w-full min-h-[200px] p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
                placeholder="What's on your mind?"
                required
              />
            </div>

            {state.error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                {state.error}
              </div>
            )}

            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <SubmitButton />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditPostModal;
