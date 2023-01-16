import { AppBar, Button, Stack, Typography } from "@mui/material";
import type { LoaderArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import FixedContainer from "~/components/Container";
import TopBar from "~/components/TopBar";
import { HttpRequest } from "~/utils/jac/httpRequest";
import { getUserData, supabaseStrategy } from "~/utils/supabase/auth.server";




export const loader = async ({ request }: LoaderArgs) => {
  const session = await supabaseStrategy.checkSession(request, {
    failureRedirect: "/auth/login",
  });

  return await getUserData(session.user?.id)
};

export default function Index() {
  const { data } = useLoaderData<typeof loader>();
  // const submit = useSubmit();

  const handleLoadIntent = async () =>{
    const report = await HttpRequest("load_intent", {})
    console.log(report)
  }
  const handleLoadState = async () =>{
    const report = await HttpRequest("load_state", {})
    console.log(report)

  }
  const handleLoadTfm = async () =>{
    const report = await HttpRequest("load_tfm", {})
    console.log(report)

  }
  const handleLoadFaq = async () =>{
    const report = await HttpRequest("load_faq", {})
    console.log(report)

  }

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
        <FixedContainer>
          <TopBar data={data} />
        </FixedContainer>
      </AppBar>

      <FixedContainer sx={{ marginY: 4 }}>

        <Stack
          direction="row"
          justifyContent="center"
          alignItems="center"
          spacing={2}
          marginTop={5}
          marginBottom={10}
        >
          <Button variant="outlined" color="primary" onClick={()=>handleLoadIntent()}>Load Intent</Button>
          <Button variant="outlined" color="primary" onClick={()=>handleLoadState()}>Load State</Button>
          <Button variant="outlined" color="primary" onClick={()=>handleLoadTfm()}>Load TFM</Button>
          <Button variant="outlined" color="primary" onClick={()=>handleLoadFaq()}>Load FAQ</Button>
        </Stack>
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
        <Stack
          direction="column"
          justifyContent="center"
          alignItems="center"
          spacing={2}
          marginTop={5}
        >
          <Typography variant="h1" gutterBottom>
            h1. Heading
          </Typography>
          <Typography variant="h2" gutterBottom>
            h2. Heading
          </Typography>
          <Typography variant="h3" gutterBottom>
            h3. Heading
          </Typography>
          <Typography variant="h4" gutterBottom>
            h4. Heading
          </Typography>
          <Typography variant="h5" gutterBottom>
            h5. Heading
          </Typography>
          <Typography variant="h6" gutterBottom>
            h6. Heading
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            subtitle1. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos
            blanditiis tenetur
          </Typography>
          <Typography variant="subtitle2" gutterBottom>
            subtitle2. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos
            blanditiis tenetur
          </Typography>
          <Typography variant="body1" gutterBottom>
            body1. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos
            blanditiis tenetur unde suscipit, quam beatae rerum inventore consectetur,
            neque doloribus, cupiditate numquam dignissimos laborum fugiat deleniti? Eum
            quasi quidem quibusdam.
          </Typography>
          <Typography variant="body2" gutterBottom>
            body2. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos
            blanditiis tenetur unde suscipit, quam beatae rerum inventore consectetur,
            neque doloribus, cupiditate numquam dignissimos laborum fugiat deleniti? Eum
            quasi quidem quibusdam.
          </Typography>
          <Typography variant="button" display="block" gutterBottom>
            button text
          </Typography>
          <Typography variant="caption" display="block" gutterBottom>
            caption text
          </Typography>
          <Typography variant="overline" display="block" gutterBottom>
            overline text
          </Typography>
        </Stack>
      </FixedContainer>


    </>


  );
}
