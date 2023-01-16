import { Button, FormHelperText, Grid, IconButton, Stack, TextField, Typography } from "@mui/material"
import { Form, Link as NavLink, useActionData, useLoaderData } from "@remix-run/react";

import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { HttpRequest } from "~/utils/jac/httpRequest";
import { FaqSchema, getValidationErrors } from "~/utils/jac/yup";

export const action: ActionFunction = async ({request}) => {
    let formData = Object.fromEntries(await request.formData());
    // let form = await request.formData()
    try {
        await FaqSchema.validate(formData, { abortEarly: false })
        await HttpRequest("update_faq", formData)
        return redirect('/private/faqs');
    } catch (err) {
        const error = getValidationErrors(err)
        return { error };
    }
};

export const loader: LoaderFunction = async ({params}) => {
    let id = { jid: params.FaqID }

    try {
        const response = await HttpRequest("get_faq", id)
        return json({ data: response.payload });
    } catch (error) {
        console.log(error)
        return json(error);
    }
};


export default function FaqID() {
    const { data } = useLoaderData<LoaderType>()
    const actionData = useActionData();

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
                    Update Faq
                </Typography>
            </Grid>

            <Grid item justifyContent='right' >
                <IconButton color="primary" component={NavLink} to="/private/faqs">
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
                        spacing={3}
                    >
                        <Grid item xs={12}>
                            <Stack
                                direction="column"
                                justifyContent="center"
                                alignItems="flex-start"
                                spacing={2}
                            >
                                <Typography variant={'subtitle2'} >
                                    Question
                                </Typography>
                                <TextField
                                    label="Question *"
                                    variant="outlined"
                                    name={'question'}
                                    defaultValue={data[0].question}
                                    fullWidth
                                />
                                {actionData?.error['question'] && <FormHelperText id="component-error-text">{actionData?.error['question']}</FormHelperText>}

                            </Stack>
                        </Grid>

                        <Grid item xs={12}>
                            <Stack
                                direction="column"
                                justifyContent="center"
                                alignItems="flex-start"
                                spacing={2}
                            >
                                <Typography variant={'subtitle2'}>
                                    Answer
                                </Typography>
                                <TextField
                                    label="Answer *"
                                    variant="outlined"
                                    name={'answer'}
                                    defaultValue={data[0].answer}

                                    fullWidth
                                    multiline
                                    rows={4}
                                />
                                {actionData?.error['answer'] && <FormHelperText id="component-error-text">{actionData?.error['answer']}</FormHelperText>}

                            </Stack>
                        </Grid>

                        <input
                            name='jid'
                            value={data[0].jid}
                            type="hidden"
                        />

                        <Grid item xs={12}>
                            <Stack
                                direction="column"
                                justifyContent="center"
                                alignItems="flex-end"
                                spacing={2}
                            >
                                <Button size={'large'} variant={'contained'} type="submit">
                                    Save
                                </Button>
                            </Stack>

                        </Grid>

                    </Grid>
                </Form>
            </Grid>
        </Grid>

    )
}


type LoaderType = {
    data: FaqType[]
}

// async function httpPost(name: string, form: any) {
//     // let form = request.formData()
//     console.log(name + ' action httpPost')
//     let val = form.get(name)
//     let report = await HttpRequest(name, val)
//     console.log("report")
//     console.log(report)
//     return report
// }