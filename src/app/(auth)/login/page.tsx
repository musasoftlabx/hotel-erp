"use client";

// * React
import { useEffect, useState } from "react";

// * NPM
import { Controller, useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import { InferType, object } from "yup";
import { motion } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";

// * MUI
import { Box, Button, IconButton, Stack, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";

// * Components
import { TextFieldX } from "@/shared/components/InputFields/TextFieldX";
import ButtonX from "@/shared/components/InputFields/ButtonX";
import ThemeSwitcherX from "@/shared/components/InputFields/ThemeSwitcherX";

// * Utils
import { yupUsername, yupPassword } from "@/utils/yupReusables";

// * Icons
import { AiFillLock } from "react-icons/ai";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import { RiAccountPinBoxLine } from "react-icons/ri";

const schema = object({
  username: yupUsername,
  password: yupPassword,
});

type Login = InferType<typeof schema>;

export default function Login() {
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

  // ? States
  const [showPassword, setShowPassword] = useState(true);

  // ? Effects
  useEffect(() => setFocus("username"), [setFocus]);

  // ? Mutations
  const { mutate: login } = useMutation({
    mutationFn: (body: Login) => axios.post("login", body),
  });

  return (
    <Box
      sx={[
        {
          background:
            "linear-gradient(to left, rgba(216, 247, 195, .9) 0%, rgba(222, 236, 221, .9) 100%);",
        },
        (theme) =>
          theme.applyStyles("dark", {
            background:
              "linear-gradient(293deg, rgba(41, 179, 74, .9) 0%, rgba(0, 0, 0, .9) 70%);",
          }),
      ]}
    >
      <Box
        sx={[
          {
            filter: "invert(0)",
            height: "100vh",
            objectFit: "cover",
            position: "fixed",
            width: "100vw",
            zIndex: -1,
          },
          (theme) =>
            theme.applyStyles("dark", {
              filter: "invert(1) hue-rotate(260deg)",
            }),
        ]}
      >
        <img
          src="/images/backdrops/backdrop-0.jpg"
          alt="background"
          style={{
            height: "100vh",
            objectFit: "cover",
            position: "fixed",
            width: "100vw",
            zIndex: -1,
          }}
        />
      </Box>

      <ThemeSwitcherX />

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
              pt={5}
              pb={3}
              px={3}
              sx={[
                {
                  background: "rgba(255, 255, 255, 0.5)",
                  boxShadow:
                    "rgba(0, 0, 0, 0.16) 0px 10px 36px 0px, rgba(0, 0, 0, 0.06) 0px 0px 0px 1px",
                },
                (theme) =>
                  theme.applyStyles("dark", {
                    background: "rgba(255, 255, 255, 0.1)",
                  }),
              ]}
            >
              <img
                src="/images/logo.webp"
                alt="logo"
                style={{ height: 150, width: 150 }}
              />

              <Typography
                color="primary"
                fontFamily="Abel"
                fontSize={38}
                fontWeight={400}
                textAlign="center"
              >
                Palace Instanbul
              </Typography>

              <Typography variant="subtitle2" mx={4} mb={1}>
                Please enter your username and password
              </Typography>

              <form
                onSubmit={handleSubmit((formdata: Login) =>
                  login(formdata, {
                    onSuccess: ({ data }) => {
                      console.log(data);
                    },
                  })
                )}
              >
                <Controller
                  name="username"
                  control={control}
                  render={({ field }) => (
                    <TextFieldX
                      {...field}
                      label="Username *"
                      error={
                        dirty.username && Boolean(errors.username?.message)
                      }
                      helperText={dirty.username && errors.username?.message}
                      prefixcon={<RiAccountPinBoxLine size={24} />}
                      columnspan={{ xs: 12 }}
                      slotprops={{ htmlInput: { maxLength: 20 } }}
                      {...register("username")}
                    />
                  )}
                />

                <Controller
                  name="password"
                  control={control}
                  render={({ field }) => (
                    <TextFieldX
                      {...field}
                      type={showPassword ? "password" : "text"}
                      label="Password *"
                      error={
                        dirty.password && Boolean(errors.password?.message)
                      }
                      helperText={dirty.password && errors.password?.message}
                      prefixcon={<AiFillLock size={24} />}
                      suffixcon={
                        <IconButton
                          onClick={() => setShowPassword((prev) => !prev)}
                          onMouseDown={(event) => event.preventDefault()}
                          edge="end"
                          sx={{ color: errors.password ? "#d3302f" : "" }}
                        >
                          {showPassword ? (
                            <MdVisibility />
                          ) : (
                            <MdVisibilityOff />
                          )}
                        </IconButton>
                      }
                      columnspan={{ xs: 12 }}
                      slotprops={{ htmlInput: { maxLength: 20 } }}
                      {...register("password")}
                    />
                  )}
                />

                <ButtonX
                  variant="contained"
                  placement="center"
                  size="large"
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
