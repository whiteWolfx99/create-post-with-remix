import { redirect } from "@remix-run/node";
import { db } from "~/utils/db.server";
import { useLoaderData, useActionData, Form } from "@remix-run/react";
import { badRequest } from "~/utils/request.server";

const validateField = (value, fieldName, minChars) => {
  if (value.length < minChars) {
    return `${fieldName} is too short (minimum ${minChars} characters).`;
  }
  return "";
};

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

export const action = async ({ request, params }) => {
  const form = await request.formData();
  if (form.get("_method") === "put") {
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

    const post = await db.post.update({
      where: {
        id: params.postId,
      },
      data: {
        ...fields,
      },
    });

    if (!post) throw new Error("post not found");

    return redirect(`/posts/${params.postId}`);
  }
};

const Update = () => {
  const data = useLoaderData();
  const actionData = useActionData();

  return (
    <div className="form-container">
      <Form method="POST">
        <input type="hidden" name="_method" value="put" />
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            className="form-control"
            id="title"
            name="title"
            defaultValue={data.post.title}
            required
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
            className="form-control"
            id="body"
            name="body"
            rows="5"
            defaultValue={data.post.body}
            required
          ></textarea>
          {actionData?.fieldErrors?.body && (
            <p className="form-validation-error">
              {actionData.fieldErrors.body}
            </p>
          )}
        </div>
        <button className="btn btn-primary">Update Post</button>
      </Form>
    </div>
  );
};

export default Update;
