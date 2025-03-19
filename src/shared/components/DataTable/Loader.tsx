// * Next
import Image from "next/image";

// * MUI
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";

// * Assets
//import loading from "/images/illustrations/animated/loading.gif";

export default function Loader({ text }: { text: string }) {
  return (
    <Grid container alignItems="center" flexDirection="column">
      <Image
        src={"/images/illustrations/animated/loading.gif"}
        alt="loading"
        height={150}
        width={150}
      />
      <Typography variant="h5">{text}</Typography>
    </Grid>
  );
}
