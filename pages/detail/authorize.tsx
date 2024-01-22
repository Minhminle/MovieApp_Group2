import { CreateSessionInput, SessionResponse } from "@/models/Auth";
import { Typography } from "@mui/material";
import axios from "axios";
import { setCookie } from "cookies-next";
import { redirect, useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import React from "react";
import useSWR from "swr";

const Authorize = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestToken = searchParams.get("request_token");

  const createSession = ({ url, token }: CreateSessionInput) =>
    axios
      .post<SessionResponse>(url, {
        request_token: token,
      })
      .then((res) => {
        setCookie("session_id", res.data.session_id);
        return res.data;
      });

  const { data, isLoading } = useSWR(
    requestToken
      ? { url: "authentication/session/new", token: requestToken }
      : null,
    createSession
  );

  if (isLoading)
    return <Typography textAlign="center">Authorizing ... </Typography>;

  if (data) {
    router.push("/");
  }

  return (
    <>
      {data ? (
        <></>
      ) : (
        <Typography textAlign="center">Sorry could not log in </Typography>
      )}
    </>
  );
};

export default Authorize;
