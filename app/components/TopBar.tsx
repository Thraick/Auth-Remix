import { Grid, IconButton, Stack, Button } from "@mui/material";
import { Link as RouterLink, NavLink } from "@remix-run/react";

import MenuIcon from '@mui/icons-material/Menu';

export default function TopBar() {
    return (
        <Grid
            container
            direction="row"
            justifyContent="space-between"
            alignItems="center"
        >
            <IconButton color="primary" aria-label="delete" component={RouterLink} to="/">
                <MenuIcon />
            </IconButton>

            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                spacing={1}
            >
                <Button variant="text" color="primary" component={NavLink} to="/pages/faqs">faqs</Button>
                <Button variant="text" color="primary" component={RouterLink} to="/pages/intents">intents</Button>
                <Button variant="text" color="primary" component={RouterLink} to="/pages/states">states</Button>
                <Button variant="text" color="primary" component={RouterLink} to="/pages/entity">entity</Button>
            </Stack>

            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                spacing={1}
            >
                <Button variant="text" color="primary" component={RouterLink} to="/Login">login</Button>
                <Button variant="text" color="primary" component={RouterLink} to="/register">register</Button>
            </Stack>
        </Grid>
    )
}
