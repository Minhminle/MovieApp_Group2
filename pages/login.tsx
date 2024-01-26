import { Box, Button, FormGroup, Stack, TextField } from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import { setCookie } from "cookies-next";
import { useRouter } from "next/router";
interface User {
  username: string;
  password: string;
}
const LoginPage = () => {
  const router = useRouter();
  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const validateForm = () => {};
  const onChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      password: e.currentTarget.value,
    });
  };

  const onChangeUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      username: e.currentTarget.value,
    });
  };

  const onLogin = () => {
    axios
      .post("https://dummyjson.com/auth/login", {
        username: form.username,
        password: form.password,
      })
      .then((res) => {
        setCookie("isLogin", true);
        router.push("/movie/home");
      });
  };

  return (
    <Box m={4}>
      <FormGroup>
        <Stack gap={4}>
          {/* <FormControlLabel
            control={<Checkbox defaultChecked />}
            label="Label"
          /> */}
          <TextField
            label="username"
            variant="outlined"
            error={!form.username}
            helperText={!form.username ? "Username is invalid" : ""}
            onChange={onChangeUsername}
          />
          <TextField
            label="password"
            variant="outlined"
            type="password"
            error={!form.password.length}
            helperText={!form.password.length ? "Password is invalid" : ""}
            onChange={onChangePassword}
          />
          <Button
            disabled={!form.username || !form.password}
            variant="contained"
            onClick={onLogin}
          >
            Login
          </Button>
        </Stack>
      </FormGroup>
    </Box>
  );
};

export default LoginPage;
