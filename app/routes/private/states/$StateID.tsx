import { Box, Button, Grid, IconButton, MenuItem, Select, Stack, TextField, Typography } from "@mui/material"
import { Form, Link as NavLink, useLoaderData, useParams, useSubmit } from "@remix-run/react";

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



export const action: ActionFunction = async ({
    request, params
}) => {

    let form = await request.formData()
    let values = Object.fromEntries(form)
    console.log("values")
    console.log(values)

    if ('selectIntent' in values) {
        let jid = form.get('selectIntent') as string
        // console.log(jid)
        return redirect("/private/states/" + jid);
    }
    else if ('update_intent' in values) {
        await httpPost('update_intent', form)
        return redirect(`/private/states/${params.StateID}`);

    }
    else if ('create_intent_response' in values) {
        await httpPost('create_intent_response', form)
        return redirect(`/private/states/${params.StateID}`);
    }
    else if ('create_entity_response' in values) {
        await httpPost('create_entity_response', form)
        // console.log(report)
        // console.log(report["report"][0]['context'])
        // return redirect('/private/states/' + params.StateID);
        return redirect(`/private/states/${params.StateID}`);
        // return null
    }
    else if ('update_entity_prompt' in values) {
        await httpPost('update_entity_prompt', form)
        // console.log(report)
        // console.log(report["report"][0]['context'])
        // return redirect('/private/states/' + params.StateID);
        return redirect(`/private/states/${params.StateID}`);
        // return null

    }
    else if ("update_intent_response" in values) {
        await httpPost('update_intent_response', form)
        return redirect(`/private/states/${params.StateID}`);
    }
    else if ("delete_entity_response" in values) {
        await httpPost('delete_entity_response', form)
        return redirect(`/private/states/${params.StateID}`);
    }
    else if ("delete_intent_response" in values) {
        await httpPost('delete_intent_response', form)
        return redirect(`/private/states/${params.StateID}`);
    }
    else if ('delete_intent' in values) {
        await httpPost("delete_intent", form)
        return redirect('/private/entity');
        // return redirect('/private/states');
    }
    else {
        console.log('else action ran')
        // console.log(form.getAll('response'))
        // console.log(form.get('name'))
        // console.log(params.StateID)
        return redirect('/private/states/' + params.StateID);

    }


};


export const loader: LoaderFunction = async ({ params }) => {
    let id = { jid: params.StateID }

    try {
        const intent = await HttpRequest("list_all_intent", {})
        const entity = await HttpRequest("get_intent_entity", id)
        const intent_response = await HttpRequest("get_intent_response", id)
        const entity_response = await HttpRequest("get_entity_response", id)

        const intent_list = intent.payload
        const entity_list = [...entity.payload]
        const response_list = [...intent_response.payload, ...entity_response.payload]

        const error_list = [intent.error, entity.error, intent_response.error, entity_response.error]
        console.log(error_list)

        // return json({ intent_list: intent_list });
        return json({ intent_list: intent_list, entity_list: entity_list, response_list: response_list });
    } catch (error) {
        console.log(error)
        return json(error);
    }
};


export default function StateIDPage() {
    const { intent_list, entity_list, response_list } = useLoaderData<LoaderType>()
    const { StateID } = useParams();
    const submit = useSubmit();

    const [editIntent, setEditIntent] = useState(false)

    const [openIntentDialog, setOpenIntentDialog] = useState(false)

    const [openNewResponse, setOpenNewResponse] = useState(false)

    const [openEditResponse, setOpenEditResponse] = useState(false)
    const [editResponseValue, setEditResponseValue] = useState('')
    const [updateResponse, setUpdateResponse] = useState('')

    const [deleteUtteranceValue, setDeleteUtteranceValue] = useState<any>({})
    const [openUtteranceDialog, setOpenUtteranceDialog] = useState(false)

    let currentState = intent_list.filter((item: any) => item.jid === StateID)
    const [intent, setIntent] = useState(currentState[0].intent)

    const data = [...intent_list]
    const filteredList = [...response_list]

    const handleSelectIntent = (event: any) => {
        let formObject = TargetValue(event)
        let formData = new FormData();
        formData.append('selectIntent', formObject.value)
        submit(formData, { action: `/private/states/${StateID}`, method: 'post' })
    }


    const handleUtteranceDialogClose = () => {
        setOpenUtteranceDialog(false)
    }



    const handleSubmitIntent = (event: any) => {
        let formObject = FormValue(event)
        let formData = new FormData();

        let newFilterList = {
            jid: currentState[0].jid,
            intent: formObject.intent,
        }
        formData.append('update_intent', JSON.stringify(newFilterList))
        submit(formData, { action: `/private/states/${StateID}`, method: 'post' })

        let intentValue = formObject.intent as string
        setIntent(intentValue)
        setEditIntent(editIntent => !editIntent)
        // setSelectIntent([intent, ...extractedList])
        // setSelectIntentUpdate(formObject.intent)
    }

    const handleSubmitNewResponse = (event: any) => {
        let formObject = FormValue(event)
        let formData = new FormData();

        let newFilterList = {
            // jid: currentState[0].jid,
            jid: formObject.intent,
            response: formObject.response
        }
        // console.log(formObject);
        // console.log(newFilterList);

        if (StateID === formObject.intent) {
            // console.log("add_state_response")
            formData.append('create_intent_response', JSON.stringify(newFilterList))
            submit(formData, { action: `/private/states/${StateID}`, method: 'post' })

        }
        else {
            console.log("create_entity_response")
            formData.append('create_entity_response', JSON.stringify(newFilterList))
            submit(formData, { action: `/private/states/${StateID}`, method: 'post' })
        }
        setOpenNewResponse(openNewResponse => !openNewResponse)

        // formData.append('create', JSON.stringify(newFilterList))
        // submit(formData, { action: `/private/states/${StateID}`, method: 'post' })
    }


    const handleResponseEdit = (jid: any, response: string) => {
        setOpenEditResponse(openEditResponse => !openEditResponse)
        setEditResponseValue(response)
        console.log(jid, response)
        // setEditJid(jid)
    }

    const handleResponseDelete = () => {
        let formData = new FormData();
        let jid = deleteUtteranceValue.jid
        let response = deleteUtteranceValue.response

        // setOpenEditResponse(openEditResponse => !openEditResponse)
        setEditResponseValue(response)
        console.log(jid, response)
        let selectedItem = filteredList.find((item: any) => item.jid === jid)
        // selectedItem?.response.splice(idx, 1)
        console.log(selectedItem)
        const id = { "jid": selectedItem?.jid }


        if (currentState[0].intent === selectedItem?.intent) {
            console.log("delete_intent_response")
            formData.append('delete_intent_response', JSON.stringify(id))
            submit(formData, { action: `/private/states/${StateID}`, method: 'post' })
        }
        else {
            formData.append('delete_entity_response', JSON.stringify(id))
            submit(formData, { action: `/private/states/${StateID}`, method: 'post' })
        }


        setOpenUtteranceDialog(false)

    }

    const handleResponseSave = (jid: any, response: string) => {
        setOpenEditResponse(openEditResponse => !openEditResponse)
        // setEditResponseValue(response)
        const formData = new FormData();
        // console.log("updateData")
        // console.log(updateResponse)

        let data = {
            "jid": jid,
            "response": updateResponse
        }


        let selectedItem = filteredList.filter((item: any) => item.jid === jid)
        // selectedItem[0].response.splice(idx, 1, updateResponse)
        // console.log(selectedItem[0])

        if (currentState[0].intent === selectedItem[0].intent) {
            // console.log("update_state test")
            formData.append('update_intent_response', JSON.stringify(data))
            // console.log(formData)
            submit(formData, { action: `/private/states/${StateID}`, method: 'post' })
        }
        else {
            // console.log("update_entity_prompt test")
            formData.append('update_entity_prompt', JSON.stringify(data))
            submit(formData, { action: `/private/states/${StateID}`, method: 'post' })
        }
    }

    const handleUpdateResponse = (event: any) => {
        // let formObject = FormValue(event)
        // let formData = new FormData();
        var data = new FormData(event.target);

        let newFilterList = {
            jid: data.get("jid"),
            name: data.get("name"),
            response: data.getAll('response')
        }
        // setUpdateData(newFilterList)
        console.log(newFilterList)
        // console.log(data.getAll('response'))


        // console.log(event.target)
        // console.log(formObject)
        console.log("handleUpdateResponse ran")
        // console.log(event)
        // setOpenEditResponse(openEditResponse => !openEditResponse)

    }

    const handleUtteranceDelete = (jid: any, response: string) => {
        let item = {
            "jid": jid,
            "response": response
        }
        setDeleteUtteranceValue(item)
        setOpenUtteranceDialog(true)
        console.log("handle utt delete")
        console.log(item)
    }

    const handleIntentDelete = () => {
        let values = {
            jid: currentState[0].jid
        }

        let formData = new FormData();
        formData.append('delete_intent', JSON.stringify(values))
        submit(formData, { action: `/private/states/${currentState[0].jid}`, method: 'post' })
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
            <Grid item>
                <Stack
                    direction="row"
                    justifyContent="flex-start"
                    alignItems="center"
                >
                    <Typography variant="h4" >
                        State |
                    </Typography>
                    <Select
                        onChange={handleSelectIntent}
                        value={StateID}
                        name="select"
                        sx={{ fontSize: '2rem', fontWeight: 'bold', boxShadow: 'none', '.MuiOutlinedInput-notchedOutline': { border: 0 } }}
                    >
                        {data.map((item: any) => (
                            <MenuItem key={item.jid} value={item.jid}> {item.intent}</MenuItem>
                        ))}
                    </Select>
                </Stack>
            </Grid>

            <Grid item justifyContent='right' >
                <IconButton color="primary" component={NavLink} to="/private/entity">
                {/* <IconButton color="primary" component={NavLink} to="/private/states"> */}
                    <ArrowBackIosNewIcon />
                </IconButton>
            </Grid>

            <Grid item xs={12} >
                <Typography variant={'h6'} >
                    Intent
                </Typography>
            </Grid>

            <Grid item xs={12} >
                {
                    editIntent ?
                        <Form method='post' onSubmit={handleSubmitIntent}>
                            <Grid
                                container
                                direction="row"
                                justifyContent="space-between"
                                alignItems="center"
                                spacing={2}
                            >
                                <Grid item xs={10} >
                                    <TextField
                                        label="Intent *"
                                        variant="outlined"
                                        name={'intent'}
                                        fullWidth
                                        defaultValue={intent}
                                    />
                                </Grid>

                                <Grid item xs={2}>
                                    <Stack
                                        direction="row"
                                        justifyContent="flex-end"
                                        alignItems="center"
                                        spacing={2}
                                    >
                                        <Button variant="outlined" color="primary" onClick={() => setEditIntent(editIntent => !editIntent)}>
                                            Cancel
                                        </Button>
                                        <Button variant="contained" type="submit" >
                                            Update
                                        </Button>
                                    </Stack>

                                </Grid>
                            </Grid>
                        </Form>
                        :
                        <Grid
                            container
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                            spacing={2}
                        >

                            <Grid item xs={10}>
                                <Box marginLeft={2} >
                                    <p>{intent}</p>
                                </Box>
                            </Grid>

                            <Grid item xs={2}>
                                <Stack
                                    direction="row"
                                    justifyContent="flex-end"
                                    alignItems="center"
                                    spacing={2}
                                >
                                    <Button variant="outlined" color="primary" onClick={() => setEditIntent(editIntent => !editIntent)}>
                                        Edit
                                    </Button>
                                    <IconButton color="primary" aria-label="delete" component="label" onClick={() => setOpenIntentDialog(true)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </Stack>
                            </Grid>
                        </Grid>
                }
            </Grid>

            <Grid item xs={12} >
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    spacing={2}
                >

                    <Typography variant={'h6'} >
                        Responses
                    </Typography>

                    {
                        openNewResponse
                            ?
                            null
                            :
                            <Button variant={'contained'} onClick={() => setOpenNewResponse(openNewResponse => !openNewResponse)}>
                                New Response
                            </Button>
                    }

                </Stack>
            </Grid>

            <Grid item xs={12} marginTop={3}>
                {openNewResponse &&
                    <Form method="post" onSubmit={handleSubmitNewResponse}>

                        {/* <Grid
                            container
                            justifyContent="space-between"
                            alignItems="center"
                            direction="row"
                        // mt={2}
                        // mb={2}
                        > */}
                        <Grid
                            container
                            direction="row"
                            justifyContent="space-between"
                            alignItems="flex-start"
                            spacing={2}
                        >

                            <Grid xs={7}>
                                <TextField
                                    label="response *"
                                    variant="outlined"
                                    name={'response'}
                                    fullWidth
                                    multiline
                                    rows={3}
                                />
                            </Grid>
                            <Grid xs={2}>
                                <Select
                                    defaultValue={currentState[0].jid}
                                    name="intent"
                                    fullWidth
                                >
                                    <MenuItem value={currentState[0].jid}>{currentState[0].intent}</MenuItem>
                                    {entity_list.map((item: any) => (
                                        <MenuItem key={item.jid} value={item.jid}> {item.entity}</MenuItem>
                                    ))}
                                </Select>
                            </Grid>

                            <Grid xs={2}>
                                <Stack
                                    direction="row"
                                    justifyContent="flex-end"
                                    alignItems="center"
                                    spacing={2}
                                >
                                    <Button type="submit" variant="contained" color="primary" >
                                        Save
                                    </Button>
                                    <Button variant="outlined" color="primary" onClick={() => setOpenNewResponse(openNewResponse => !openNewResponse)}>
                                        Cancel
                                    </Button>
                                </Stack>
                            </Grid>

                        </Grid>
                    </Form>
                }
            </Grid>

            <Grid item xs={12} sx={{maxHeight: 400, overflow: 'auto'}}>
                <Form method="post" onSubmit={handleUpdateResponse}>
                    {
                        response_list.map((item: any) => (
                            <Grid
                                container
                                direction="row"
                                justifyContent="space-between"
                                alignItems="flex-start"
                                spacing={2}
                                key={item.jid}
                            >
                                {/* <Grid item xs={12}> */}
                                {/* {item.responses.map((response: any, idx: any) => ( */}


                                {/* <Grid container spacing={2} key={idx}> */}

                                {openEditResponse && editResponseValue == item.response ?
                                    <Grid item xs={8}>
                                        <TextField
                                            id="response"
                                            label="response"
                                            defaultValue={item.response} onChange={evt => setUpdateResponse(evt.target.value)}
                                            fullWidth

                                        />
                                    </Grid>
                                    :
                                    <Grid item xs={8}>
                                        <Box marginLeft={2}>
                                            <p>{item.response}</p>
                                        </Box>
                                    </Grid>
                                }
                                
                                {openEditResponse && editResponseValue == item.response ?
                                    null
                                    :
                                    <Grid item xs={2} >
                                        <Stack
                                            direction="row"
                                            justifyContent="flex-end"
                                            alignItems="center"
                                            spacing={2}
                                        >

                                            {/* <Chip variant="outlined" color="primary" label={item.intent}/> */}

                                            <Button variant="text" color="primary">
                                                {item.intent}
                                            </Button>
                                        </Stack>
                                    </Grid>
                                }

                                <Grid item xs={2} >
                                    <Stack
                                        direction="row"
                                        justifyContent="flex-end"
                                        alignItems="center"
                                        spacing={2}
                                    >

                                        <Button variant="outlined" component="label" onClick={() => handleResponseEdit(item.jid, item.response)}>
                                            {openEditResponse && editResponseValue == item.response ? "cancel" : "Edit"}
                                        </Button>
                                        {openEditResponse && editResponseValue == item.response ?
                                            <Button variant="contained" color="primary" onClick={() => handleResponseSave(item.jid, item.response)} disabled={!updateResponse}>
                                                save
                                            </Button>
                                            :
                                            <IconButton color="primary" aria-label="delete" component="label" onClick={() => handleUtteranceDelete(item.jid, item.response)}>
                                                <DeleteIcon />
                                            </IconButton>
                                        }
                                    </Stack>
                                </Grid>
                                {/* </Grid> */}

                                {/* ))} */}
                                {/* </Grid> */}
                            </Grid>
                        ))}

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
                        {deleteUtteranceValue.response}
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ mb: 2, mx: 2 }}>

                    <Button variant="outlined" onClick={handleUtteranceDialogClose}>Cancel</Button>
                    <Button variant="contained" onClick={handleResponseDelete} autoFocus>
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
                    Would you like to delete this state?
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {intent}
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ mb: 2, mx: 2 }}>

                    <Button variant="outlined" onClick={() => setOpenIntentDialog(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handleIntentDelete} autoFocus>
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>

            {/* {intent_list && <pre>{JSON.stringify(intent_list, null, 1)}</pre>}
            {entity_list && <pre>{JSON.stringify(entity_list, null, 1)}</pre>}
            {response_list && <pre>{JSON.stringify(response_list, null, 1)}</pre>}
             */}
        </Grid>
    )
}



// export default function IntentID() {
//     const { StateID } = useParams();
//     const submit = useSubmit();
//     const {intent_list, entity_list, response_list } = useLoaderData<LoaderType>()

//     console.log(intent_list)
//     console.log(entity_list)
//     console.log(response_list)

//     // const data = [...intent_list]
//     // const filteredList = [...response_list]

//     // let currentState = intent_list.filter((item: any) => item.jid === StateID)

//     const [editIntent, setEditIntent] = useState(false)
//     const [openIntentDialog, setOpenIntentDialog] = useState(false)
//     // const [intent, setIntent] = useState(currentState[0].intent)

//     const [openNewResponse, setOpenNewResponse] = useState(false)

//     const [openEditResponse, setOpenEditResponse] = useState(false)
//     const [editResponseValue, setEditResponseValue] = useState('')
//     const [updateResponse, setUpdateResponse] = useState('')
//     // const [editJid, setEditJid] = useState('')
//     // const [updateData, setUpdateData] = useState<any>({})

//     const [deleteUtteranceValue, setDeleteUtteranceValue] = useState<any>({})
//     const [openUtteranceDialog, setOpenUtteranceDialog] = useState(false)

//     // select
//     const handleSelectIntent = (event: any) => {
//         let formObject = TargetValue(event)
//         let formData = new FormData();
//         formData.append('selectIntent', formObject.value)
//         submit(formData, { action: `/private/states/${StateID}`, method: 'post' })
//     }


//     // const handleUtteranceDialogClose = () => {
//     //     setOpenUtteranceDialog(false)
//     // }



//     const handleSubmitIntent = (event: any) => {
//         let formObject = FormValue(event)
//         let formData = new FormData();

//         let newFilterList = {
//             // jid: currentState[0].jid,
//             intent: formObject.intent,
//         }
//         // console.log(formObject);
//         // console.log("newFilterList");
//         // console.log(newFilterList);
//         // console.log(extractedList)
//         // console.log(currentState)

//         formData.append('update_intent', JSON.stringify(newFilterList))
//         submit(formData, { action: `/private/states/${StateID}`, method: 'post' })

//         // let intentValue = formObject.intent as string
//         // setIntent(intentValue)
//         setEditIntent(editIntent => !editIntent)
//         // setSelectIntent([intent, ...extractedList])
//         // setSelectIntentUpdate(formObject.intent)
//     }

//     // const handleSubmitNewResponse = (event: any) => {
//     //     let formObject = FormValue(event)
//     //     let formData = new FormData();

//     //     let newFilterList = {
//     //         jid: currentState[0].jid,
//     //         // name: formObject.intent,
//     //         response: formObject.response
//     //     }
//     //     // console.log(formObject);
//     //     // console.log(newFilterList);

//     //     if (currentState[0].intent === formObject.intent) {
//     //         // console.log("add_state_response")
//     //         formData.append('create_intent_response', JSON.stringify(newFilterList))
//     //         submit(formData, { action: `/private/states/${StateID}`, method: 'post' })

//     //     }
//     //     else {
//     //         console.log("create_entity_response")
//     //         formData.append('create_entity_response', JSON.stringify(newFilterList))
//     //         submit(formData, { action: `/private/states/${StateID}`, method: 'post' })
//     //     }
//     //     setOpenNewResponse(openNewResponse => !openNewResponse)

//     //     // formData.append('create', JSON.stringify(newFilterList))
//     //     // submit(formData, { action: `/private/states/${StateID}`, method: 'post' })
//     // }


//     // const handleResponseEdit = (jid: any, idx: any, response: string) => {
//     //     setOpenEditResponse(openEditResponse => !openEditResponse)
//     //     setEditResponseValue(response)
//     //     console.log(jid, idx, response)
//     //     // setEditJid(jid)
//     // }

//     // const handleResponseDelete = () => {
//     //     let formData = new FormData();
//     //     let jid = deleteUtteranceValue.jid
//     //     let idx = deleteUtteranceValue.idx
//     //     let response = deleteUtteranceValue.response

//     //     // setOpenEditResponse(openEditResponse => !openEditResponse)
//     //     setEditResponseValue(response)
//     //     console.log(jid, idx, response)
//     //     let selectedItem = filteredList.find((item: any) => item.jid === jid)
//     //     selectedItem?.responses.splice(idx, 1)
//     //     console.log(selectedItem)


//     //     if (currentState[0].intent === selectedItem?.intent) {
//     //         console.log("update_state")
//     //         formData.append('update_state', JSON.stringify(selectedItem))
//     //         submit(formData, { action: `/private/states/${StateID}`, method: 'post' })


//     //     }
//     //     else {
//     //         formData.append('update_entity_prompt', JSON.stringify(selectedItem))
//     //         submit(formData, { action: `/private/states/${StateID}`, method: 'post' })
//     //     }


//     //     setOpenUtteranceDialog(false)

//     // }

//     // const handleResponseSave = (jid: any, idx: any, response: string) => {
//     //     setOpenEditResponse(openEditResponse => !openEditResponse)
//     //     // setEditResponseValue(response)
//     //     const formData = new FormData();
//     //     console.log("updateData")


//     //     let selectedItem = filteredList.filter((item: any) => item.jid === jid)
//     //     selectedItem[0].responses.splice(idx, 1, updateResponse)
//     //     console.log(selectedItem[0])

//     //     if (currentState[0].intent === selectedItem[0].intent) {
//     //         console.log("update_state test")
//     //         formData.append('update_state', JSON.stringify(selectedItem[0]))
//     //         // console.log(formData)
//     //         submit(formData, { action: `/private/states/${StateID}`, method: 'post' })
//     //     }
//     //     else {
//     //         console.log("update_entity_prompt test")
//     //         formData.append('update_entity_prompt', JSON.stringify(selectedItem[0]))
//     //         submit(formData, { action: `/private/states/${StateID}`, method: 'post' })
//     //     }
//     // }

//     // const handleUpdateResponse = (event: any) => {
//     //     // let formObject = FormValue(event)
//     //     // let formData = new FormData();
//     //     var data = new FormData(event.target);

//     //     let newFilterList = {
//     //         jid: data.get("jid"),
//     //         name: data.get("name"),
//     //         response: data.getAll('response')
//     //     }
//     //     // setUpdateData(newFilterList)
//     //     console.log(newFilterList)
//     //     // console.log(data.getAll('response'))


//     //     // console.log(event.target)
//     //     // console.log(formObject)
//     //     console.log("handleUpdateResponse ran")
//     //     // console.log(event)
//     //     // setOpenEditResponse(openEditResponse => !openEditResponse)

//     // }

//     // const handleUtteranceDelete = (jid: any, idx: any, response: string) => {
//     //     let item = {
//     //         "jid": jid,
//     //         "idx": idx,
//     //         "response": response
//     //     }
//     //     setDeleteUtteranceValue(item)
//     //     setOpenUtteranceDialog(true)
//     //     console.log("handle utt delete")
//     //     console.log(item)
//     // }

//     // const handleIntentDelete = () => {
//     //     let values = {
//     //         id: currentState[0].jid
//     //     }

//     //     let formData = new FormData();
//     //     formData.append('delete_state', JSON.stringify(values))
//     //     submit(formData, { action: `/private/states/${currentState[0].jid}`, method: 'post' })
//     //     setOpenIntentDialog(false)
//     // }


//     return (
//         <Grid
//             container
//             direction="row"
//             justifyContent="space-between"
//             alignItems="center"
//             spacing={1}
//         >
//             <Grid item>
//                 <Stack
//                     direction="row"
//                     justifyContent="flex-start"
//                     alignItems="center"
//                 >
//                     <Typography variant="h4" >
//                         State |
//                     </Typography>
//                     {/* <Select
//                         onChange={handleSelectIntent}
//                         value={StateID}
//                         name="select"
//                         sx={{ fontSize: '2rem', fontWeight: 'bold', boxShadow: 'none', '.MuiOutlinedInput-notchedOutline': { border: 0 } }}
//                     >
//                         {data.map((item: any) => (
//                             <MenuItem key={item.jid} value={item.jid}> {item.intent}</MenuItem>
//                         ))}
//                     </Select> */}
//                 </Stack>
//             </Grid>

//             <Grid item justifyContent='right' >
//                 <IconButton color="primary" component={NavLink} to="/private/states">
//                     <ArrowBackIosNewIcon />
//                 </IconButton>
//             </Grid>

//             <Grid item xs={12} >
//                 <Typography variant={'h6'} >
//                     Intent
//                 </Typography>
//             </Grid>

//             <Grid item xs={12} >
//                 {
//                     editIntent ?
//                         <Form method='post' onSubmit={handleSubmitIntent}>
//                             {/* <Grid container spacing={4}> */}

//                             {/* <Grid
//                             container
//                             spacing={2}
//                             // sx={{ px: { xs: 2, md: 3 } }}
//                             mt={2}
//                             direction="row"
//                             alignItems="center"
//                         > */}
//                             <Grid
//                                 container
//                                 direction="row"
//                                 justifyContent="space-between"
//                                 alignItems="center"
//                                 spacing={2}
//                             >
//                                 {/* <Grid item xs={10} >
//                                     <TextField
//                                         label="Intent *"
//                                         variant="outlined"
//                                         name={'intent'}
//                                         fullWidth
//                                         defaultValue={currentState[0].intent}
//                                     />
//                                 </Grid> */}

//                                 <Grid item xs={2}>
//                                     <Stack
//                                         direction="row"
//                                         justifyContent="flex-end"
//                                         alignItems="center"
//                                         spacing={2}
//                                     >
//                                         <Button variant="outlined" color="primary" onClick={() => setEditIntent(editIntent => !editIntent)}>
//                                             Cancel
//                                         </Button>
//                                         <Button variant="contained" type="submit" >
//                                             Update
//                                         </Button>
//                                     </Stack>

//                                 </Grid>
//                             </Grid>
//                         </Form>
//                         :
//                         <Grid
//                             container
//                             direction="row"
//                             justifyContent="space-between"
//                             alignItems="center"
//                             spacing={2}
//                         >

//                             <Grid item xs={10}>
//                                 <Box marginLeft={2} >
//                                     {/* <p>{currentState[0].intent}</p> */}
//                                 </Box>
//                             </Grid>

//                             <Grid item xs={2}>
//                                 <Stack
//                                     direction="row"
//                                     justifyContent="flex-end"
//                                     alignItems="center"
//                                     spacing={2}
//                                 >
//                                     <Button variant="outlined" color="primary" onClick={() => setEditIntent(editIntent => !editIntent)}>
//                                         Edit
//                                     </Button>
//                                     <IconButton color="primary" aria-label="delete" component="label" onClick={() => setOpenIntentDialog(true)}>
//                                         <DeleteIcon />
//                                     </IconButton>
//                                 </Stack>
//                             </Grid>
//                         </Grid>
//                 }
//             </Grid>

//             {/* <Grid item xs={12} >
//                 <Stack
//                     direction="row"
//                     justifyContent="space-between"
//                     alignItems="center"
//                     spacing={2}
//                 >

//                     <Typography variant={'h6'} >
//                         Responses
//                     </Typography>

//                     {
//                         openNewResponse
//                             ?
//                             null
//                             :
//                             <Button variant={'contained'} onClick={() => setOpenNewResponse(openNewResponse => !openNewResponse)}>
//                                 New Response
//                             </Button>
//                     }

//                 </Stack>
//             </Grid> */}

//             {/* <Grid item xs={12} marginTop={3}>
//                 {openNewResponse &&
//                     <Form method="post" onSubmit={handleSubmitNewResponse}>

//                         <Grid
//                             container
//                             direction="row"
//                             justifyContent="space-between"
//                             alignItems="flex-start"
//                             spacing={2}
//                         >

//                             <Grid xs={7}>
//                                 <TextField
//                                     label="response *"
//                                     variant="outlined"
//                                     name={'response'}
//                                     fullWidth
//                                     multiline
//                                     rows={3}
//                                 />
//                             </Grid>

//                             <Grid xs={2}>
//                                 <Select
//                                     defaultValue={currentState[0].intent}
//                                     name="intent"
//                                     fullWidth
//                                 >
//                                     <MenuItem value={currentState[0].intent}>{currentState[0].intent}</MenuItem>
//                                     {intent_list.map((item: any) => (
//                                         <MenuItem key={item} value={item}> {item}</MenuItem>
//                                     ))}
//                                 </Select>
//                             </Grid>

//                             <Grid xs={2}>
//                                 <Stack
//                                     direction="row"
//                                     justifyContent="flex-end"
//                                     alignItems="center"
//                                     spacing={2}
//                                 >
//                                     <Button type="submit" variant="contained" color="primary" >
//                                         Save
//                                     </Button>
//                                     <Button variant="outlined" color="primary" onClick={() => setOpenNewResponse(openNewResponse => !openNewResponse)}>
//                                         Cancel
//                                     </Button>
//                                 </Stack>
//                             </Grid>




//                         </Grid>
//                     </Form>
//                 }
//             </Grid> */}
// {/* 
//             <Grid item xs={12}>
//                 <Form method="post" onSubmit={handleUpdateResponse}>
//                     {
//                         response_list.map((item: any) => (
//                             <Grid
//                                 container
//                                 direction="row"
//                                 justifyContent="space-between"
//                                 alignItems="flex-start"
//                                 spacing={2}
//                                 key={item.jid}
//                             >
//                                 <Grid item xs={12}>
//                                     {
//                                         item.responses.map((response: any, idx: any) => (


//                                             <Grid container spacing={2} key={idx}>

//                                                 {openEditResponse && editResponseValue == response ?
//                                                     <Grid item xs={8}>
//                                                         <TextField
//                                                             id="response"
//                                                             label="response"
//                                                             defaultValue={response} onChange={evt => setUpdateResponse(evt.target.value)}
//                                                             fullWidth

//                                                         />
//                                                     </Grid>
//                                                     :
//                                                     <Grid item xs={8}>
//                                                         <Box marginLeft={2}>
//                                                             <p>{response}</p>
//                                                         </Box>
//                                                     </Grid>
//                                                 }
//                                                 <Grid item xs={2} >
//                                                     <Stack
//                                                         direction="row"
//                                                         justifyContent="flex-end"
//                                                         alignItems="center"
//                                                         spacing={2}
//                                                     >
//                                                         <Button variant="text" color="primary">
//                                                             {item.intent}
//                                                         </Button>
//                                                     </Stack>
//                                                 </Grid>

//                                                 <Grid item xs={2} >
//                                                     <Stack
//                                                         direction="row"
//                                                         justifyContent="flex-end"
//                                                         alignItems="center"
//                                                         spacing={2}
//                                                     >

//                                                         <Button variant="outlined" component="label" onClick={() => handleResponseEdit(item.jid, idx, response)}>
//                                                             {openEditResponse && editResponseValue == response ? "cancel" : "Edit"}
//                                                         </Button>
//                                                         {openEditResponse && editResponseValue == response ?
//                                                             <Button variant="contained" color="primary" onClick={() => handleResponseSave(item.jid, idx, response)} disabled={!updateResponse}>
//                                                                 save
//                                                             </Button>
//                                                             :
//                                                             <IconButton color="primary" aria-label="delete" component="label" onClick={() => handleUtteranceDelete(item.jid, idx, response)}>
//                                                                 <DeleteIcon />
//                                                             </IconButton>
//                                                         }
//                                                     </Stack>
//                                                 </Grid>
//                                             </Grid>

//                                         ))}
//                                 </Grid>
//                             </Grid>
//                         ))}

//                 </Form>
//             </Grid>

//             <Dialog
//                 open={openUtteranceDialog}
//                 onClose={handleUtteranceDialogClose}
//                 aria-labelledby="alert-dialog-title"
//                 aria-describedby="alert-dialog-description"
//                 fullWidth
//                 maxWidth={'sm'}
//             >
//                 <DialogTitle id="alert-dialog-title">
//                     Would you like to delete?
//                 </DialogTitle>
//                 <DialogContent>
//                     <DialogContentText id="alert-dialog-description">
//                         {deleteUtteranceValue.response}
//                     </DialogContentText>
//                 </DialogContent>
//                 <DialogActions sx={{mb: 2, mx: 2}}>

//                     <Button variant="outlined" onClick={handleUtteranceDialogClose}>Cancel</Button>
//                     <Button variant="contained" onClick={handleResponseDelete} autoFocus>
//                         Confirm
//                     </Button>
//                 </DialogActions>
//             </Dialog>


//             <Dialog
//                 open={openIntentDialog}
//                 onClose={handleUtteranceDialogClose}
//                 aria-labelledby="alert-dialog-title"
//                 aria-describedby="alert-dialog-description"
//                 fullWidth
//                 maxWidth={'sm'}
//             >
//                 <DialogTitle id="alert-dialog-title">
//                     Would you like to delete this state?
//                 </DialogTitle>
//                 <DialogContent>
//                     <DialogContentText id="alert-dialog-description">
//                         {currentState[0].intent}
//                     </DialogContentText>
//                 </DialogContent>
//                 <DialogActions sx={{mb: 2, mx: 2}}>

//                     <Button variant="outlined" onClick={() => setOpenIntentDialog(false)}>Cancel</Button>
//                     <Button variant="contained" onClick={handleIntentDelete} autoFocus>
//                         Confirm
//                     </Button>
//                 </DialogActions>
//             </Dialog>

//  */}

//         </Grid >

//     )
// }

type LoaderType = {
    intent_list: IntentType[]
    entity_list: EntityType[]
    response_list: StateType[]
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


function FormValue(event: any) {
    event.preventDefault();
    var data = new FormData(event.target);
    let formObject = Object.fromEntries(data.entries());
    return formObject
}

function TargetValue(event: any) {
    return event.target
}