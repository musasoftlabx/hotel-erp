"use client";

// * React
import { useEffect, useMemo } from "react";

// * NPM
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  createTheme,
  CssBaseline,
  ThemeProvider,
  useMediaQuery,
} from "@mui/material";
import { useColorScheme } from "@mui/material/styles";

import axios from "axios";

// * Store
import { useThemeStore } from "@/store/useThemeStore";

type Props = Readonly<{
  children: React.ReactNode;
}>;

// * Axios config
axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_ADMIN;
axios.defaults.timeout = 60000;
axios.defaults.headers.post["Content-Type"] = "application/json";
axios.defaults.headers.post["Accept"] = "application/json";
axios.interceptors.request.use(
  (req: any) => {
    //req.headers.Authorization = `Bearer ${getCookie("__dp_admin_aT")}`;
    return req;
  },
  (err) => Promise.reject(err)
);

const queryClient = new QueryClient();

export default function QueryProvider({ children }: Props) {
  const setTheme = useThemeStore((state) => state.changeMode);
  const themeState = useThemeStore((state) => state.theme);
  const theme = createTheme(themeState);
  //const theme = useMemo(() => createTheme(themeState), [themeState]);

  const { setMode, systemMode } = useColorScheme();

  useEffect(() => {
    const __theme = localStorage.getItem("__theme");

    if (__theme === "light" || __theme === "dark") setMode(__theme);
    else localStorage.setItem("__theme", (systemMode as string) ?? "light");
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </ThemeProvider>
  );
}
