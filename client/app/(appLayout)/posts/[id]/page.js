import Post from "@/components/posts/Post";
import { getCurrentUser } from "@/lib/actions";
import { getPost } from "@/lib/services/postServices";

async function Page({ params }) {
  const { id } = await params;

  const post = await getPost(id);
  const currentUser = await getCurrentUser();

  return (
    <div className="w-full">
      <div className="w-full max-w-3xl mx-auto">
        <Post post={post.data} currentUser={currentUser} />
      </div>
    </div>
  );
}

export default Page;
