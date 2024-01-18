import { Box, Stack } from "@mui/material";
import React from "react";
import SearchIcon from "@mui/icons-material/Search";
import MenuIcon from "@mui/icons-material/Menu";
import { Styles } from "@/stylescomponents/style";
import { useRouter } from "next/router";
const HeaderHome = () => {
  const findLink = "/detail/Find";
  const router = useRouter();
  return (
    <>
      <Box>
        <Stack direction="row" spacing={17}>
          <Stack direction="row">
            <Box component="img" src="/icons/Logo.svg" />
            <Box component="img" src="/icons/SaintStream.svg" />
          </Stack>
          <Stack direction="row" spacing={3}>
            <SearchIcon
              onClick={() => {
                router.push(findLink);
              }}
              sx={Styles._iconheaderhome}
            />
            <MenuIcon sx={Styles._iconheaderhome} />
          </Stack>
        </Stack>
      </Box>
    </>
  );
};

export default HeaderHome;
