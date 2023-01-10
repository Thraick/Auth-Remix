import TextField from '@mui/material/TextField'
import { useState } from 'react';
import Button from '@mui/material/Button';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Chip, FormControl, InputLabel, MenuItem, OutlinedInput, Select } from '@mui/material';
import { json, LoaderFunction } from '@remix-run/node';
import { HttpRequest } from '~/utils/jac/httpRequest';
import { useLoaderData } from '@remix-run/react';


export const loader: LoaderFunction = async ({ params }) => {
    let id = { id: params.StateID }

    try {
        const list_entity = await HttpRequest("list_entity", {})
        // const intentList = await HttpRequest("list_state", {})
        // const extList = await HttpRequest("list_entity_data_type", {})

        return json({ list_entity: list_entity.report[0] });
    } catch (error) {
        console.log(error)
        return json(error);
    }
};



export default function Index() {
    const { list_entity } = useLoaderData<LoaderType>()

    const [inputText, setInputText] = useState("");
    const [selectedText, setSelectedText] = useState("");
    const [openDialog, setOpenDialog] = useState(false);

    const currentSelection = (e: any) => {
        const value = e.target.value.substring(e.target.selectionStart, e.target.selectionEnd)
        setInputText(e.target.value)
        if (value != "") {
            console.log(
                "current selection",
                e.target.value.substring(e.target.selectionStart, e.target.selectionEnd)
            );
            setSelectedText(value)
            handleClickOpen()
        }
    }

    const getSelectionHandler = () => {
        const selection = window.getSelection();
        console.log("Got selection", selection?.toString());
    };

    const handleClickOpen = () => {
        setOpenDialog(true);
    };

    const handleClose = () => {
        setOpenDialog(false);
    };

    const handleSelectIntent = (event: any) => {
        let formObject = TargetValue(event)
        let formData = new FormData();
        console.log(formObject)
        // formData.append('selectIntent', formObject.value)
        // submit(formData, { action: `/private/states/${StateID}`, method: 'post' })
    }

    return (
        <>
            {/* <textarea onSelect={currentSelection} /> */}
            <p></p>
            <TextField
                id="utterance"
                label="utterance"
                placeholder="Enter your sentence here"
                onClick={currentSelection}
                multiline
                fullWidth
                rows={4}
            />

            <div>
                <button type="button" onClick={getSelectionHandler}>
                    Get Selection
                </button>
            </div>
            <Dialog open={openDialog} onClose={handleClose}
                fullWidth
                maxWidth={'sm'}>
                <DialogTitle>Subscribe</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Select the entity for 
                        <Chip label={selectedText}  />

                    </DialogContentText>
                </DialogContent>

                <DialogContent>
                    <DialogContentText>
                        <FormControl fullWidth>
                            <InputLabel id="demo-multiple-name-label">Name</InputLabel>
                            <Select
                                onChange={handleSelectIntent}
                                name="select"
                                fullWidth
                                // sx={{ fontSize: '2rem', fontWeight: 'bold', boxShadow: 'none', '.MuiOutlinedInput-notchedOutline': { border: 0 } }}
                                input={<OutlinedInput label="Name" />}

                            >
                                {
                                    list_entity.map((item: any) => (
                                        <MenuItem key={item.jid} value={item.jid}> {item.entity_type}</MenuItem>
                                    ))
                                }
                            </Select>
                        </FormControl>
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{mb: 2, mx: 2}}>
                    <Button variant='outlined' onClick={handleClose}>Cancel</Button>
                    <Button variant='contained' onClick={handleClose}>Save</Button>
                </DialogActions>
            </Dialog>

        </>
    )
}


function TargetValue(event: any) {
    return event.target
}


type LoaderType = {
    list_entity: EntityType[]
}
