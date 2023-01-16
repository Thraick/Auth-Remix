import { Box, Button, Grid, IconButton, Stack, TextField, Typography } from "@mui/material";
import type { ActionFunction, LoaderFunction} from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import { HttpRequest } from "~/utils/jac/httpRequest";
import { Form, Link as NavLink, useLoaderData, useSubmit } from "@remix-run/react";

import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import DeleteIcon from '@mui/icons-material/Delete';
import { useState } from "react";



import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';


export const loader: LoaderFunction = async ({ params }) => {
    let id = { jid: params.IntentID }

    try {
        const intent = await HttpRequest("get_intent", id)
        let utterances = await HttpRequest("get_intent_utterance", id)
        // const intent = intents.filter((item: any) => item.jid === id.jid)
        // console.log("Loader")
        // console.log(utterances)
        // if ( utterances.constructor !== Array ){
        //     utterances = []
        // }
        const intent_list = [...intent.payload]
        const utterance_list = [...utterances.payload]

        const error_list = [intent.error, utterances.error]
        console.log(error_list)
        return json({ loader_intent: intent_list, loader_utterances: utterance_list });
    } catch (error) {
        console.log(error)
        return json(error);
    }
};

export const action: ActionFunction = async ({ request, params }) => {
    let form = await request.formData()
    let values = Object.fromEntries(form)

    if ('update_intent' in values) {
        await httpPost("update_intent", form)
        return redirect(`/private/intents/${params.IntentID}`);
    }
    else if ('update_state_utterance' in values) {
        await httpPost("update_state_utterance", form)
        return redirect(`/private/intents/${params.IntentID}`);
    }
    else if ('create_state_utterance' in values) {
        await httpPost("create_state_utterance", form)
        return redirect(`/private/intents/${params.IntentID}`);
    }
    else if ('delete_intent' in values) {
        await httpPost("delete_intent", form)
        return redirect('/private/intents');
    }
    else if ('delete_intent_utterance' in values) {
        await httpPost("delete_intent_utterance", form)
        return redirect(`/private/intents/${params.IntentID}`);
    }
    else {
        return null;
    }
};

export default function IntentID() {
    const { loader_intent, loader_utterances } = useLoaderData<LoaderType>()
    const submit = useSubmit();
    const [list, setlist] = useState(loader_utterances)
    
    const [intent, setIntent] = useState(loader_intent[0].intent)
    const [openEditIntent, setOpenEditIntent] = useState(false)
    const [openEditUtterance, setOpenEditUtterance] = useState(false)
    const [openUtteranceDialog, setOpenUtteranceDialog] = useState(false)
    const [openIntentDialog, setOpenIntentDialog] = useState(false)
    const [openNewUtterance, setOpenNewUtterance] = useState(false)
    const [updateIntent, setUpdateIntent] = useState('')
    const [updateUtteranceIdChange, setUpdateUtteranceIdChange] = useState()
    const [deleteUtteranceValue, setDeleteUtteranceValue] = useState('')
    const [deleteUtteranceId, setDeleteUtteranceId] = useState('')
    const [updateUtteranceValueChange, setUpdateUtteranceValueChange] = useState('')
    const [newUtteranceChange, setNewUtteranceChange] = useState('')
    


    const handleIntentEdit = () => {
        setOpenEditIntent(openEditIntent => !openEditIntent)
    }

    const handleIntentSave = () => {

        let values = {
            jid: loader_intent[0].jid,
            intent: updateIntent
        }
        setIntent(updateIntent)
        let formData = new FormData();
        formData.append('update_intent', JSON.stringify(values))
        submit(formData, { action: `/private/intents/${loader_intent[0].jid}`, method: 'post' })

        setOpenEditIntent(false)
    }


    const handleIntentDelete = () => {
        let values = {
            jid: loader_intent[0].jid
        }

        let formData = new FormData();
        formData.append('delete_intent', JSON.stringify(values))
        submit(formData, { action: `/private/intents/${loader_intent[0].jid}`, method: 'post' })
        setOpenIntentDialog(false)
    }



    const handleUtteranceEdit = (id: any) => {
        console.log("id")
        console.log(id)
        setUpdateUtteranceIdChange(id)
        setOpenEditUtterance(openEditUtterance => !openEditUtterance)
    }

    const handleUtteranceSave = () => {
        // const edit = updateUtteranceIdChange as number
        // list.splice(idx, 1, updateUtteranceValueChange)
        // let newList = [...list]
        let formData = new FormData();

        let values = {
            // name_of_intent: updateIntent,
            utterance: updateUtteranceValueChange,
            jid: updateUtteranceIdChange
        }

        formData.append('update_state_utterance', JSON.stringify(values))
        submit(formData, { action: `/private/intents/${loader_intent[0].jid}`, method: 'post' })
        setOpenEditUtterance(openEditUtterance => !openEditUtterance)
    }

    const handleUtteranceDelete = (jid: any, item: any) => {
        setDeleteUtteranceValue(item)
        setDeleteUtteranceId(jid)
        setOpenUtteranceDialog(true)
    }

    const confirmHandleUtteranceDelete = () => {
        const newList = list.filter((item: any, idx: any) => item.jid !== deleteUtteranceId);

        let values = {
            jid: deleteUtteranceId
        }
        setlist(newList)


        let formData = new FormData();
        formData.append('delete_intent_utterance', JSON.stringify(values))
        submit(formData, { action: `/private/intents/${loader_intent[0].jid}`, method: 'post' })

        setOpenUtteranceDialog(false)
    }

    const handleNewUtterance = async () => {
        let values = {
            utterance: newUtteranceChange,
            jid: loader_intent[0].jid
        }
        setlist([...list, values])

        let formData = new FormData();
        formData.append('create_state_utterance', JSON.stringify(values))
        submit(formData, { action: `/private/intents/${loader_intent[0].jid}`, method: 'post' })

        setOpenNewUtterance(openNewUtterance => !openNewUtterance)
    }

    const handleUtteranceDialogClose = () => {
        setOpenUtteranceDialog(false)
    }
    const handleNewUtteranceDialogClose = () => {
        setOpenNewUtterance(false)
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
                                            name={'intent'}
                                            defaultValue={intent}
                                            fullWidth
                                            onChange={event => setUpdateIntent(event.target.value)}
                                        />
                                    </>
                                    :
                                    <>
                                        <Box marginLeft={2}>
                                            <p>{intent}</p>
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

                        <Grid item xs={12}>
                            {list && [...list].reverse().map((item: any, idx: any) => (
                                // <Grid container spacing={2} key={idx} mt={2} sx={{ px: { xs: 2, md: 3 } }}>
                                <Grid
                                    container
                                    direction="row"
                                    justifyContent="space-between"
                                    alignItems="center"
                                    spacing={2}
                                    key={item.jid}
                                >
                                    {
                                        openEditUtterance && updateUtteranceIdChange == item.jid
                                            ?
                                            <Grid item xs={10}>
                                                <TextField
                                                    label="Utterance *"
                                                    variant="outlined"
                                                    name={'utterance'}
                                                    fullWidth
                                                    defaultValue={item.utterance}
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
                                                    defaultValue={item.utterance}
                                                />
                                            </Grid>
                                    }
                                    {
                                        openEditUtterance && updateUtteranceIdChange == item.jid
                                            ?
                                            null
                                            :
                                            <Grid item xs={10}>
                                                <Box marginLeft={2}>
                                                    <p>{item.utterance}</p>
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
                                                openEditUtterance && updateUtteranceIdChange == item.jid ?
                                                    <>
                                                        <Button variant="outlined" component="label" onClick={() => handleUtteranceEdit(item.jid)}>
                                                            Cancel
                                                        </Button>
                                                        <Button variant="contained" color="primary" onClick={handleUtteranceSave} disabled={!updateUtteranceValueChange}>
                                                            save
                                                        </Button>
                                                    </>
                                                    :
                                                    <>
                                                        <Button variant="outlined" component="label" onClick={() => handleUtteranceEdit(item.jid)}>
                                                            Edit
                                                        </Button>
                                                        <IconButton color="primary" aria-label="delete" component="label" onClick={() => handleUtteranceDelete(item.jid, item.utterance)}>
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

            </Grid>

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
                        {loader_intent[0].intent}
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
                    {/* <DialogContentText id="alert-dialog-description"> */}
                        <TextField
                            label="New Utterance *"
                            variant="outlined"
                            name={'utterance'}
                            fullWidth
                            multiline
                            rows={4}
                            onChange={event => setNewUtteranceChange(event.target.value)}
                        />
                    {/* </DialogContentText> */}
                </DialogContent>
                <DialogActions sx={{mb: 2, mx: 2}}>
                    <Button variant="outlined" onClick={() => setOpenNewUtterance(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handleNewUtterance} autoFocus>
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>



            {/* <Grid item xs={12} marginTop={3}>
                {loader_intent && <pre>{JSON.stringify(loader_intent, null, 1)}</pre>}
                {loader_utterances && <pre>{JSON.stringify(loader_utterances, null, 1)}</pre>}
            </Grid> */}
        </Grid>
    )
}


type LoaderType = {
    loader_intent: IntentType[]
    loader_utterances: IntentUtteranceType[]
}

async function httpPost(name: string, form: any) {
    // let form = request.formData()
    console.log(name + ' action httpPost')
    let val = form.get(name)
    let report = await HttpRequest(name, val)
    console.log("report")
    console.log(report)
    return report
}