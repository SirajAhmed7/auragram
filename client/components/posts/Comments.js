import CommentItem from "./CommentItem";

function Comments({ postId, comments, user }) {
  return (
    <div className="w-full">
      {comments && comments.length > 0 ? (
        <div className="divide-y divide-gray-100">
          {comments.map((comment) => (
            <CommentItem
              key={comment._id}
              postId={postId}
              comment={comment}
              user={user}
            />
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
