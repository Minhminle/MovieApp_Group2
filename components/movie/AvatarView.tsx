import React from "react";
import { Person } from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  Menu,
  MenuItem,
  Stack,
  Typography,
  DialogTitle,
  ListItem,
  List,
  ListItemButton,
  ListItemText,
  Avatar,
} from "@mui/material";
import { RequestTokenResponse, User } from "@/models/Auth";
import axios from "axios";
import useSWR from "swr";
import { getCookie, setCookie, deleteCookie } from "cookies-next";
import { useRouter } from "next/router";
import Id from "@/pages/detail/userdetail/[id]";

function LoggedInAvatar(props: { data: User }) {
  const avatar_path = props.data.avatar.tmdb.avatar_path;
  const username = props.data.username;
  const id = props.data.id;

  const router = useRouter();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);
  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleUserDetail = (accoutId: number) => {
    router.push(`/detail/userdetail/${accoutId}`);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleWatchList = () => {
    router.push(`/detail/UserAddList/`);
  };
  const [openDialog, setOpenDialog] = React.useState(false);

  const handleDialogClose = (value: string) => {
    setOpenDialog(false);
    if (value == "YES") {
      deleteCookie("session_id");
      deleteCookie("user_id");
      router.reload();
    }
  };

  return (
    <>
      <Button onClick={handleMenuClick} variant="text" sx={{ color: "white" }}>
        <Stack direction="row">
          {avatar_path ? (
            <Avatar src={`https://image.tmdb.org/t/p/w500${avatar_path}`} />
          ) : (
            <Person />
          )}
        </Stack>
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={openMenu}
        onClose={handleMenuClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem onClick={() => handleUserDetail(id)}>
          <Stack direction="column">
            <Box style={{ fontWeight: "bold" }}>{username}</Box>

            <Box color="gray">Profile View</Box>
          </Stack>
        </MenuItem>
        <hr></hr>

        <MenuItem
          onClick={() => {
            handleMenuClose();
            setOpenDialog(true);
          }}
        >
          Log out
        </MenuItem>
      </Menu>
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Are you want to log out?</DialogTitle>
        <List
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ListItem disableGutters>
            <ListItemButton autoFocus onClick={() => handleDialogClose("YES")}>
              <ListItemText primary="YES" />
            </ListItemButton>
          </ListItem>
          <ListItem disableGutters>
            <ListItemButton autoFocus onClick={() => handleDialogClose("NO")}>
              <ListItemText primary="NO" />
            </ListItemButton>
          </ListItem>
        </List>
      </Dialog>
    </>
  );
}

function NotLoggedInAvatar() {
  return (
    <Person
      onClick={() => {
        axios
          .get<RequestTokenResponse>("authentication/token/new")
          .then((res) =>
            window.open(
              `https://www.themoviedb.org/authenticate/${res.data.request_token}?redirect_to=https://wealthy-cardinal-thankfully.ngrok-free.app/detail/authorize`,
              "_blank",
              "noopener,noreferrer"
            )
          );
      }}
    />
  );
}

const AvatarView = () => {
  const session_id = getCookie("session_id");

  const fetcher = (url: string) => axios.get(url).then((res) => res.data);

  const { data } = useSWR<User>(
    session_id ? `/account?session_id=${session_id}` : null,
    fetcher
  );

  return <>{data ? <LoggedInAvatar data={data} /> : <NotLoggedInAvatar />}</>;
};

export default AvatarView;
