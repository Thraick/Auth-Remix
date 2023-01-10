import { Box, Button, Grid, IconButton, Stack, TextField, Typography } from "@mui/material"
import { Form, Link as NavLink, useLoaderData, useSubmit } from "@remix-run/react";

import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import DeleteIcon from '@mui/icons-material/Delete';

import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { HttpRequest } from "~/utils/jac/httpRequest";
import { useState } from "react";


import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';


export const action: ActionFunction = async ({ request }) => {
    let form = await request.formData()
    let values = Object.fromEntries(form)

    if ('updateIntent' in values) {
        let val = form.get('updateIntent')
        let report = await HttpRequest('update_intent', val)
        console.log(report)
        return null;
    }
    else if ('deleteIntent' in values) {
        let val = form.get('deleteIntent')
        let report = await HttpRequest('delete_intent', val)
        console.log(report)
        return redirect('/private/intents');
    }
    else {
        return null;
    }
};

export const loader: LoaderFunction = async ({ params }) => {
    let id = { id: params.IntentID }

    try {
        const response = await HttpRequest("get_intent", id)
        const payload = response.report[0]
        return json({ data: payload });
    } catch (error) {
        console.log(error)
        return json(error);
    }
};


export default function IntentID() {
    const { data } = useLoaderData<LoaderType>()
    // const actionData = useActionData();
    const submit = useSubmit();



    const [list, setlist] = useState(data[0].utterances)
    const [intent, setIntent] = useState(data[0].name_of_intent)
    const [openEditIntent, setOpenEditIntent] = useState(false)
    const [openEditUtterance, setOpenEditUtterance] = useState(false)
    const [openUtteranceDialog, setOpenUtteranceDialog] = useState(false)
    const [openIntentDialog, setOpenIntentDialog] = useState(false)
    const [openNewUtterance, setOpenNewUtterance] = useState(false)
    const [updateIntent, setUpdateIntent] = useState('')
    const [updateUtteranceIdChange, setUpdateUtteranceIdChange] = useState<number>()
    const [deleteUtteranceValue, setDeleteUtteranceValue] = useState('')
    const [updateUtteranceValueChange, setUpdateUtteranceValueChange] = useState('')
    const [newUtteranceChange, setNewUtteranceChange] = useState('')


    const handleIntentEdit = () => {
        setOpenEditIntent(openEditIntent => !openEditIntent)
    }

    const handleIntentSave = () => {

        let values = {
            name_of_intent: updateIntent,
            utterances: list,
            id: data[0].jid
        }
        setIntent(updateIntent)
        let formData = new FormData();
        formData.append('updateIntent', JSON.stringify(values))
        submit(formData, { action: `/private/intents/${data[0].jid}`, method: 'post' })

        setOpenEditIntent(false)
    }


    const handleUtteranceEdit = (id: number) => {
        console.log(id)
        setUpdateUtteranceIdChange(id)
        setOpenEditUtterance(openEditUtterance => !openEditUtterance)
    }

    const handleUtteranceSave = () => {
        const idx = updateUtteranceIdChange as number
        list.splice(idx, 1, updateUtteranceValueChange)
        let newList = [...list]

        let values = {
            name_of_intent: updateIntent,
            utterances: newList,
            id: data[0].jid
        }

        let formData = new FormData();
        formData.append('updateIntent', JSON.stringify(values))
        submit(formData, { action: `/private/intents/${data[0].jid}`, method: 'post' })
        setOpenEditUtterance(openEditUtterance => !openEditUtterance)
    }

    const handleNewUtterance = async () => {
        let values = {
            name_of_intent: data[0].name_of_intent,
            utterances: [newUtteranceChange, ...list],
            id: data[0].jid
        }
        setlist(values.utterances)

        let formData = new FormData();
        formData.append('updateIntent', JSON.stringify(values))
        submit(formData, { action: `/private/intents/${data[0].jid}`, method: 'post' })

        setOpenNewUtterance(openNewUtterance => !openNewUtterance)
    }



    const handleUtteranceDialogClose = () => {
        setOpenUtteranceDialog(false)
    }
    const handleNewUtteranceDialogClose = () => {
        setOpenNewUtterance(false)
    }

    const handleUtteranceDelete = (item: any) => {
        setDeleteUtteranceValue(item)
        setOpenUtteranceDialog(true)
    }

    const confirmHandleUtteranceDelete = () => {
        const newList = list.filter((item: any, idx: any) => item !== deleteUtteranceValue);

        let values = {
            name_of_intent: data[0].name_of_intent,
            utterances: newList,
            id: data[0].jid
        }
        setlist(newList)


        let formData = new FormData();
        formData.append('updateIntent', JSON.stringify(values))
        submit(formData, { action: `/private/intents/${data[0].jid}`, method: 'post' })

        setOpenUtteranceDialog(false)
    }


    const handleIntentDelete = () => {
        let values = {
            id: data[0].jid
        }

        let formData = new FormData();
        formData.append('deleteIntent', JSON.stringify(values))
        submit(formData, { action: `/private/intents/${data[0].jid}`, method: 'post' })
        setOpenIntentDialog(false)
    }

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
                    Update Intent
                </Typography>
            </Grid>

            <Grid item justifyContent='right' >
                <IconButton color="primary" component={NavLink} to="/private/intents">
                    <ArrowBackIosNewIcon />
                </IconButton>
            </Grid>

            <Grid item xs={12} marginTop={3}>
                <Form method='post'>
                    <Grid
                        container
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        spacing={2}
                    >
                        <Grid item xs={12}>
                            <Typography variant={'h6'} >
                                Intent
                            </Typography>
                        </Grid>

                        <Grid item xs={10}>
                            <Stack
                                direction="column"
                                justifyContent="center"
                                alignItems="flex-start"
                                spacing={2}
                            >
                                {openEditIntent ?
                                    <>
                                        <TextField
                                            label="Intent *"
                                            variant="outlined"
                                            name={'name_of_intent'}
                                            defaultValue={intent}
                                            fullWidth
                                            onChange={event => setUpdateIntent(event.target.value)}
                                        />
                                    </>
                                    :
                                    <>
                                        <Box marginLeft={2}>
                                            <p>{data[0].name_of_intent}</p>
                                        </Box>
                                    </>
                                }
                            </Stack>
                        </Grid>

                        <Grid item xs={2}>
                            <Stack
                                direction="row"
                                justifyContent="flex-end"
                                alignItems="center"
                                spacing={2}
                            >
                                {
                                    openEditIntent ?
                                        <>
                                            <Button variant="outlined" component="label" onClick={handleIntentEdit}>
                                                Cancel
                                            </Button>
                                            <Button variant="contained" color="primary" disabled={!updateIntent} onClick={handleIntentSave}>
                                                save
                                            </Button>
                                        </>
                                        :
                                        <>
                                            <Button variant="outlined" component="label" onClick={handleIntentEdit}>
                                                Edit
                                            </Button>
                                            <IconButton color="primary" aria-label="delete" component="label" onClick={() => setOpenIntentDialog(true)}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </>
                                }
                            </Stack>
                        </Grid>
                        <Grid item xs={12}>
                            <Stack
                                direction="row"
                                justifyContent="space-between"
                                alignItems="center"
                                spacing={2}
                            >

                                <Typography variant={'h6'} >
                                    Utterances
                                </Typography>

                                <Button variant={'contained'} onClick={() => setOpenNewUtterance(openNewUtterance => !openNewUtterance)}>
                                    New Utterance
                                </Button>

                            </Stack>
                        </Grid>

                        {/* <input
                            name='id'
                            value={data[0].jid}
                            type="hidden"
                        /> */}

                        <Grid item xs={12}>
                            {list && list.map((item: any, idx: any) => (
                                // <Grid container spacing={2} key={idx} mt={2} sx={{ px: { xs: 2, md: 3 } }}>
                                <Grid
                                    container
                                    direction="row"
                                    justifyContent="space-between"
                                    alignItems="center"
                                    spacing={2}
                                    key={idx}
                                >
                                    {
                                        openEditUtterance && updateUtteranceIdChange == idx
                                            ?
                                            <Grid item xs={10}>
                                                <TextField
                                                    label="Utterance *"
                                                    variant="outlined"
                                                    name={'utterance'}
                                                    fullWidth
                                                    defaultValue={item}
                                                    onChange={evt => setUpdateUtteranceValueChange(evt.target.value)}
                                                />
                                            </Grid>
                                            :
                                            <Grid item xs={10} sx={{ display: 'none' }}>
                                                <TextField
                                                    label="Utterance *"
                                                    variant="outlined"
                                                    name={'utterance'}
                                                    fullWidth
                                                    defaultValue={item}
                                                />
                                            </Grid>
                                    }
                                    {
                                        openEditUtterance && updateUtteranceIdChange == idx
                                            ?
                                            null
                                            :
                                            <Grid item xs={10}>
                                                <Box marginLeft={2}>
                                                    <p>{item}</p>
                                                </Box>
                                            </Grid>
                                    }

                                    <Grid item xs={2} >
                                        <Stack
                                            direction="row"
                                            justifyContent="flex-end"
                                            alignItems="center"
                                            spacing={2}
                                        >
                                            {
                                                openEditUtterance && updateUtteranceIdChange == idx ?
                                                    <>
                                                        <Button variant="outlined" component="label" onClick={() => handleUtteranceEdit(idx)}>
                                                            Cancel
                                                        </Button>
                                                        <Button variant="contained" color="primary" onClick={handleUtteranceSave} disabled={!updateUtteranceValueChange}>
                                                            save
                                                        </Button>
                                                    </>
                                                    :
                                                    <>
                                                        <Button variant="outlined" component="label" onClick={() => handleUtteranceEdit(idx)}>
                                                            Edit
                                                        </Button>
                                                        <IconButton color="primary" aria-label="delete" component="label" onClick={() => handleUtteranceDelete(item)}>
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </>
                                            }
                                        </Stack>
                                    </Grid>

                                </Grid>

                            ))}
                        </Grid>

                    </Grid>

                </Form>
            </Grid >

            <Dialog
                open={openUtteranceDialog}
                onClose={handleUtteranceDialogClose}
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
                        {deleteUtteranceValue}
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{mb: 2, mx: 2}}>
                    <Button variant="outlined" onClick={handleUtteranceDialogClose}>Cancel</Button>
                    <Button variant="contained" onClick={confirmHandleUtteranceDelete} autoFocus>
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>


            <Dialog
                open={openIntentDialog}
                onClose={handleUtteranceDialogClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                fullWidth
                maxWidth={'sm'}
            >
                <DialogTitle id="alert-dialog-title">
                    Would you like to delete this intent
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {data[0].name_of_intent}
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{mb: 2, mx: 2}}>
                    <Button variant="outlined" onClick={() => setOpenIntentDialog(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handleIntentDelete} autoFocus>
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={openNewUtterance}
                onClose={handleNewUtteranceDialogClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                fullWidth
                maxWidth={'sm'}
            >
                <DialogTitle id="alert-dialog-title">
                    Add new Utterance
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        <TextField
                            label="New Utterance *"
                            variant="outlined"
                            name={'utterance'}
                            fullWidth
                            multiline
                            rows={4}
                            onChange={event => setNewUtteranceChange(event.target.value)}
                        />
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{mb: 2, mx: 2}}>
                    <Button variant="outlined" onClick={() => setOpenNewUtterance(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handleNewUtterance} autoFocus>
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </Grid >

    )
}


type LoaderType = {
    data: IntentType[]
}