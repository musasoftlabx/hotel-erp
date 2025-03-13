import { gridClasses } from "@mui/x-data-grid-pro";

export const DataGridStyles = (theme: {
  palette: { grey: any; background: { paper: any } };
}) => ({
  borderTop: `1px solid ${theme.palette.grey}`,
  borderRadius: 5,
  mx: 2,
  overflow: "auto",
  [`.${gridClasses["cell--editable"]}`]: {
    background: "rgba(70, 189, 97, .1)",
    cursor: "text",
    outline: 1,
  },
  [`.${gridClasses["cell--editing"]}`]: {
    border: "1px solid red",
  },
  [`.${gridClasses.columnHeaders}`]: {
    backgroundColor: theme.palette.background.paper,
    position: "sticky",
  },
  [`.${gridClasses.toolbarContainer}`]: {
    borderBottom: 1,
    borderBottomStyle: "solid",
    borderBottomColor: "action.selected",
    position: "relative",
  },
  [`.${gridClasses.toolbarContainer} .MuiTextField-root`]: {
    position: "fixed",
    top: 80,
    right: 15,
  },
  "& :not(.MuiDataGrid-cell--editable:focus)": {
    outline: "none",
  },
});
