"use client";

import { useEffect, useState } from "react";

import axios from "axios";

import { SwitchX } from "@/shared/components/InputFields/SwitchX";
import { TextFieldX } from "@/shared/components/InputFields/TextFieldX";
import { ButtonX } from "@/shared/components/InputFields/ButtonX";

import {
  Box,
  Button,
  FormControlLabel,
  IconButton,
  Stack,
  ThemeOptions,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";

import { MdAccountCircle, MdVisibility, MdVisibilityOff } from "react-icons/md";
import { AiFillLock } from "react-icons/ai";

import { DevTool } from "@hookform/devtools";
import { yupResolver } from "@hookform/resolvers/yup";

import { InferType, object } from "yup";
import { useMutation } from "@tanstack/react-query";

import { yupUsername, yupPassword } from "@/utils/yupReusables";
import { _login } from "./server/login";

export default function Login({ theme }: { theme: ThemeOptions }) {
  const schema = object({ username: yupUsername, password: yupPassword });

  const {
    register,
    control,
    handleSubmit,
    setFocus,
    formState: { errors, isValid, isSubmitting, dirtyFields: dirty },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  type Login = InferType<typeof schema>;

  // ? States
  const [showPassword, setShowPassword] = useState(true);

  // ? Effects
  useEffect(() => setFocus("username"), [setFocus]);

  // ? Mutations
  const { mutate: login } = useMutation({
    mutationFn: (body: Login) => axios.post("login", body),
  });

  // {
  //   isDirty: 'all',
  //   dirtyFields: 'all',
  //   validatingFields: 'all',
  //   touchedFields: 'all',
  //   isValidating: 'all',
  //   isValid: 'all',
  //   errors: 'all',
  //   defaultValues: 'all',
  //   isLoading: 'all',
  //   isSubmitted: 'all',
  //   isSubmitting: 'all',
  //   isSubmitSuccessful: 'all',
  //   submitCount: 'all',
  //   disabled: 'all'
  // }

  return (
    <Box
      sx={(theme) => ({
        background:
          theme.palette.mode === "dark"
            ? "linear-gradient(to left, rgba(216, 247, 195, .9) 0%, rgba(222, 236, 221, .9) 100%);"
            : "linear-gradient(293deg, rgba(41, 179, 74, .9) 0%, rgba(0, 0, 0, .9) 70%);",
      })}
    >
      <img
        src="/images/backdrops/backdrop-0.jpg"
        alt="background"
        style={{
          height: "100vh",
          filter:
            theme?.palette?.mode === "light"
              ? "invert(0) "
              : "invert(1) hue-rotate(260deg)",
          objectFit: "cover",
          position: "fixed",
          width: "100vw",
          zIndex: -1,
        }}
      />

      <FormControlLabel
        checked={theme?.palette?.mode === "dark" ? true : false}
        onChange={(e: any) => {
          const val = e.target.checked ? "dark" : "light";
          //setTheme(val);
          localStorage.setItem("theme", val);
        }}
        control={<SwitchX theme={theme} />}
        label=""
        sx={{ position: "fixed", top: 20, right: 10 }}
      />

      <Grid container minHeight="100vh">
        <Grid
          size={12}
          direction="column"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.3,
              ease: [0, 0.71, 0.2, 1.01],
              scale: {
                type: "spring",
                damping: 5,
                stiffness: 100,
                restDelta: 0.001,
              },
            }}
          >
            <Stack
              alignItems="center"
              borderRadius={10}
              py={4}
              px={3}
              sx={{
                background: "rgba(255, 255, 255, 0.1)",
                boxShadow:
                  "rgba(0, 0, 0, 0.16) 0px 10px 36px 0px, rgba(0, 0, 0, 0.06) 0px 0px 0px 1px",
              }}
            >
              <Typography
                color="primary"
                fontFamily="Montez"
                fontSize={40}
                fontWeight={400}
                textAlign="center"
              >
                Palace Instanbul
              </Typography>

              <Typography variant="subtitle1" mx={4} mb={1}>
                Please enter your username and password
              </Typography>

              <form
                //onSubmit={handleSubmit(_login)}
                onSubmit={handleSubmit((data: Login) =>
                  login(data, {
                    onSuccess(data, variables, context) {
                      console.log(data);
                    },
                  })
                )}
              >
                <TextFieldX
                  label="Username *"
                  placeholder="Enter username"
                  error={dirty.username && Boolean(errors.username?.message)}
                  helperText={dirty.username && errors.username?.message}
                  prefixcon={<MdAccountCircle size={24} />}
                  {...register("username")}
                />

                <TextFieldX
                  type={showPassword ? "password" : "text"}
                  label="Password *"
                  placeholder="Enter password"
                  error={dirty.password && Boolean(errors.password?.message)}
                  helperText={dirty.password && errors.password?.message}
                  prefixcon={<AiFillLock size={24} />}
                  suffixcon={
                    <IconButton
                      onClick={() => setShowPassword((prev) => !prev)}
                      onMouseDown={(event) => event.preventDefault()}
                      edge="end"
                      sx={{ color: errors.password ? "#d3302f" : "" }}
                    >
                      {showPassword ? <MdVisibility /> : <MdVisibilityOff />}
                    </IconButton>
                  }
                  {...register("password")}
                />

                <ButtonX
                  variant="contained"
                  placement="center"
                  size="large"
                  fullwidth
                  disabled={!isValid || isSubmitting}
                  loading={isSubmitting}
                  loadingtext="LET'S GO..."
                >
                  LOGIN
                </ButtonX>
              </form>

              <Button
                sx={{ mt: 2 }}
                // onClick={() => {
                //   setForgotPassword({
                //     action: "reset",
                //     username: values.username,
                //     updatePhone: false,
                //   });
                //   openPasswordReset();
                // }}
              >
                FORGOT PASSWORD?
              </Button>
            </Stack>
          </motion.div>
        </Grid>
      </Grid>

      <DevTool control={control} />
    </Box>
  );
}
