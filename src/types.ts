declare module "@mui/material/styles" {
  interface PaletteOptions {
    white: PaletteOptions["primary"];
  }
}
export interface iQueryOptions {
  filterModel: {
    items: { field: string; operator: string; id: number; value: string }[];
    quickFilterValues: [];
    quickFilterLogicOperator: string;
    logicOperator: string;
  };
  sortModel: [];
}

export type SearchParams = {
  limit: string;
  offset: string;
  view: "display" | "export";
  options: string;
  scope: string;
};
