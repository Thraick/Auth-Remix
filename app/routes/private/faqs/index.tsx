import { Button, Grid, IconButton, List, Stack, Typography } from "@mui/material"
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link as NavLink, useLoaderData, useSubmit } from "@remix-run/react";
import { HttpRequest } from "~/utils/jac/httpRequest";

import DeleteIcon from '@mui/icons-material/Delete';
import { useState } from "react";

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export const loader: LoaderFunction = async () => {
  try {
    const response = await HttpRequest("list_faq", {})
    return json({ data: response.payload });
  } catch (error) {
    console.log(error)
    return json(error);
  }
};


export default function Index() {
  const { data } = useLoaderData<LoaderType>();
  const submit = useSubmit();

  const [open, setOpen] = useState(false);
  const [deleteID, setDeleteID] = useState();
  const [deleteValue, setDeleteValue] = useState();

  const handleClickOpen = (props: any) => {
    setDeleteID(props.jid)
    setDeleteValue(props.question)
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = async () => {
    let id = { jid: deleteID }

    await HttpRequest("delete_faq", id)
    submit(null, { action: "/private/faqs", method: 'get' })

    setOpen(false);
  };

  return (
    <Grid
      container
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      spacing={1}
    >
      <Grid item >
        <Typography variant="h4" >
          Faqs
        </Typography>
      </Grid>

      <Grid item justifyContent='right' >
        <Button variant="contained" color="primary" component={NavLink} to="/private/faqs/new">New Faq</Button>
      </Grid>
      <Grid item xs={12} marginTop={3}>


        <List
          sx={{
            width: '100%',
            bgcolor: 'Background.default',
            padding: 1,
            // borderRadius: 2,
            // boxShadow: 2,
          }}

        >
          {[...data].reverse().map((item: any) => (
            <Grid
              container
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              spacing={1}
              key={item.jid}
            >
              <Grid item xs={10} sx={{ marginY: 1 }}>
                <Typography variant="subtitle1">
                  {item.question}
                </Typography>
                <Typography variant="body2">
                  {item.answer}
                </Typography>
              </Grid>

              <Grid item xs={2} >
                <Stack
                  direction="row"
                  justifyContent="flex-end"
                  alignItems="center"
                  spacing={1}
                >
                  <Button variant="text" color="primary" component={NavLink} to={item.jid}>Edit</Button>
                  <IconButton color="primary" aria-label="delete" component="label" onClick={() => handleClickOpen(item)}>
                    <DeleteIcon />
                  </IconButton>
                </Stack>
              </Grid>

            </Grid>

          ))}
        </List>
      </Grid>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
        maxWidth={'sm'}
      >
        <DialogTitle id="alert-dialog-title">
          Would you like to delete?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {deleteValue}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <DialogActions sx={{ mb: 2, mx: 2 }}>
            <Button variant="outlined" onClick={handleClose}>Cancel</Button>
            <Button variant="contained" onClick={handleDelete} autoFocus>
              Confirm
            </Button>
          </DialogActions>
        </DialogActions>
      </Dialog>


      {/* {data && <pre>{JSON.stringify(data, null, 1)}</pre>} */}
    </Grid>

  );
}


type LoaderType = { data: FaqType[] };
