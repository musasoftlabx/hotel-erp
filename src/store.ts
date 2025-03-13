// * NPM
import { getCookie } from "cookies-next";
import { create } from "zustand";
import axios from "axios";

// * Utils
import hexToRGB from "./utils/hexToRGB";

//import { devtools, persist } from "zustand/middleware";

export const defaultPrimaryColor = "#45a65b";
const defaultFont = "Futura";

interface useAlertStore {
  isOpen: boolean;
  status: "success" | "info" | "warning" | "error";
  subject: string;
  body: string;
  alert: ({
    status,
    operation,
    subject,
    body,
  }: {
    status: "success" | "info" | "warning" | "error";
    operation?: string;
    subject: string;
    body: string;
  }) => void;
}
interface useConfirmStore extends useAlertStore {
  cancel?: string;
  ok?: string;
  operation: string;
  close: () => void;
}
interface useBalanceStore {
  balance: number;
  invoice: number;
  loading: boolean;
  setter: (balance: number, invoice: number) => void;
  getter: () => void;
}
interface useSnackBarStore {
  open?: boolean;
  isLoading?: boolean;
  duration?: number | null;
  status?: "success" | "info" | "warning" | "error";
  subject?: string;
  message?: string;
  onClose: () => void;
  setSnackBar: ({
    open,
    status,
    subject,
    message,
    isLoading,
    duration,
    onClose,
  }: {
    open?: boolean;
    isLoading?: boolean;
    duration?: number;
    status?: "success" | "info" | "warning" | "error";
    subject?: string;
    message?: string;
    onClose?: () => void;
  }) => void;
}
interface useMinistoreStore {
  ministore?: boolean;
  setter: (ministore: boolean) => void;
  getter: () => void;
}
interface useCartStore {
  cartCount: number;
  setter: (cartCount: number) => void;
  getter: () => void;
}
interface useDrawerStore {
  drawerItems: [];
  setter: (drawerItems: any) => void;
  getter: () => void;
}
interface useUserStore {
  isOpen: boolean;
  toggle: () => void;
}
interface useModalStore {
  isOpen: boolean;
  toggle: () => void;
}
interface useProgressStore {
  isOpen: boolean;
  toggle: () => void;
}
interface useThemeStore {
  theme: any;
  changeMode: (mode: string) => void;
  getter: () => void;
  changeColor: (color: string) => void;
  getFont: () => void;
  changeFont: (font: string) => void;
}

export const useAlertStore = create<useAlertStore>((set) => ({
  isOpen: false,
  status: "warning",
  subject: "",
  body: "",
  alert: ({ status, subject, body }) =>
    set((state) => ({
      ...state,
      isOpen: !state.isOpen,
      status: !status ? state.status : status,
      subject,
      body,
    })),
}));

export const useConfirmStore = create<useConfirmStore>((set) => ({
  isOpen: false,
  status: "warning",
  operation: "",
  subject: "",
  body: "",
  alert: ({ status, operation, subject, body }) =>
    set((state) => ({
      ...state,
      isOpen: !state.isOpen,
      status: !status ? state.status : status,
      operation,
      subject,
      body,
    })),
  close: () => set((state) => ({ ...state, isOpen: false })),
}));

export const useSnackBarStore = create<useSnackBarStore>((set) => ({
  open: false,
  isLoading: false,
  duration: null,
  status: "success",
  subject: "",
  message: "",
  onClose: () => {},
  setSnackBar: ({
    open,
    status,
    subject,
    message,
    isLoading,
    duration,
    onClose,
  }) =>
    set((state) => ({
      ...state,
      open: open === undefined || open === true ? true : false,
      isLoading,
      duration,
      status: !status ? state.status : status,
      subject,
      message,
      onClose: onClose ? onClose : () => state.onClose,
    })),
}));

export const useMinistoreStore = create<useMinistoreStore>((set) => ({
  ministore: false,
  setter: (ministore) => {
    set({ ministore });
    localStorage.setItem("ministore", ministore.toString());
  },
  getter: () => {
    const _mT = localStorage.getItem("_mT");
    const __mT: any = getCookie("__mT");

    if (__mT) {
      axios
        .get(`ministore`)
        .then(({ data }) => {
          if (data?.available) {
            set({ ministore: true });
          }
        })
        .catch(() => set({ ministore: false }));
    } else set({ ministore: false });
  },
}));

export const useBalanceStore = create<useBalanceStore>((set) => ({
  balance: 0,
  invoice: 0,
  loading: false,
  setter: (balance, invoice) => {
    set({ balance, invoice });
    localStorage.setItem("balance", balance.toString());
    localStorage.setItem("invoice", invoice.toString());
  },
  getter: () => {
    const balance = Number(localStorage.getItem("balance"));
    const invoice = Number(localStorage.getItem("invoice"));

    if (balance && invoice) set({ balance, invoice });
    else {
      set({ loading: true });
      axios.get(`balances`).then(({ data: { balance, invoice } }) => {
        if (balance) {
          set({ balance, invoice, loading: false });
          localStorage.setItem("balance", balance);
          localStorage.setItem("invoice", invoice);
        }
      });
    }
  },
}));

export const useCartStore = create<useCartStore>((set) => ({
  cartCount: 0,
  setter: (cartCount) => {
    set({ cartCount });
    localStorage.setItem("cartCount", cartCount.toString());
  },
  getter: () => {
    const cartCount = Number(localStorage.getItem("cartCount"));

    if (cartCount) set({ cartCount });
    else
      axios.get(`cart/count`).then(({ data }) => {
        if (data) {
          set({ cartCount: data });
          localStorage.setItem("cartCount", data);
        }
      });
  },
}));

export const useDrawerStore = create<useDrawerStore>((set) => ({
  drawerItems: [],
  setter: (drawerItems) => {
    set({ drawerItems });
    localStorage.setItem("drawerItems", JSON.stringify(drawerItems));
  },
  getter: () => {
    const drawerItems = JSON.parse(
      localStorage.getItem("drawerItems") as string
    );

    if (drawerItems) set({ drawerItems });
    else
      axios.get(`navigationDrawer`).then(({ data }) => {
        set({ drawerItems: data });
        localStorage.setItem("drawerItems", JSON.stringify(data));
      });
  },
}));

export const useUserStore = create<useUserStore>((set) => ({
  isOpen: false,
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
}));

export const useModalStore = create<useModalStore>((set) => ({
  isOpen: false,
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
}));

export const useProgressStore = create<useProgressStore>((set) => ({
  isOpen: false,
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
}));

export const useThemeStore = create<useThemeStore>((set) => ({
  theme: {
    palette: {
      mode: "light", // light dark
      primary: { main: defaultPrimaryColor }, //"#46bd61"
      secondary: { main: "#edf2ff" },
      white: { main: "#fff", light: "#fff", dark: "#ef6c00" }, //contrastText: "rgba(0, 0, 0, 0.87)",
      black: { main: "#000", light: "#000", dark: "#fff" },
    },
    typography: { fontFamily: defaultFont },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          ["@font-face"]: {
            fontFamily: "Futura",
            src: "url(/fonts/futura.ttf)",
          },
          body: {
            ":autofill": {
              "::placeholder": { visibility: "hidden", fontSize: 0 },
            },
            ":-webkit-autofill": {
              "::placeholder": { visibility: "hidden", fontSize: 0 },
            },
            //scrollbarColor: "#6b6b6b #2b2b2b",
            // TODO: To remove ::-webkit-scrollbar after sometime since CSS now supports scrollbar styling
            "&::-webkit-scrollbar, & *::-webkit-scrollbar": {
              //backgroundColor: "#e7e7e7",
              borderRadius: 50,
              cursor: "grap",
              width: 8,
              height: 6,
            },
            "&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb": {
              borderRadius: 8,
              backgroundColor: "#bdd8bc",
              // border: "1px solid #50cc7f",
              cursor: "grap",
              minHeight: 24,
            },
            "&::-webkit-scrollbar-thumb:focus, & *::-webkit-scrollbar-thumb:focus":
              {
                backgroundColor: "#959595",
                cursor: "grap",
              },
            "&::-webkit-scrollbar-thumb:active, & *::-webkit-scrollbar-thumb:active":
              {
                backgroundColor: "#959595",
                cursor: "grap",
              },
            "&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover":
              {
                backgroundColor: "#50cc7f",
                cursor: "grap",
              },
            "&::-webkit-scrollbar-corner, & *::-webkit-scrollbar-corner": {
              backgroundColor: "#2b2b2b",
              cursor: "grap",
            },
            // ? Filepond styling
            // ".filepond--root": {
            //   background: "rgba(247, 255, 237, 0.05) !important",
            //   borderRadius: "10px",
            //   margin: "0px 10px",
            // },
            ".filepond--wrapper": { minHeight: "110px" },
            ".filepond--credits": { display: "none" },
            ".filepond--drop-label": {
              background: "rgba(234, 254, 238, 0.5) !important",
              border: "1px solid rgba(89, 195, 0, .3)",
              borderRadius: "20px",
              cursor: "pointer !important",
              margin: "10px 10px",
              paddingTop: "50px",
              paddingBottom: "60px",
            },
            ".filepond--drop-label:hover": {
              background: "rgba(255, 255, 230, 1) !important",
            },
            ".filepond--drop-label label": {
              padding: "0 !important",
              whiteSpace: "nowrap",
            },
            ".filepond--panel-center, .filepond--panel-top, .filepond--panel-bottom":
              {
                border: "none !important",
                background: "transparent !important",
              },
            ".filepond--root label, .filepond--file-action-button": {
              cursor: "pointer !important",
            },
            ".filepond--item-panel": {
              backgroundColor: "#43a047 !important",
            },
          },
        },
      },
    },
  },
  changeMode: (mode) =>
    set((state) => ({
      ...state,
      theme: {
        ...state.theme,
        palette: {
          ...state.theme.palette,
          mode,
        },
        components: {
          ...state.theme.components,
          MuiCssBaseline: {
            ...state.theme.components.MuiCssBaseline,
            styleOverrides: {
              ...state.theme.components.MuiCssBaseline.styleOverrides,
              body: {
                ...state.theme.components.MuiCssBaseline.styleOverrides.body,
                ".filepond--drop-label": {
                  ...state.theme.components.MuiCssBaseline.styleOverrides.body[
                    ".filepond--drop-label"
                  ],
                  background:
                    mode === "light"
                      ? "rgba(234, 254, 238, 0.5) !important"
                      : "rgba(66, 66, 66, 0.5) !important",
                  border:
                    mode === "light"
                      ? "1px solid rgba(89, 195, 0, .3)"
                      : "1px solid rgba(89, 195, 0, .2)",
                },
                ".filepond--drop-label:hover": {
                  background:
                    mode === "light"
                      ? "rgba(255, 255, 230, .5) !important"
                      : "rgba(74, 64, 32, .5) !important",
                },
              },
            },
          },
        },
      },
    })),
  getter: () => {
    const color = localStorage.getItem("__color");

    if (color && color.length === 7)
      set((state) => ({
        ...state,
        theme: {
          ...state.theme,
          palette: {
            ...state.theme.palette,
            primary: {
              ...state.theme.palette.primary,
              main: color,
            },
          },
          components: {
            ...state.theme.components,
            MuiCssBaseline: {
              ...state.theme.components.MuiCssBaseline,
              styleOverrides: {
                ...state.theme.components.MuiCssBaseline.styleOverrides,
                body: {
                  ...state.theme.components.MuiCssBaseline.styleOverrides.body,
                  ["&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb"]:
                    {
                      ...state.theme.components.MuiCssBaseline.styleOverrides
                        .body[
                        "&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb"
                      ],
                      backgroundColor: color,
                    },
                  ["&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover"]:
                    {
                      ...state.theme.components.MuiCssBaseline.styleOverrides
                        .body[
                        "&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover"
                      ],
                      backgroundColor: `rgba(${hexToRGB(color).join()}, .5)`,
                    },
                },
              },
            },
          },
        },
      }));
    else
      axios.get(`profile/getColor`).then(({ data }) => {
        const color = !data.color ? defaultPrimaryColor : data.color;

        set((state) => ({
          ...state,
          theme: {
            ...state.theme,
            palette: {
              ...state.theme.palette,
              primary: {
                ...state.theme.palette.primary,
                main: color,
              },
            },
            components: {
              ...state.theme.components,
              MuiCssBaseline: {
                ...state.theme.components.MuiCssBaseline,
                styleOverrides: {
                  ...state.theme.components.MuiCssBaseline.styleOverrides,
                  body: {
                    ...state.theme.components.MuiCssBaseline.styleOverrides
                      .body,
                    ["&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb"]:
                      {
                        ...state.theme.components.MuiCssBaseline.styleOverrides
                          .body[
                          "&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb"
                        ],
                        backgroundColor: color,
                      },
                    ["&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover"]:
                      {
                        ...state.theme.components.MuiCssBaseline.styleOverrides
                          .body[
                          "&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover"
                        ],
                        backgroundColor: `rgba(${hexToRGB(color).join()}, .5)`,
                      },
                  },
                },
              },
            },
          },
        }));
        localStorage.setItem("__color", color);
      });
  },
  changeColor: (color) => {
    set((state) => ({
      ...state,
      theme: {
        ...state.theme,
        palette: {
          ...state.theme.palette,
          primary: {
            ...state.theme.palette.primary,
            main: color,
          },
        },
        components: {
          ...state.theme.components,
          MuiCssBaseline: {
            ...state.theme.components.MuiCssBaseline,
            styleOverrides: {
              ...state.theme.components.MuiCssBaseline.styleOverrides,
              body: {
                ...state.theme.components.MuiCssBaseline.styleOverrides.body,
                ["&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb"]: {
                  ...state.theme.components.MuiCssBaseline.styleOverrides.body[
                    "&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb"
                  ],
                  backgroundColor: color,
                },
              },
            },
          },
          // "&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb": {
          //   borderRadius: 8,
          //   backgroundColor: "#bdd8bc",
          //   // border: "1px solid #50cc7f",
          //   cursor: "grap",
          //   minHeight: 24,
          // },
        },
      },
    }));

    axios
      .post(`profile/changeColor`, { color })
      .then(({ data }) => localStorage.setItem("__color", color));
  },
  getFont: () => {
    const font = localStorage.getItem("__font");

    if (font)
      set((state) => ({
        ...state,
        theme: {
          ...state.theme,
          typography: {
            ...state.theme.palette.typography,
            fontFamily: font,
          },
        },
      }));
    else
      axios.get(`profile/getFont`).then(({ data }) => {
        const font = !data.font ? defaultFont : data.font;

        set((state) => ({
          ...state,
          theme: {
            ...state.theme,
            typography: {
              ...state.theme.palette.typography,
              fontFamily: font,
            },
          },
        }));
        localStorage.setItem("__font", font);
      });
  },
  changeFont: (font) => {
    set((state) => ({
      ...state,
      theme: {
        ...state.theme,
        typography: {
          ...state.theme.palette.typography,
          fontFamily: font,
        },
      },
    }));

    axios
      .post(`profile/changeFont`, { font })
      .then(({ data }) => localStorage.setItem("__font", font));
  },

  //set((state) => ({ ...state, theme: (state.theme.palette.mode = mode) })),
}));
