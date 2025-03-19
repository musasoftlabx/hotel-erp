// * NPM
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import axios from "axios";

// * MUI
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import Modal from "@mui/material/Modal";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

// * Components
import { ButtonX } from "@/shared/components/InputFields/ButtonX";
import { CloseButtonX } from "@/shared/components/InputFields/CloseButtonX";
import { TextFieldX } from "@/shared/components/InputFields/TextFieldX";

// * Icons
import { BsFillPhoneVibrateFill } from "react-icons/bs";
import {
  MdAccountCircle,
  MdAlternateEmail,
  MdOutlineSupervisedUserCircle,
} from "react-icons/md";

// * Store
import { useAlertStore } from "@/store";

// * Shared
import ModalStyles from "@/shared/ModalStyles";

// * Utils
import { yupPhoneNumber, yupString } from "@/utils/yupReusables";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { InferType, object, string } from "yup";

const schema = object({
  firstName: yupString,
  middleName: string(),
  lastName: yupString,
  emailAddress: string().email("Invalid email").max(50, "Max of 50 chars"),
  phoneNumber: yupPhoneNumber,
  role: yupString,
});

type AddUser = InferType<typeof schema>;

export default function AddUser({
  roles,
  isAddModalOpen,
  setIsAddModalOpen,
  handleGetData,
}: {
  roles: string[];
  isAddModalOpen: boolean;
  setIsAddModalOpen: (status: boolean) => void;
  handleGetData: () => void;
}) {
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

  // ? Hooks
  const showAlert = useAlertStore((state) => state.alert);

  // ? Mutations
  const { mutate: addUser } = useMutation({
    mutationFn: (body: AddUser) => axios.post("users?scope=user", body),
  });

  return (
    <Modal open={isAddModalOpen} closeAfterTransition>
      <motion.div
        initial={{ opacity: 0, scale: 2, y: "0%" }}
        animate={{ opacity: 1, scale: 1, y: "calc(50vh)" }}
        transition={{ type: "spring", stiffness: 200, damping: 30 }}
        exit={{ opacity: 0, y: 100 }}
      >
        <Paper sx={ModalStyles({ minWidth: "300px", maxWidth: "40vw" })}>
          <Stack
            direction="row"
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography
              color="primary"
              fontSize={20}
              fontWeight="bold"
              sx={(theme) => ({
                borderBottomLeftRadius: 20,
                borderBottomRightRadius: 20,
                px: 3,
              })}
            >
              Add user
            </Typography>

            <CloseButtonX
              sx={{ mr: 3 }}
              onClick={() => setIsAddModalOpen(false)}
            />
          </Stack>

          <Box sx={{ maxHeight: "80vh", overflow: "auto" }}>
            <form
              onSubmit={handleSubmit((data: AddUser) =>
                addUser(data, {
                  onSuccess(data, variables, context) {
                    console.log(data);
                  },
                })
              )}
            >
              <TextFieldX
                label="First Name *"
                error={dirty.firstName && Boolean(errors.firstName?.message)}
                helperText={dirty.firstName && errors.firstName?.message}
                prefixcon={<MdAccountCircle size={24} />}
                columnspan={{ xs: 6 }}
                slotProps={{ htmlInput: { maxLength: 20 } }}
                {...register("firstName")}
              />

              <TextFieldX
                label="Middle Name"
                placeholder="Enter middle name"
                error={dirty.middleName && Boolean(errors.middleName?.message)}
                helperText={dirty.middleName && errors.middleName?.message}
                prefixcon={<MdAccountCircle size={24} />}
                columnspan={{ xs: 6 }}
                slotProps={{ htmlInput: { maxLength: 20 } }}
                {...register("middleName")}
              />

              <TextFieldX
                label="Last Name *"
                placeholder="Enter last name"
                error={dirty.lastName && Boolean(errors.lastName?.message)}
                helperText={dirty.lastName && errors.lastName?.message}
                prefixcon={<MdAccountCircle size={24} />}
                columnspan={{ xs: 6 }}
                slotProps={{ htmlInput: { maxLength: 20 } }}
                {...register("lastName")}
              />

              <TextFieldX
                label="Email Address (Optional)"
                placeholder="Enter email address"
                error={
                  dirty.emailAddress && Boolean(errors.emailAddress?.message)
                }
                helperText={dirty.emailAddress && errors.emailAddress?.message}
                prefixcon={<MdAlternateEmail size={24} />}
                columnspan={{ xs: 6 }}
                slotProps={{ htmlInput: { maxLength: 50 } }}
                {...register("emailAddress")}
              />

              <TextFieldX
                label="Phone Number *"
                placeholder="Enter phone number"
                error={
                  dirty.phoneNumber && Boolean(errors.phoneNumber?.message)
                }
                helperText={dirty.phoneNumber && errors.phoneNumber?.message}
                prefixcon={<BsFillPhoneVibrateFill size={24} />}
                columnspan={{ xs: 6 }}
                slotProps={{ htmlInput: { maxLength: 20 } }}
                mask="xxxxxxxxxx"
                {...register("phoneNumber")}
              />

              <TextFieldX
                label="Role *"
                placeholder="Select role"
                error={dirty.role && Boolean(errors.role?.message)}
                helperText={dirty.role && errors.role?.message}
                prefixcon={<MdOutlineSupervisedUserCircle size={24} />}
                columnspan={{ xs: 6 }}
                slotProps={{ htmlInput: { maxLength: 50 } }}
                mask="xxxxxxxxxx"
                {...register("role")}
              >
                {roles?.map((role, key) => (
                  <MenuItem key={key} value={role}>
                    {role}
                  </MenuItem>
                ))}
              </TextFieldX>

              <ButtonX
                variant="contained"
                placement="center"
                size="large"
                fullwidth
                disabled={!isValid || isSubmitting}
                loading={isSubmitting}
                loadingtext="LET'S GO..."
              >
                ADD USER
              </ButtonX>
            </form>

            {/* <Formik
              initialValues={{
                dealerObj: {},
                dealer: "",
                firstName: "",
                middleName: "",
                lastName: "",
                emailAddress: "",
                phoneNumber: "",
                role: "",
              }}
              validationSchema={Yup.object({
                dealer: string,
                firstName: string,
                middleName: Yup.string(),
                lastName: string,
                emailAddress: Yup.string()
                  .email("Invalid email")
                  .max(50, "Max of 50 chars"),
                phoneNumber: phone,
                role: string,
              })}
              onSubmit={(values, { setSubmitting, resetForm }) =>
                addUser(values, {
                  onSuccess: () => {
                    resetForm();
                    setIsAddModalOpen(false);
                    showAlert({
                      status: "success",
                      subject: "User created!",
                      body: `<b>${startCase(
                        values.firstName
                      )}</b> was created successfully. A message has been sent to them with the login credentials.`,
                    });
                    handleGetData();
                  },
                  onError: (error: any) => {
                    setSubmitting(false);
                    showAlert({
                      status: "error",
                      subject: error.response.data.subject,
                      body: error.response.data.body,
                    });
                  },
                })
              }
            >
              {({
                values,
                errors,
                touched,
                handleBlur,
                getFieldProps,
                isSubmitting,
                setFieldValue,
              }) => (
                <Form>
                  <Grid container sx={{ px: 2 }}>
                    <Autocomplete
                      fullWidth
                      size="small"
                      options={dealers}
                      getOptionLabel={({
                        dealerCode,
                        dealerName,
                      }: {
                        dealerCode: string;
                        dealerName: string;
                      }) => `${dealerName} (${dealerCode})`}
                      onChange={(e, dealer: { dealerName: string }) => {
                        const __dealer = dealers?.find(
                          (_: { dealerName: string; dealerCode?: string }) =>
                            _.dealerName === dealer?.dealerName && _.dealerCode
                        );
                        setFieldValue("dealer", __dealer?.dealerCode);
                        setFieldValue("dealerObj", __dealer);
                      }}
                      renderOption={(props, option: any) => (
                        <Box
                          component="li"
                          sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
                          {...props}
                        >
                          <Stack>
                            <Typography
                              variant="body2"
                              sx={{
                                background:
                                  "linear-gradient(to right, #50cc7f 0%, #f9a825 100%)",
                                fontWeight: 500,
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                              }}
                            >
                              Dealer Code: {option.dealerCode}
                            </Typography>
                            <Typography variant="caption" fontWeight={600}>
                              Dealer Name:&nbsp;
                              <Typography variant="caption" fontWeight={300}>
                                {option.dealerName}
                              </Typography>
                            </Typography>
                          </Stack>
                        </Box>
                      )}
                      renderInput={(params) => (
                        <TextFieldX
                          {...params}
                          label="Dealer *"
                          columnspan={{ xs: 12 }}
                          fullWidth
                          placeholder="Search or select dealer"
                          error={
                            touched[
                              //@ts-ignore
                              Object.keys(touched).find((e) => e.includes(":"))
                            ] && Boolean(errors.dealer)
                          }
                          helperText={
                            touched[
                              //@ts-ignore
                              Object.keys(touched).find((e) => e.includes(":"))
                            ] && errors.dealer
                          }
                          prefixcon={<MdStore size={24} />}
                          onBlur={handleBlur}
                          InputProps={{
                            ...params.InputProps,
                            type: "search",
                            disableUnderline: true,
                            startAdornment: (
                              <InputAdornment
                                position="start"
                                sx={{
                                  marginTop:
                                    (params.inputProps.value ? 0 : -18) +
                                    "px !important",
                                }}
                              >
                                <MdStore size={24} />
                              </InputAdornment>
                            ),
                          }}
                        />
                      )}
                    />

              

                    <TextFieldX
                      label="Email Address (Optional)"
                      columnspan={{ xs: 6 }}
                      inputProps={{ maxLength: 30 }}
                      error={
                        touched.emailAddress && Boolean(errors.emailAddress)
                      }
                      helperText={touched.emailAddress && errors.emailAddress}
                      prefixcon={<MdAlternateEmail size={24} />}
                      {...getFieldProps("emailAddress")}
                    />

                    <TextFieldX
                      label="Phone Number *"
                      columnspan={{ xs: 6 }}
                      mask="xxxxxxxxxx"
                      replacement={{ x: /\d/ }}
                      error={touched.phoneNumber && Boolean(errors.phoneNumber)}
                      helperText={touched.phoneNumber && errors.phoneNumber}
                      prefixcon={<BsFillPhoneVibrateFill size={24} />}
                      {...getFieldProps("phoneNumber")}
                    />

                    <TextFieldX
                      label="Role *"
                      columnspan={{ xs: 6 }}
                      prefixcon={<MdOutlineSupervisedUserCircle size={24} />}
                      select
                      error={touched.role && Boolean(errors.role)}
                      helperText={touched.role && errors.role}
                      {...getFieldProps("role")}
                    >
                      {roles.map((role, key) => (
                        <MenuItem key={key} value={role}>
                          {role}
                        </MenuItem>
                      ))}
                    </TextFieldX>

                    <Alert
                      severity="warning"
                      icon={false}
                      sx={{
                        border: `1px dashed ${orange[400]}`,
                        borderRadius: 2,
                        mt: 1,
                        mb: 2,
                        mx: 1,
                      }}
                    >
                      An officer has limited privileges such as{" "}
                      <b>not being able to view the balance.</b> An admin will
                      have all privileges
                    </Alert>

                    <LoadingButtonX
                      type="submit"
                      placement="center"
                      variant="contained"
                      disabled={
                        JSON.stringify(touched) === "{}" ||
                        JSON.stringify(errors) !== "{}" ||
                        isSubmitting
                      }
                      loading={isSubmitting}
                      loadingtext="REQUESTING..."
                    >
                      ADD USER
                    </LoadingButtonX>
                  </Grid>
                </Form>
              )}
            </Formik> */}
          </Box>
        </Paper>
      </motion.div>
    </Modal>
  );
}
