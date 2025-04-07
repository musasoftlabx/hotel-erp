// * MUI
import {
  Button,
  ButtonProps,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";

type ButtonX = {
  /**
   * @param {boolean} scaleOnHover - Scales the button when hovered
   * @see https://ui.musasoftlabs.com/docs/ButtonX#dontScale
   * @author Musa Mutetwi Muliro &lt;musasoftlabx&commat;gmail.com&gt;
   */
  loadingtext?: string;
  /**
   * Where to align the button horizontally.
   * @see https://ui.musasoftlabs.com/docs/ButtonX#placement
   * @author Musa Mutetwi Muliro &lt;musasoftlabx&commat;gmail.com&gt;
   */
  placement?: "left" | "center" | "right";
} & ButtonProps;

export default function ButtonX(props: ButtonX) {
  return (
    <Grid
      size={12}
      display="flex"
      justifyContent={props.placement || "center"}
      px={1}
      pt={2}
      overflow="hidden"
    >
      {/* <motion.div
        whileHover={
          !props.disabled && props.scaleOnHover ? { scale: 1.05 } : {}
        }
        transition={{ type: "spring", stiffness: 500, damping: 10 }}
      > */}
      <Button
        {...props}
        type="submit"
        variant={props?.variant || "outlined"}
        loadingIndicator={
          <Stack spacing={1} direction="row">
            <Typography variant="subtitle2" noWrap>
              {props.loadingtext}
            </Typography>
            <CircularProgress size={20} color="inherit" />
          </Stack>
        }
        sx={{
          ...props.sx,
          borderRadius: 2,
          borderWidth: 4,
          boxShadow: "rgba(52, 117, 210, 0.3) 0px 30px 90px",
          ":hover": {
            borderStyle: "double",
            boxShadow: "rgba(2, 87, 210, 0.5) 0px 30px 90px",
          },
        }}
      >
        {props.children}
      </Button>
      {/* </motion.div> */}
    </Grid>
  );
}
