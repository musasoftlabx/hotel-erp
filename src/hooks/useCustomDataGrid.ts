// * React
import { useEffect, useState } from "react";

// * NPM
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

// * MUI
import {
  GridApiPro,
  GridColumnVisibilityModel,
  GridFilterModel,
  GridPaginationModel,
  GridPinnedColumns,
  GridRowId,
  GridRowModel,
  GridRowSelectionModel,
  GridSortModel,
} from "@mui/x-data-grid-pro";
import { GridInitialStatePro } from "@mui/x-data-grid-pro/models/gridStatePro";

// * Store
import { useSnackBarStore } from "@/store";

type tUpdateCell = {
  newRow: GridRowModel;
  oldRow: GridRowModel;
  url: string;
};

export default function useCustomDataGrid({
  apiRef,
  apiUrl,
  toPin,
  toHide,
  toSort,
}: {
  apiRef: React.MutableRefObject<GridApiPro>;
  apiUrl: string;
  toPin?: { left: string[]; right?: string[] };
  /**
   * This specifies the fields to hide from the datagrid view
   * @type {{ fieldA: boolean, fieldB: boolean, ... }}
   * @see http://172.29.127.133:3333
   * @author Musa Mutetwi Muliro <mmuliro@safaricom.co.ke>
   */
  toHide?: {};
  toSort?: GridSortModel;
}) {
  // ? Hooks
  const queryClient = useQueryClient();
  const setSnackBar = useSnackBarStore((state) => state.setSnackBar);

  // ? States
  const [initialState, setInitialState] = useState<GridInitialStatePro>();
  const [columnVisibilityModel, setColumnVisibilityModel] =
    useState<GridColumnVisibilityModel>();
  const [filterModel, setFilterModel] = useState<GridFilterModel>();
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>();
  const [pinnedColumnsModel, setPinnedColumnsModel] =
    useState<GridPinnedColumns>();
  const [rowSelectionModel, setRowSelectionModel] =
    useState<GridRowSelectionModel>([]);
  const [sortModel, setSortModel] = useState<GridSortModel>();
  const [stats, setStats] = useState<boolean>();

  // ? Effects
  useEffect(() => {
    // TODO: Check localstorage and retrieve if found
    const filtered = localStorage.getItem(`_${apiUrl}_filtered_columns`);
    filtered && setFilterModel(JSON.parse(filtered));

    const pagination = localStorage.getItem(`____${apiUrl}_pagination`);
    pagination
      ? setPaginationModel(JSON.parse(pagination))
      : setPaginationModel({ pageSize: 20, page: 0 });

    const pinned = localStorage.getItem(`_${apiUrl}_pinned_columns`);
    pinned
      ? setPinnedColumnsModel(JSON.parse(pinned))
      : setPinnedColumnsModel(toPin);

    const selected = localStorage.getItem(`_${apiUrl}_selected_rows`);
    selected && setRowSelectionModel(JSON.parse(selected));

    const sorted = localStorage.getItem(`_${apiUrl}_sorted_columns`);
    sorted ? setSortModel(JSON.parse(sorted)) : setSortModel(toSort);

    const state = localStorage.getItem(`_${apiUrl}_state`);
    state ? setInitialState(JSON.parse(state)) : setInitialState({});

    const visible = localStorage.getItem(`_${apiUrl}_visible_columns`);
    visible
      ? setColumnVisibilityModel(JSON.parse(visible))
      : setColumnVisibilityModel(toHide);

    const stats = localStorage.getItem(`_${apiUrl}_stats`);
    stats ? setStats(JSON.parse(stats)) : setStats(true);
  }, []);

  // ? Functions
  const syncState = () => {
    setInitialState(apiRef.current.exportState());
    localStorage.setItem(
      `_${apiUrl}_state`,
      JSON.stringify(apiRef.current.exportState())
    );
  };

  const changeRowSelection = (model: GridRowSelectionModel) => {
    setRowSelectionModel(model);
    localStorage.setItem(`_${apiUrl}_selected_rows`, JSON.stringify(model));
  };

  const changeVisibleColumns = (model: GridColumnVisibilityModel) => {
    setColumnVisibilityModel(model);
    localStorage.setItem(`_${apiUrl}_visible_columns`, JSON.stringify(model));
  };

  const changeFilters = (model: GridFilterModel) => {
    setFilterModel(model);
    localStorage.setItem(`_${apiUrl}_filtered_columns`, JSON.stringify(model));
  };

  const changePagination = (model: GridPaginationModel) => {
    localStorage.removeItem(`_${apiUrl}_pagination`);
    localStorage.removeItem(`__${apiUrl}_pagination`);
    localStorage.removeItem(`___${apiUrl}_pagination`);
    setPaginationModel(model);
    localStorage.setItem(`____${apiUrl}_pagination`, JSON.stringify(model));
  };

  const changePinnedColumns = (model: GridPinnedColumns) => {
    setPinnedColumnsModel(model);
    localStorage.setItem(`_${apiUrl}_pinned_columns`, JSON.stringify(model));
  };

  const changeSorting = (model: GridSortModel) => {
    setSortModel(model);
    localStorage.setItem(`_${apiUrl}_sorted_columns`, JSON.stringify(model));
  };

  const changeStats = (show: boolean) => {
    setStats(show);
    localStorage.setItem(`_${apiUrl}_stats`, JSON.stringify(show));
  };

  // ? Constants
  const filters =
    filterModel?.items?.length! > 0 ||
    filterModel?.quickFilterValues?.length! > 0;

  // ? Functions
  const handleGetData = () => {
    queryClient.refetchQueries([
      apiUrl,
      paginationModel?.pageSize,
      paginationModel?.page,
      "display",
      encodeURI(JSON.stringify({ filterModel, sortModel })),
    ]);
  };

  const updateCell = ({ newRow, oldRow, url }: tUpdateCell) => {
    const id = newRow.id;
    let field, value;

    Object.values(newRow).forEach((val, i) => {
      if (val !== Object.values(oldRow)[i]) {
        field = Object.keys(newRow).find((key) => newRow[key] === val);
        value = val;
      }
    });

    if (field !== undefined && value !== undefined)
      updateData(
        { id, field, value, url },
        {
          onSuccess: () =>
            setSnackBar({
              status: "success",
              duration: 3000,
              message: "Record Updated!",
            }),
          onError: () =>
            setSnackBar({
              status: "error",
              duration: 3000,
              message: "Record was not updated!",
            }),
        }
      );

    return newRow;
  };

  // ? Mutations
  const { mutate: updateData } = useMutation(
    ({
      id,
      field,
      value,
      url,
    }: {
      id: GridRowId;
      field?: string;
      value?: string | number | boolean;
      url: string;
    }) => axios.patch(url, { id, field, value })
  );

  return {
    initialState,
    setInitialState,
    columnVisibilityModel,
    setColumnVisibilityModel,
    filters,
    filterModel,
    setFilterModel,
    paginationModel,
    setPaginationModel,
    pinnedColumnsModel,
    setPinnedColumnsModel,
    rowSelectionModel,
    setRowSelectionModel,
    sortModel,
    setSortModel,
    stats,
    syncState,
    changeFilters,
    changePagination,
    changePinnedColumns,
    changeRowSelection,
    changeSorting,
    changeVisibleColumns,
    changeStats,
    handleGetData,
    updateCell,
    updateData,
  };
}
