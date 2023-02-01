import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import { HttpRequest } from "~/utils/jac/httpRequest";

import { Button, Grid, IconButton, Stack, styled, TextField, Typography } from "@mui/material"
import { useLoaderData, useParams, useSubmit } from "@remix-run/react";
import DeleteIcon from '@mui/icons-material/Delete';
import { useState } from "react";

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Chip, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
// import reactStringReplace from "react-string-replace";


const Div = styled('div')(({ theme }) => ({
    ...theme.typography.subtitle1,
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(1),
}));


export const loader: LoaderFunction = async ({ params }) => {
    let id = { jid: params.EntityID }
    console.log(id);

    try {
        const entity = await HttpRequest("get_intent_entity", id)
        const utterance = await HttpRequest("get_entity_context", id)

        const entity_list = [...entity.payload]
        const utterance_list = [...utterance.payload]

        // const error_list = [entity.error, utterance.error]
        // console.log(error_list)
        // console.log(entity_list)

        return json({ entity_list: entity_list, utterance_list: utterance_list });
    } catch (error) {
        console.log(error)
        return json(error);
    }
};


export const action: ActionFunction = async ({
    request, params
}) => {

    let form = await request.formData()
    let values = Object.fromEntries(form)
    console.log("values")
    console.log(values)

    if ('create_intent_entity' in values) {
        await httpPost("create_intent_entity", form)
        return redirect('/private/entity/' + params.EntityID);
    }
    else if ('create_entity_context' in values) {
        await httpPost("create_entity_context", form)
        return redirect('/private/entity/' + params.EntityID);
    }
    else if ('delete_entity_context' in values) {
        await httpPost("delete_entity_context", form)
        return redirect('/private/entity/' + params.EntityID);
    }
    else if ('update_entity_context' in values) {
        await httpPost("update_entity_context", form)
        return redirect('/private/entity/' + params.EntityID);
    }
    else {
        console.log('else action ran')
        // console.log(form.getAll('response'))
        // console.log(form.get('name'))
        // console.log(params.StateID)
        // return redirect('private/states/' + params.StateID);
        return null;

    }


};

export default function EntityID() {

    const { entity_list, utterance_list } = useLoaderData<LoaderType>()
    const { EntityID } = useParams();
    const submit = useSubmit();

    const [inputText, setInputText] = useState("");
    const [selectedText, setSelectedText] = useState("");
    // const [selectedEntity, setSelectedEntity] = useState('');

    const [openDialog, setOpenDialog] = useState(false);
    const [openNewEntityDialog, setOpenNewEntityDialog] = useState(false);
    const [newEntity, setNewEntity] = useState('');
    const [openDelete, setOpenDelete] = useState(false);
    const [deleteValue, setDeleteValue] = useState('');
    const [deleteID, setDeleteID] = useState('');
    const [openEdit, setOpenEdit] = useState(false);
    const [openEditId, setOpenEditId] = useState('');
    const [openNewUtterance, setOpenNewUtterance] = useState(false);



    const handleCloseDelete = () => {
        setOpenDelete(false)
    }

    const handleDeleteOpen = (jid: any, value: any) => {
        setDeleteValue(value)
        setDeleteID(jid)
        setOpenDelete(true)
    }

    const handleDelete = () => {
        let formData = new FormData();
        const value = {
            "jid": deleteID
        }
        formData.append('delete_entity_context', JSON.stringify(value))
        submit(formData, { action: `/private/entity/${EntityID}`, method: 'post' })

        setOpenDelete(false)
    }

    const currentSelection = (e: any) => {
        const valueSelected = e.target.value.substring(e.target.selectionStart, e.target.selectionEnd)
        // setInputText(e.target.value)
        const notValue = ["", " ", "  ", ". ", "? ", ".", "?"]
        if (!notValue.includes(valueSelected)) {
            console.log(
                "current selection",
                e.target.value.substring(e.target.selectionStart, e.target.selectionEnd)
            );

            const startIndex = e.target.selectionStart;
            const endIndex = e.target.selectionEnd;
            const bracketedText = `[${e.target.value.slice(startIndex, endIndex)}]`;
            const newText = e.target.value.substring(0, startIndex) + bracketedText + e.target.value.substring(endIndex);
            setInputText(newText);


            setSelectedText(valueSelected)
            handleClickOpen()
            // handleClose()
        }

        // console.log('selections')
        // console.log(e.target.selectionStart)
        // console.log(e.target.selectionEnd)


        // console.log(newText)

    }

    const handleClickOpen = () => {
        setOpenDialog(true);
    };

    const handleClose = () => {
        setOpenDialog(false);
    };

    const handleNewEntityContext = () => {
        let formData = new FormData();

        const data = {
            "jid": EntityID,
            "utterance": inputText
        }

        formData.append('create_entity_context', JSON.stringify(data))
        submit(formData, { action: `/private/entity/${EntityID}`, method: 'post' })

        setOpenNewUtterance(false)
        setOpenDialog(false);
        setInputText("")
    };

    const handleNewEntityClose = () => {
        setOpenNewEntityDialog(false);
    };

    const handleNewEntitySubmit = () => {
        let formData = new FormData();
        const value = {
            "jid": EntityID,
            "entity": newEntity
        }
        formData.append('create_intent_entity', JSON.stringify(value))
        submit(formData, { action: `/private/entity/${EntityID}`, method: 'post' })

        setOpenNewEntityDialog(false);
    };

    const handleSelectIntent = async (event: any) => {
        let formObject = TargetValue(event)

        var value = "[" + selectedText + "](" + formObject.value + ")";
        var repValue = "[" + selectedText + "]";
        var newUtt = inputText.replace(repValue, value);

        setInputText(newUtt)
        handleClose()
    }

    let customDict = [];
    customDict = utterance_list.map((item: any) => {
        const dic: { [key: string]: string } = {};
        // var before = item.utterance.split('[')[0];
        // dic['before'] = before;
        // var after = item.utterance.split(')')[1]
        // dic['after'] = after;
        dic['utterance'] = item.utterance;
        dic['entity'] = item.entity_type;
        dic['value'] = item.entity_value;
        dic["jid"] = item.jid;

        return dic
    })


    const handleOpenEdit = (jid: any, utterance: any) => {
        setOpenEdit(openEdit => !openEdit)
        setOpenEditId(jid)
        setInputText(utterance)
    }

    const handleOpenEditSave = (jid: any, utterance: any) => {

        let formData = new FormData();
        const value = {
            "jid": openEditId,
            "utterance": inputText
        }
        formData.append('update_entity_context', JSON.stringify(value))
        submit(formData, { action: `/private/entity/${EntityID}`, method: 'post' })

        setOpenEdit(openEdit => !openEdit)
        setOpenEditId('')
        setInputText("")

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
                    Entities
                </Typography>
            </Grid>

            <Grid item justifyContent='right' >
                <Button variant="contained" onClick={() => setOpenNewEntityDialog(true)} color="primary">New Entity</Button>
            </Grid>
            {/* <Grid item xs={12} marginTop={3}>
                {openEditId !== "" ?

                    <TextField
                        id="utterance"
                        label="utterance"
                        placeholder="Enter your sentence here"
                        onClick={currentSelection}
                        onChange={evt => setInputText(evt.target.value)}
                        multiline
                        fullWidth
                        rows={4}
                    />
                    :
                    <TextField
                        id="utterance"
                        label="utterance"
                        placeholder="Enter your sentence here"
                        onClick={currentSelection}
                        value={inputText}
                        onChange={evt => setInputText(evt.target.value)}
                        multiline
                        fullWidth
                        rows={4}
                    />
                }
            </Grid> */}
            <Grid item xs={12} marginTop={3}>
                {/* <Stack direction="row" spacing={1}> */}

                <Stack
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                    spacing={2}
                >
                    {entity_list.map((item:any)=>(
                        <Chip key={item.jid} label={item.entity} color="primary" variant="outlined" />

                    ))}

                    {/* <Chip label="success" color="info" variant="outlined" />
                    <Chip label="success" color="info" variant="outlined" /> */}
                </Stack>
            </Grid>
            <Grid item xs={12} sx={{ mt: 3, mb: 3 }}>

                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    spacing={2}
                >
                    <Typography variant="h4" >
                        Entity Contexts
                    </Typography>
                    {/* <Button variant="contained" color="primary" onClick={handleNewEntityContext}>Create utterance</Button> */}
                    <Button variant="contained" color="primary" onClick={() => setOpenNewUtterance(true)}>Create utterance</Button>
                </Stack>
            </Grid>



            {openNewUtterance &&
                < Grid item xs={12}>
                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        spacing={2}
                    >
                        <TextField
                            id="utterance"
                            label="utterance"
                            placeholder="Enter your sentence here"
                            onClick={currentSelection}
                            value={inputText}
                            onChange={evt => setInputText(evt.target.value)}
                            multiline
                            fullWidth
                            rows={2}
                        />
                        <Stack
                            direction="row"
                            justifyContent="flex-end"
                            alignItems="center"
                            spacing={1}
                        >
                            {/* <> */}
                            <Button variant="text" color="primary" onClick={handleNewEntityContext} >Save</Button>
                            <Button variant="text" color="primary" >Cancel</Button>
                            {/* </> */}
                        </Stack>
                    </Stack>
                </Grid>
            }



            <Grid item xs={12} sx={{ maxHeight: 400, overflow: 'auto' }}>
                {
                    customDict &&
                    [...customDict].reverse().map((item: any, idx: any) => (
                        // <p key={idx}>
                        //     {item.before}
                        //     {/* <Chip label={item.entity} /> */}
                        // </p>
                        <div key={idx}>

                            <Stack
                                direction="row"
                                justifyContent="space-between"
                                alignItems="center"
                                spacing={2}
                            >
                                {openEdit && openEditId === item.jid
                                    ?
                                    // <Grid item xs={10} >
                                    <TextField
                                        label="Intent *"
                                        variant="outlined"
                                        name={'intent'}
                                        value={inputText}
                                        onClick={currentSelection}
                                        onChange={evt => setInputText(evt.target.value)}
                                        multiline
                                        fullWidth
                                        rows={3}
                                    />
                                    // </Grid>
                                    :
                                    <Div sx={{ bt: 2 }}>
                                        {item.utterance}
                                    </Div>

                                }
                                <Stack
                                    direction="row"
                                    justifyContent="flex-end"
                                    alignItems="center"
                                    spacing={1}
                                >
                                    {openEdit && openEditId === item.jid
                                        ?
                                        <>
                                            <Button variant="text" color="primary" onClick={() => handleOpenEditSave(item.jid, item.utterance)}>Save</Button>
                                            <Button variant="text" color="primary" onClick={() => handleOpenEdit(item.jid, item.utterance)}>Cancel</Button>
                                        </>
                                        :
                                        <>
                                            <Button variant="text" color="primary" onClick={() => handleOpenEdit(item.jid, item.utterance)} >Edit</Button>
                                            <IconButton color="primary" aria-label="delete" component="label" onClick={() => handleDeleteOpen(item.jid, item.utterance)}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </>
                                    }
                                </Stack>
                            </Stack>
                        </div>


                    ))
                }
            </Grid>


            {/* <Dialog
                open={openDialogEdit}
                onClose={handleCloseEdit}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                fullWidth
                maxWidth={'sm'}
            >
                <DialogTitle id="alert-dialog-title">
                    Update Entity Context
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        <TextField
                            id="utterance"
                            label="utterance"
                            placeholder="Enter your sentence here"
                            onClick={currentSelection}
                            multiline
                            fullWidth
                            defaultValue={editValue}
                            rows={4}
                        />
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <DialogActions sx={{ mb: 2, mx: 2 }}>
                        <Button variant="outlined" onClick={handleCloseEdit}>Cancel</Button>
                        <Button variant="contained" onClick={handleSubmitDialogEdit} autoFocus>
                            Confirm
                        </Button>
                    </DialogActions>
                </DialogActions>
            </Dialog> */}


            <Dialog
                open={openDelete}
                onClose={handleCloseDelete}
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
                        <Button variant="outlined" onClick={handleCloseDelete}>Cancel</Button>
                        <Button variant="contained" onClick={handleDelete} autoFocus>
                            Confirm
                        </Button>
                    </DialogActions>
                </DialogActions>
            </Dialog>

            <Dialog open={openDialog} onClose={handleClose}
                fullWidth
                maxWidth={'sm'}>
                <DialogTitle>New Entity Context</DialogTitle>
                {/* {entity_list ? */}
                {entity_list.length === 0 ?
                    <DialogContent>
                        <DialogContentText>
                            Please create an entity
                        </DialogContentText>
                    </DialogContent>
                    :
                    <>
                        <DialogContent>
                            Select the entity for
                            <Chip label={selectedText} />
                        </DialogContent>

                        <DialogContent>
                            <FormControl fullWidth>

                                <Stack
                                    direction="column"
                                    justifyContent="flex-start"
                                    alignItems="flex-start"
                                    spacing={2}
                                >

                                    <InputLabel id="demo-multiple-name-label">Name</InputLabel>
                                    <Select
                                        onChange={handleSelectIntent}
                                        name="select"
                                        fullWidth
                                        value={"default"}
                                    >
                                        <MenuItem value={"default"}> select entity</MenuItem>
                                        {
                                            entity_list.map((item: any) => (
                                                <MenuItem key={item.jid} value={item.entity}> {item.entity}</MenuItem>
                                            ))
                                        }
                                    </Select>
                                </Stack>

                            </FormControl>
                        </DialogContent>
                    </>
                }
                {/* <DialogActions sx={{ mb: 2, mx: 2 }}>
                    {entity_list.length === 0 ?
                        <Button variant='outlined' onClick={handleCreateNewEntity}>Create new</Button>
                        :
                        <>
                            <Button variant='outlined' onClick={handleClose}>Cancel</Button>
                            <Button variant='contained' onClick={handleNewEntityContext}>Save</Button>
                        </>

                    }
                </DialogActions> */}
            </Dialog>

            <Dialog
                open={openNewEntityDialog}
                onClose={handleNewEntityClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                fullWidth
                maxWidth={'sm'}
            >
                <DialogTitle id="alert-dialog-title">
                    New Entity
                </DialogTitle>
                <DialogContent>
                    <TextField
                        label="Entity *"
                        variant="outlined"
                        name={'entity'}
                        fullWidth
                        onChange={event => setNewEntity(event.target.value)}
                    />
                </DialogContent>
                <DialogActions sx={{ mb: 2, mx: 2 }}>

                    <Button variant="outlined" onClick={handleNewEntityClose}>Cancel</Button>
                    <Button variant="contained" onClick={handleNewEntitySubmit} autoFocus>
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>



            {/* <Grid item xs={12} marginTop={3}>
                {customDict2 && <pre>{JSON.stringify(customDict2, null, 1)}</pre>}
                {entity_list && <pre>{JSON.stringify(entity_list, null, 1)}</pre>}
                {utterance_list && <pre>{JSON.stringify(utterance_list, null, 1)}</pre>}
                {customDict && <pre>{JSON.stringify(customDict, null, 1)}</pre>}
            </Grid> */}

        </Grid >
    )
}

// export default function EntityID(){
//     const {EntityID} = useParams();
//     console.log(EntityID)
//     return(
//         <div> hello </div>
//     )
// }


function TargetValue(event: any) {
    return event.target
}


type LoaderType = {
    entity_list: EntityType[],
    utterance_list: EntityContextType[]
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
