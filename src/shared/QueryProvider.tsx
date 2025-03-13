"use client";

// * NPM
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import axios from "axios";

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

export default function QueryProvider({ children }: Props) {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
