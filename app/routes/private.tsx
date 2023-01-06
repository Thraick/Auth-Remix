import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";

import { authenticator, supabaseStrategy } from "~/auth.server";
import { supabaseClient } from "~/supabase";

export const getUserData = async (userId:any) => {
  const { data, error } = await supabaseClient
    .from("profiles")
    .select()
    .eq("id", userId)
    .single();
  return { data, error };
};

export const action = async ({ request }: ActionArgs) => {
  await authenticator.logout(request, { redirectTo: "/" });
};

export const loader = async ({ request }: LoaderArgs) => {
  const session = await supabaseStrategy.checkSession(request, {
    failureRedirect: "/auth/login",
  });

  return await getUserData(session.user?.id)
};



export default function Screen() {
  const {data} = useLoaderData<typeof loader>();
  return (
    <>
      <h1>Hello {data.username}</h1>
      {/* {data && <pre>{JSON.stringify(data, null, 1)}</pre>} */}

      <Form method="post">
        <button>Log Out</button>
      </Form>
    </>
  );
}
