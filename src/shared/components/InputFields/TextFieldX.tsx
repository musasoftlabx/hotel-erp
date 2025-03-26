// * React
import { forwardRef } from "react";

// * MUI
import { styled } from "@mui/material/styles";
import { OutlinedInputProps } from "@mui/material/OutlinedInput";
import Grid from "@mui/material/Grid2";
import InputAdornment from "@mui/material/InputAdornment";
import TextField, { TextFieldProps } from "@mui/material/TextField";

// * NPM
import { useMask } from "@react-input/mask";

// * Types
type TExtendedProps = TextFieldProps & {
  children?: React.ReactNode;
  ref?: any;
  label: string;
  select?: boolean;
  error?: boolean;
  multiline?: boolean;
  mask?: string;
  rows?: number;
  helperText?: string | boolean;
  prefixcon?: React.ReactNode;
  suffixcon?: React.ReactNode;
  slotprops?: any;
  replacement?: { x?: RegExp; $?: RegExp; _?: RegExp };
  type?: string;
  columnspan?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  placeholder?: string;
  circularedge?: number;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

// * Create styled elements
const StyledTextField = styled(
  forwardRef((props: TExtendedProps, ref) => (
    <Grid size={props?.columnspan?.xs || 12} p={1}>
      <TextField
        {...props}
        inputRef={ref}
        variant="filled"
        fullWidth
        size="small"
        placeholder={props.placeholder || props.label}
        slotProps={{
          ...props.slotprops,
          input: {
            ...props.slotprops?.input,
            startAdornment: props.prefixcon && (
              <InputAdornment
                position="start"
                sx={{
                  marginTop: props.multiline
                    ? props.value
                      ? `${props.rows! * -18}px !important`
                      : `${props.rows! * -22}px !important`
                    : props.value
                      ? "12px !important"
                      : typeof props.prefixcon === "string" &&
                          props.value == "0"
                        ? "17px !important"
                        : "0px !important",
                  color: props.error ? "#d3302f" : "",
                }}
              >
                {props.prefixcon as string}
              </InputAdornment>
            ),
            endAdornment: props.suffixcon && (
              <InputAdornment position="end">
                {props.suffixcon as string}
              </InputAdornment>
            ),
          } as Partial<OutlinedInputProps>,
          select: props.select
            ? {
                MenuProps: {
                  sx: {
                    top: props.error ? 3 : 1,
                    ".MuiMenu-paper": {
                      //width: "250px",
                      borderBottomLeftRadius: 15,
                      borderBottomRightRadius: 15,
                      borderTopLeftRadius: 15,
                      borderTopRightRadius: 15,
                      boxShadow: "rgba(0, 0, 0, 0.4) 0px 30px 90px;",
                      //left: "23.2% !important",
                    },
                    ".MuiMenuItem-root": {
                      fontSize: 14,
                      my: 0.4,
                      "&:hover": {
                        ":not(.Mui-selected)": {
                          background:
                            "linear-gradient(60deg, rgb(48 220 10 / 30%) 0%, rgb(159 198 62 / 30%) 100%)",
                          borderRadius: 2,
                          mx: 2,
                          transform: "scale(1.05)",
                          transition:
                            "background 0.5s ease-out, transform 0.3s ease-out",
                        },
                      },
                    },
                    ".Mui-selected": {
                      background: "rgba(71, 101, 130, 0.3)",
                      borderRadius: 2,
                      fontWeight: "bold",
                      mx: 1,
                      pointerEvents: "none",
                      opacity: 0.5,
                    },
                  },
                },
              }
            : {},
        }}
      />
    </Grid>
  ))
)((props) => ({
  "& :-webkit-autofill": { transitionDelay: "9999s" }, // ? Prevents MUI blue autofill background
  "& .MuiFilledInput-root": {
    border: `1px solid ${
      props.theme.palette.mode === "light" ? "#e2e2e2" : "#666666"
    }`,
    overflow: "hidden",
    borderRadius: props.circularedge || 6,
    backgroundColor:
      props.theme.palette.mode === "light"
        ? // "rgba(0, 0, 0, 0.06)" //"rgba(232,240,254,0.95)"
          "rgba(232, 240, 254, 0.95)" //"rgba(232,240,254,0.95)"
        : "rgba(43, 43, 43, 0.95)",
    transition: props.theme.transitions.create([
      "border-color",
      "background-color",
      "box-shadow",
    ]),
    ":before": {
      borderBottom: 0,
    },
    "&:hover": {
      backgroundColor:
        props.theme.palette.mode === "light"
          ? "rgba(255, 255, 235, 0.95)"
          : "rgba(43, 43, 43, 0.4)", //  : "rgba(0, 0, 0, 0.8)", "rgba(43, 43, 43, 0.4)",
    },
    "&.Mui-focused": {
      backgroundColor:
        props.theme.palette.mode === "light"
          ? "rgba(231,234,246,0.9)"
          : "rgba(0,0,0,0.8)",
      borderBottom: `1px solid ${props.theme.palette.primary.main}`,
    },
    "&.Mui-error": {
      backgroundColor:
        props.theme.palette.mode === "light"
          ? "rgba(255,248,248,0.9)"
          : "rgba(43,43,43,0.4)",
      outline: `2px dotted ${props.theme.palette.error.main}`,
      border: "1px solid transparent",
    },
  },
  ".MuiFormLabel-root": {
    fontSize: 14,
    top: 2,
    pointerEvents: "none",
    right: props.prefixcon ? 75 : 35,
    transform: `translate(${
      props.prefixcon ? (typeof props.prefixcon === "string" ? 51 : 45) : 13
    }px, 12px) scale(1.05)`,
    "&.Mui-focused": {
      fontSize: props.select ? 14 : 16,
      opacity: props.select ? 1 : 0,
    },
  },
  ".MuiFormLabel-root.MuiFormLabel-filled": {
    fontSize: 16,
    opacity: 1,
    transform: "translate(14px, 2px) scale(0.7)",
  },
  ".MuiFormHelperText-root": {
    textAlign: "right",
    fontWeight: 500,
    lineHeight: 1.5,
    marginBottom: -12,
    marginRight: -1,
    marginTop: 4,
    opacity: 0.7,
  },
  ".MuiInputBase-adornedStart": {
    ":before": { content: "unset" },
    ":after": { content: "unset" },
  },
  ".MuiSelect-filled": { paddingTop: 18, paddingBottom: 8 },
  "&.MuiFormControl-root": {
    ".MuiInputBase-root:has(input:autofill)": {
      ".MuiInputBase-input": {
        fontSize: "30px !important",
        marginTop: "20px !important",
      },
      ".MuiInputAdornment-positionStart": { marginTop: "13px !important" },
    },
    ".MuiInputBase-root:has(:focus)": {
      ":has(.Mui-error)": {
        ".MuiInputAdornment-positionStart": {
          color: props.theme.palette.error,
        },
        "input::placeholder": { color: props.theme.palette.error },
      },
      ":not(.Mui-error)": {
        ".MuiInputAdornment-positionStart": {
          color: props.theme.palette.primary.main,
        },
        "input::placeholder": { color: props.theme.palette.primary.main },
      },
    },
    input: {
      "&[value='']": { marginTop: -8, paddingBottom: 10 },
      "&:not([value=''])": { marginTop: -5, paddingBottom: 4 },
      "&:not([value])": { marginTop: -2.5 },
      "&:focus": {
        "&:not([value])": { fontSize: 15, marginTop: -8, paddingBottom: 12 },
        "::placeholder": {
          fontSize: 15,
          marginTop: "-18px !important",
          //visibility: "visible",
        },
      },

      // "&:autofill": {
      //   //marginBottom: "-2px !important",
      //   marginTop: "20px !important",
      //   marginBottom: "10px !important",
      //   //background: "transparent !important",
      //   opacity: 0.5,
      //   visibility: "visible",
      // },
      // "::placeholder": {
      //   //marginBottom: "-2px !important",
      //   marginTop: "20px !important",
      //   marginBottom: "10px !important",
      //   //background: "transparent !important",
      //   opacity: 0.5,
      //   visibility: "visible",
      // },
      "&:not(focus)": {
        ":autofill, ::placeholder": {
          //marginBottom: "-2px !important",
          marginTop: "20px !important",
          marginBottom: "10px !important",
          //background: "transparent !important",
          opacity: 0.5,
          visibility: "visible",
        },
      },
      "::placeholder, ::-moz-placeholder": { fontSize: 0 },
    },
    textarea: {
      ":not(focus)::placeholder": { visibility: "hidden" },
      ":focus": {
        "::placeholder": { visibility: "visible" },
        ":empty": { fontSize: 15, marginTop: -8, paddingBottom: 12 },
      },
    },
  },
}));

export const TextFieldX = (props: TExtendedProps) =>
  props.mask ? (
    <StyledTextField
      {...props}
      ref={useMask({ mask: props.mask, replacement: props.replacement })}
    />
  ) : (
    <StyledTextField {...props} />
  );
