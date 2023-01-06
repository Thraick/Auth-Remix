import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { authenticator, supabaseStrategy, sessionStorage } from "~/auth.server";
import { supabaseClient } from "~/supabase";

export const createUser = async (data: any) => {
  const { user, error } =
    await supabaseClient.auth.signUp({
      email: data?.email,
      password: data?.password,
    });
  const createProfile = await supabaseClient
    .from("profiles")
    .upsert({
      id: user?.id,
      username: data?.username,
    });
  return { user: createProfile, error };
};

export const action = async ({ request }: ActionArgs) => {
  const form = await request.formData();
  const email = form?.get('email') as string;
  const password = form?.get('password') as string;
  const username = form?.get('username') as string;

  let data = {
    email,
    password,
    username
  }

  const { error } = await createUser(data)
  if (error) { console.log(error?.message) }
  // else(
  //   await authenticator.authenticate("sb", request, {
  //     successRedirect: "/private",
  //     failureRedirect: "/login",
  //   })
  // )
  // console.log(user)
  // sessionStorage.commitSession(user)

  return redirect('/private');
}

type LoaderError = { message: string } | null;
export const loader = async ({ request }: LoaderArgs) => {
  await supabaseStrategy.checkSession(request, {
    successRedirect: "/private",
  });

  const session = await sessionStorage.getSession(
    request.headers.get("Cookie")
  );
  const error = session.get(authenticator.sessionErrorKey) as LoaderError;

  return json({ error });
};

export default function Register() {
  return (
    <Form method="post">
      <input type="text" name="password" placeholder="password" />
      <input type="email" name="email" placeholder="email" />
      <input type="text" name="username" placeholder="username" />
      <button type="submit">Register</button>
    </Form>
  )
}