import Image from "next/image";
import { getTimeAgo } from "@/lib/utils";
import { Heart } from "lucide-react";
import { MessageCircle } from "lucide-react";
import Link from "next/link";
import { Bookmark } from "lucide-react";
import { Send } from "lucide-react";
import AddComment from "./AddComment";
import Comments from "./Comments";

function Post({ isHome, post }) {
  return (
    <div className="w-full bg-white border border-slate-200 p-4 space-y-4 rounded-2xl relative">
      <div className="flex justify-between items-center">
        <Link href={"/users/" + post.user.username} className="block">
          <div className="flex items-center gap-4 relative z-10">
            <Image
              src={post.user.avatar}
              alt={post.user.fullName}
              width={36}
              height={36}
              className="rounded-full"
            />
            <h2 className="text-xl font-semibold">{post.user.fullName}</h2>
          </div>
        </Link>

        <p className="text-sm text-gray-500">{getTimeAgo(post.createdAt)}</p>
      </div>
      <Link
        href={"/posts/" + post._id}
        className="block after:absolute after:inset-0 after:z-0"
      >
        <p>{post.content.slice(0, 100)}</p>
      </Link>

      <div className="flex items-center justify-between">
        <div className="flex gap-4 items-center">
          <div className="flex items-center gap-2 relative z-10">
            <button className="cursor-pointer hover:scale-125 transition-all duration-300">
              <Heart size={28} />
            </button>
            {post.likesCount}
          </div>

          <div className="flex items-center gap-2 z-10">
            <Link
              href={"/posts/" + post._id}
              className="cursor-pointer hover:scale-125 transition-all duration-300"
            >
              <MessageCircle size={28} />
            </Link>
            {post.commentsCount}
          </div>

          <button className="cursor-pointer hover:scale-125 transition-all duration-300 relative z-10">
            <Send size={28} />
          </button>
        </div>

        <button className="cursor-pointer hover:scale-125 transition-all duration-300 relative z-10">
          <Bookmark size={28} />
        </button>
      </div>

      <AddComment
        postId={post._id}
        avatar={post.user.avatar}
        fullName={post.user.fullName}
      />

      {!isHome && <Comments comments={post.comments} user={post.user} />}
    </div>
  );
}

export default Post;
