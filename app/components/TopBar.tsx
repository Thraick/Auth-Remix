import { Grid, IconButton, Stack, Button, Menu, MenuItem } from "@mui/material";
import { Link as RouterLink, NavLink, useLoaderData, useSubmit } from "@remix-run/react";

import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

import React from "react";
import type { LoaderArgs } from "@remix-run/node";
import { getUserData, supabaseStrategy } from "~/utils/supabase/auth.server";


export const loader = async ({ request }: LoaderArgs) => {
    const session = await supabaseStrategy.checkSession(request, {
      failureRedirect: "/",
    });
  
    return await getUserData(session.user?.id)
  };

export default function TopBar(props: any) {

    const submit = useSubmit();

    // Profile
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        setAnchorEl(null);
        submit(null, { action: '/private', method: "post" })
    };

    return (
        <Grid
            container
            direction="row"
            justifyContent="space-between"
            alignItems="center"
        >
            {/* {data ? <div>hello</div>: <div>no</div>} */}
            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                spacing={1}
            >
                <IconButton color="primary" aria-label="delete" component={RouterLink} to="/">
                    <MenuIcon />
                </IconButton>
            </Stack>

            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                spacing={1}
            >
                <Button variant="text" color="primary" component={NavLink} to="/private/faqs">faqs</Button>
                <Button variant="text" color="primary" component={RouterLink} to="/private/intents">intents</Button>
                <Button variant="text" color="primary" component={RouterLink} to="/private/states">states</Button>
                <Button variant="text" color="primary" component={RouterLink} to="/private/entity">entity</Button>
            </Stack>



            {props.data ?

                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    spacing={1}
                >

                    <IconButton
                        color="primary"
                        aria-label="profile-menu"
                        aria-controls={open ? 'basic-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                        onClick={handleClick}
                    >
                        <AccountCircleIcon />
                    </IconButton>
                    <Menu
                        id="basic-menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        MenuListProps={{
                            'aria-labelledby': 'basic-button',
                        }}
                    >
                        <MenuItem onClick={handleClose}>Profile</MenuItem>
                        <MenuItem onClick={handleClose}>My account</MenuItem>
                        <MenuItem onClick={handleLogout}>Logout</MenuItem>
                    </Menu>
                </Stack>
                :
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    spacing={1}
                >
                    <Button variant="text" color="primary" component={RouterLink} to="/auth/Login">login</Button>
                    <Button variant="text" color="primary" component={RouterLink} to="/auth/register">register</Button>
                </Stack>
            }
        </Grid>
    )
}
