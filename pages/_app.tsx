import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { createTheme, ThemeProvider } from "@mui/material";
import axios from "axios";
import { SWRConfig } from "swr";
import { ReactElement, ReactNode } from "react";
import { NextPage } from "next";

const theme = createTheme({
  typography: {
    fontFamily: ["Raleway", "san-serif"].join(","),
  },
});

axios.defaults.baseURL = process.env.NEXT_PUBLIC_TMDB_API_URL;
axios.defaults.headers.common["Authorization"] =
  "Bearer " + process.env.NEXT_PUBLIC_ACCESS_TOKEN;

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);
  return getLayout(
    <ThemeProvider theme={theme}>
      <SWRConfig
        value={{
          fetcher: (resource, init) =>
            axios.get(resource, init).then((res) => res.data),
        }}
      >
        <Component {...pageProps} />
      </SWRConfig>
    </ThemeProvider>
  );
}
