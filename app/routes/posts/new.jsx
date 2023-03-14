import { Form, useActionData } from "@remix-run/react";
import { Link, redirect } from "react-router-dom";
import { db } from "~/utils/db.server";
import { badRequest } from "~/utils/request.server";
import { requireUserId } from "~/utils/session.server";

const validateField = (value, fieldName, minChars) => {
  if (value.length < minChars) {
    return `${fieldName} is too short (minimum ${minChars} characters).`;
  }
  return "";
};

export const action = async ({ request }) => {
  const userId = await requireUserId(request);
  const form = await request.formData();
  const title = form.get("title");
  const body = form.get("body");

  const fieldErrors = {
    title: validateField(title, "Title", 3),
    body: validateField(body, "Body", 10),
  };

  const fields = {
    title,
    body,
  };

  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({
      fieldErrors,
      fields,
    });
  }

  const post = await db.post.create({ data: { ...fields, posterId: userId } });

  return redirect(`/posts/${post.id}`);
};

function New() {
  const actionData = useActionData();
  return (
    <>
      <div className="header">
        <h1>New Post</h1>
        <Link to="/posts">
          <button className="btn btn-primary">Back to Posts</button>
        </Link>
      </div>
      <div className="form-container">
        <Form method="POST">
          <div className="form-group">
            <label htmlFor="title">Title</label>

            <input
              type="text"
              name="title"
              defaultValue={actionData?.fields?.title}
              id="title"
            />
            {actionData?.fieldErrors?.title && (
              <p className="form-validation-error">
                {actionData.fieldErrors.title}
              </p>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="body">Body</label>
            <textarea
              name="body"
              id="body"
              defaultValue={actionData?.fields?.body}
              rows="3"
              maxLength={500}
            ></textarea>

            {actionData?.fieldErrors?.body && (
              <p className="form-validation-error">
                {actionData.fieldErrors.body}
              </p>
            )}
          </div>
          <button type="submit">Submit</button>
        </Form>
      </div>
    </>
  );
}

export default New;
