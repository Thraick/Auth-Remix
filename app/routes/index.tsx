import { AppBar, Button, Stack } from "@mui/material";
import Container from "~/components/Container"
import TopBar from "~/components/TopBar";


export default function Index() {

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
          <TopBar data={null}/>
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
