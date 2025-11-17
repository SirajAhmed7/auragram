"use client";

import { useOptimistic, useTransition } from "react";
import { Heart } from "lucide-react";
import { toggleLikeAction } from "@/lib/actions";
import { cn } from "@/lib/utils";

function LikeButton({
  contentType,
  contentId,
  likesCount,
  isLiked = false,
  size = "md",
}) {
  const [optimisticLikeState, setOptimisticLikeState] = useOptimistic(
    { liked: isLiked, count: likesCount },
    (state, optimisticValue) => optimisticValue
  );
  const [isPending, startTransition] = useTransition();

  const handleToggleLike = async () => {
    const newLiked = !optimisticLikeState.liked;
    const newCount = optimisticLikeState.liked
      ? optimisticLikeState.count - 1
      : optimisticLikeState.count + 1;

    startTransition(async () => {
      setOptimisticLikeState({ liked: newLiked, count: newCount });

      try {
        const result = await toggleLikeAction(contentType, contentId);

        if (!result.success) {
          console.error("Failed to toggle like:", result.error);
        }
        // Note: No need to update state here since revalidatePath will refresh the data
      } catch (error) {
        console.error("Error toggling like:", error);
      }
    });
  };

  return (
    <div className="flex items-center gap-2 relative z-10">
      <button
        onClick={handleToggleLike}
        disabled={isPending}
        className="cursor-pointer hover:scale-110 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {optimisticLikeState.liked ? (
          <Heart
            size={size === "sm" ? 18 : 30}
            strokeWidth={optimisticLikeState.liked ? 0 : 2}
            fill="#fb2c36"
          />
        ) : (
          <Heart
            size={size === "sm" ? 16 : 28}
            strokeWidth={optimisticLikeState.liked ? 0 : 2}
          />
        )}
      </button>
      <span className={cn("text-base", size === "sm" && "text-sm")}>
        {optimisticLikeState.count}
      </span>
    </div>
  );
}

export default LikeButton;
