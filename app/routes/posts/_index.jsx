import { useLoaderData } from "@remix-run/react";
import { Link } from "react-router-dom";
import { db } from "~/utils/db.server";
import { getUser } from "~/utils/session.server";
import { json } from "@remix-run/node";

export const loader = async ({ request }) => {
  const data = await db.post.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      posterId: true,
      title: true,
      body: true,
      createdAt: true,
      updatedAt: true,
      poster: true,
    },
  });
  const user = await getUser(request);

  return json({
    data,
    user,
  });
};

function Index() {
  const data = useLoaderData();

  return (
    <div className="list-class">
      <div className="header">
        <h1>Posts</h1>
        {data.user ? (
            <div className="user-info">
              <span>{`Hi ${data.user.username}`}</span>
              <form action="/logout" method="post">
                <button type="submit" className="button">
                  Logout
                </button>
              </form>
            </div>
          ) : (
            <Link to="/login">Login</Link>
          )}
        <Link to="/posts/new">
          <button className="btn btn-primary">New Post</button>
        </Link>
      </div>
      <ul>
        {data.data.map((post) => (
          <li key={post.id}>
            <Link to={`/posts/${post.id}`}>{post.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Index;
