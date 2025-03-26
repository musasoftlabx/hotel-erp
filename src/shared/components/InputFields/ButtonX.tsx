// * MUI
import {
  Button,
  ButtonProps,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";

// * NPM
import { motion } from "framer-motion";

interface iButtonX {
  /**
   * @namespace
   * @property {object}  defaults               - The default values for parties.
   * @property {number}  defaults.players       - The default number of players.
   * @property {string}  defaults.level         - The default level for the party.
   * @property {object}  defaults.treasure      - The default treasure.
   * @property {number}  defaults.treasure.gold - How much gold the party starts with.
   */
  children?: React.ReactNode;
  /**
   * This specifies the fields to hide from the datagrid view
   * @type boolean
   * @see http://172.29.127.133:3333
   * @author Musa Mutetwi Muliro &lt;musasoftlabx&commat;gmail.com&gt;
   */
  dontScale?: boolean;
  disabled?: boolean;
  placement?: string;
  loadingtext?: string;
  sx?: {};
  variant?: ButtonProps["variant"];
  loading?: ButtonProps["loading"];
  fullwidth?: ButtonProps["fullWidth"];
  size?: ButtonProps["size"];
  onClick?: () => void;
}

export const ButtonX = (props: iButtonX) => (
  <Grid size={12} display="flex" justifyContent={props.placement} px={1} pt={2}>
    <motion.div
      whileHover={!props.disabled && !props.dontScale ? { scale: 1.05 } : {}}
      transition={{ type: "spring", stiffness: 500, damping: 10 }}
    >
      <Button
        type="submit"
        variant={props.variant || "outlined"}
        disabled={props.disabled}
        loading={props.loading}
        fullWidth={props.fullwidth}
        size={props.size}
        onClick={props.onClick}
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
          px: 2,
          ":hover": {
            borderStyle: "double",
            borderWidth: 4,
            boxShadow: "rgba(2, 87, 210, 0.5) 0px 30px 90px",
          },
        }}
      >
        {props.children}
      </Button>
    </motion.div>
  </Grid>
);
