import { AppBar, Button, Stack } from "@mui/material";
import type { LoaderArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import Container from "~/components/Container"
import TopBar from "~/components/TopBar";
import { getUserData, supabaseStrategy } from "~/utils/supabase/auth.server";




export const loader = async ({ request }: LoaderArgs) => {
  const session = await supabaseStrategy.checkSession(request, {
    failureRedirect: "/auth/login",
  });

  return await getUserData(session.user?.id)
};

export default function Index() {
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
          <TopBar data={data}/>
        </Container>
      </AppBar>


      <Stack
        direction="row"
        justifyContent="center"
        alignItems="center"
        spacing={2}
        marginTop={5}
      >
        <Button variant="outlined" color="primary">primary</Button>
        <Button variant="outlined" color="secondary">secondary</Button>
        <Button variant="outlined" color="success">success</Button>
        <Button variant="outlined" color="error">error</Button>
        <Button variant="outlined" color="inherit">inherit</Button>
        <Button variant="outlined" color="info">info</Button>
        <Button variant="outlined" color="warning">warning</Button>
      </Stack>

    </>


  );
}
