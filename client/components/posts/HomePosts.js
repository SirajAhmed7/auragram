import { getPosts } from "@/lib/services/postServices";
import Post from "./Post";

async function HomePosts() {
  const posts = await getPosts();

  return (
    <div className="w-full">
      <div className="w-full max-w-3xl mx-auto space-y-5">
        {posts.success &&
          posts.data.length > 0 &&
          posts.data.map((post) => <Post key={post._id} post={post} isHome />)}
      </div>
    </div>
  );
}

export default HomePosts;
