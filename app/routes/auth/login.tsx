import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";

import { authenticator, sessionStorage, supabaseStrategy } from "~/utils/supabase/auth.server";

export const action = async ({ request }: ActionArgs) => {
  await authenticator.authenticate("sb", request, {
    successRedirect: "/",
    failureRedirect: "/auth/login",
  });

};

type LoaderError = { message: string } | null;
export const loader = async ({ request }: LoaderArgs) => {
  await supabaseStrategy.checkSession(request, {
    successRedirect: "/",
  });

  const session = await sessionStorage.getSession(
    request.headers.get("Cookie")
  );

  const error = session.get(authenticator.sessionErrorKey) as LoaderError;
  console.log("error\n")
  console.log(error)

  return json({ error });
};

export default function Screen() {
  const { error } = useLoaderData<typeof loader>();

  return (
    <Form method="post">
      {error && <div>{error.message}</div>}
      <div>
        <label htmlFor="email">Email</label>
        <input type="text" name="email" id="email" />
      </div>

      <div>
        <label htmlFor="password">Password</label>
        <input type="text" name="password" id="password" />
      </div>

      <button>Log In</button>
    </Form>
  );
}
