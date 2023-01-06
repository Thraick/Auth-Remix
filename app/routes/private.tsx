import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { authenticator, getUserData, supabaseStrategy } from "~/auth.server";


import { AppBar } from "@mui/material";
import { Outlet, useLoaderData } from "@remix-run/react";
import Container from "~/components/Container";
import TopBar from "~/components/TopBar";



export const action = async ({ request }: ActionArgs) => {
  await authenticator.logout(request, { redirectTo: "/" });
};

export const loader = async ({ request }: LoaderArgs) => {
  const session = await supabaseStrategy.checkSession(request, {
    failureRedirect: "/",
  });

  return await getUserData(session.user?.id)
};



export default function Screen() {
    const { data } = useLoaderData<typeof loader>();

  return (
    <>
      <AppBar
        position={'sticky'}
        sx={{
          top: 0,
          boxShadow: 1
        }}
        color='default'
      >
        <Container paddingY={1} >
          <TopBar data={data} />
        </Container>
      </AppBar>
      <Container>
        <Outlet />
      </Container>
    </>
  );
}
