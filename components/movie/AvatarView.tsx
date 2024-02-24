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
  DialogContent,
  DialogContentText,
  DialogActions,
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
import LogoutIcon from "@mui/icons-material/Logout";

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
          <LogoutIcon></LogoutIcon>
          Log out
        </MenuItem>
      </Menu>
      <Dialog
        open={openDialog}
        onClose={handleDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle
          id="alert-dialog-title"
          sx={{
            backgroundColor: "#424242",
            color: "white",
            fontWeight: "bold",
          }}
        >
          {"Are you want to logout?"}
        </DialogTitle>
        <DialogContent
          sx={{
            backgroundColor: "#424242",
          }}
        >
          <DialogContentText
            id="alert-dialog-description"
            sx={{ color: "#e0e0e0" }}
          >
            Your account will not be save
          </DialogContentText>
        </DialogContent>
        <DialogActions
          sx={{
            backgroundColor: "#424242",
          }}
        >
          <Button
            sx={{ color: "lightskyblue" }}
            onClick={() => handleDialogClose("NO")}
          >
            Disagree
          </Button>
          <Button
            sx={{ color: "lightskyblue" }}
            onClick={() => handleDialogClose("YES")}
            autoFocus
          >
            Agree
          </Button>
        </DialogActions>
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
              `https://www.themoviedb.org/authenticate/${res.data.request_token}?redirect_to=https://65da137eb91d7c11d1a1dbfd--quiet-raindrop-d1ef73.netlify.app/detail/authorize`,
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
