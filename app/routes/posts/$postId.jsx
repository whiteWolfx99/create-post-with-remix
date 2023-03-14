import { useLoaderData } from "@remix-run/react";
import { db } from "~/utils/db.server";
import { Link, Outlet, redirect } from "react-router-dom";

// loader to fetch data
export const loader = async ({ params }) => {
  const post = await db.post.findUnique({
    where: {
      id: params.postId,
    },
  });

  if (!post) throw new Error("post not found");

  const data = { post };
  return data;
};

// action to delete the post
export const action = async ({ request, params }) => {
  const form = await request.formData();
  if (form.get("_method") === "delete") {
    const post = await db.post.findUnique({
      where: {
        id: params.postId,
      },
    });

    if (!post) throw new Error("post not found");

    await db.post.delete({ where: { id: params.postId } });

    return redirect("/posts");
  }
};

function Post() {
  const data = useLoaderData();
  return (
    <>
      <div className="header">
        <h1>{data.post.title}</h1>
        <Link to="/posts">
          <button className="btn btn-primary">Back to Posts</button>
        </Link>
      </div>
      <div className="content">
        <p>{data.post.body}</p>
      </div>
      <div className="delete-form">
        <form method="POST">
          <input type="hidden" name="_method" value="delete" />
          <button className="btn btn-danger">Delete Post</button>
        </form>
      </div>
      <div>
        <Link to={`/posts/${data.post.id}/update`}>
          <button className="btn btn-primary">Update Post</button>
        </Link>
      </div>
      <Outlet />
    </>
  );
}

export default Post;
