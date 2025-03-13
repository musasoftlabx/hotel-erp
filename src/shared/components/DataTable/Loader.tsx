// * Next
import Image from "next/image";

// * MUI
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";

// * Assets
import TuinuaneAnimated from "../../../public/images/tuinuane.gif";

export default function Loader({ text }: { text: string }) {
  return (
    <Grid container alignItems="center" flexDirection="column">
      <Image
        //src={TuinuaneAnimated}
        src={""}
        alt="tuinuane_animated"
        height={150}
        width={150}
      />
      <Typography variant="h5">{text}</Typography>
    </Grid>
  );
}
