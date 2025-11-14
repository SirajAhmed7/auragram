import Post from "@/components/posts/Post";
import { getPost } from "@/lib/services/postServices";

async function Page({ params }) {
  const { id } = await params;

  const post = await getPost(id);

  return (
    <div className="w-full">
      <div className="w-full max-w-3xl mx-auto">
        <Post post={post.data} />
      </div>
    </div>
  );
}

export default Page;
