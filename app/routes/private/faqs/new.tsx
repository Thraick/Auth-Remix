import { Button, FormHelperText, Grid, IconButton, Stack, TextField, Typography } from "@mui/material"
import { Form, Link as NavLink, useActionData } from "@remix-run/react";

import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import type { ActionFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { HttpRequest } from "~/utils/jac/httpRequest";
import { FaqSchema, getValidationErrors } from "~/utils/jac/yup";

export const action: ActionFunction = async ({request}) => {
    let formData = Object.fromEntries(await request.formData());
    try {
        await FaqSchema.validate(formData, { abortEarly: false })
        await HttpRequest("create_faq", formData)
        return redirect('/private/faqs');
    } catch (err) {
        const error = getValidationErrors(err)
        return {error};
    }
};


export default function NewFaq() {
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
                    New Faq
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
                                    Enter your question
                                </Typography>
                                <TextField
                                    label="Question *"
                                    variant="outlined"
                                    name={'question'}
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
                                    Enter your answer
                                </Typography>
                                <TextField
                                    label="Answer *"
                                    variant="outlined"
                                    name={'answer'}
                                    fullWidth
                                    multiline
                                    rows={4}
                                />
                                {actionData?.error['answer'] && <FormHelperText id="component-error-text">{actionData?.error['answer']}</FormHelperText>}
                            </Stack>
                        </Grid>



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