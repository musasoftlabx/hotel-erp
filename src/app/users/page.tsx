"use client";

// * React
import { useEffect, useState } from "react";

// * NextJS
import Image from "next/image";

// * NPM
import axios from "axios";

// * MUI
import {
  DataGridPro,
  GRID_CHECKBOX_SELECTION_COL_DEF,
  GridPreProcessEditCellProps,
  GridRowModel,
  useGridApiRef,
} from "@mui/x-data-grid-pro";
import {
  Box,
  Button,
  FormControlLabel,
  IconButton,
  Stack,
  ThemeOptions,
  Typography,
} from "@mui/material";
import { motion } from "framer-motion";

import { InferType, object } from "yup";
import { useMutation, useQuery } from "@tanstack/react-query";

import { yupUsername, yupPassword } from "@/utils/yupReusables";
import useCustomDataGrid from "@/hooks/useCustomDataGrid";
import {
  DataGridSlotProps,
  DataGridSlots,
} from "@/shared/components/DataTable/DataGridSlots";
import { DataGridStyles } from "@/shared/components/DataTable/DataGridStyles";

import { FaUsersCog } from "react-icons/fa";
import DataGridPagination from "@/shared/components/DataTable/DataGridPagination";
import { sx } from "@/shared/components/DataTable/DataGridToolbar";
import {
  booleanFilter,
  dateFilter,
} from "@/shared/components/DataTable/DataGridFilters";
import {
  DataGridDelete,
  DataGridSwitch,
} from "@/shared/components/DataTable/DataGridCustomElements";
import useJWT from "@/hooks/useJWT";
import { AiOutlineUnlock } from "react-icons/ai";
import { green } from "@mui/material/colors";
import { useConfirmStore } from "@/store";
import AppDrawer from "@/shared/components/Layouts/AppDrawer";
import { PageHeader } from "@toolpad/core/PageContainer";
import PageNavigator from "@/shared/components/Layouts/PageNavigator";

export default function Users() {
  // ? Refs

  const apiRef = useGridApiRef();
  const apiUrl = "users";
  const permissions: { readWriteRoles: string[]; readWriteUsers: string[] } = {
    readWriteRoles: [],
    readWriteUsers: [],
  };

  // ? Hooks
  const { profile } = useJWT();

  const {
    initialState,
    columnVisibilityModel,
    filters,
    filterModel,
    paginationModel,
    pinnedColumnsModel,
    rowSelectionModel,
    sortModel,
    stats,
    syncState,
    changeRowSelection,
    changeVisibleColumns,
    changeFilters,
    changePagination,
    changePinnedColumns,
    changeSorting,
    changeStats,
    handleGetData,
    updateCell,
  } = useCustomDataGrid({
    apiRef,
    apiUrl,
    toHide: { id: true },
    toSort: [{ field: "id", sort: "desc" }],
    toPin: {
      left: [GRID_CHECKBOX_SELECTION_COL_DEF.field, "id", "username"],
      right: ["isActive", "actions"],
    },
  });
  const showConfirm = useConfirmStore((state) => state.alert);

  // ? States
  //const [data, setData] = useState<GridValidRowModel>();
  const [isExporting, setIsExporting] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isManageUserRolesOpen, setIsManageUserRolesOpen] = useState(false);

  // ? Effects
  useEffect(() => {
    apiRef.current.restoreState({
      columns: {
        dimensions: initialState?.columns?.dimensions,
        orderedFields: initialState?.columns?.orderedFields,
      },
    });
  });

  // ? Queries
  const { data, isLoading } = useQuery({
    queryKey: [
      apiUrl,
      paginationModel?.pageSize,
      paginationModel?.page,
      "display",
      encodeURI(JSON.stringify({ filterModel, sortModel })),
    ],
    queryFn: ({ queryKey }) =>
      axios.get(
        `${queryKey[0]}?limit=${queryKey[1]}&offset=${queryKey[2]}&view=${queryKey[3]}&options=${queryKey[4]}&scope=users`
      ),
    enabled: JSON.stringify({ filterModel, sortModel }) !== "{}",
    select: ({ data }) => data,
  });

  return (
    <AppDrawer>
      <PageNavigator
        dataset={data?.dataset}
        count={data?.count}
        name="User Management"
        alt={`${data?.count !== 1 ? apiUrl : apiUrl.slice(0, -1)}`}
      />

      <Box sx={{ height: `calc(100vh - 190px)` }}>
        <DataGridPro
          apiRef={apiRef}
          rows={data?.dataset ?? []}
          rowCount={data?.count ?? 0}
          initialState={initialState}
          columns={[
            {
              field: GRID_CHECKBOX_SELECTION_COL_DEF.field,
              align: "center",
              disableColumnMenu: true,
              filterable: false,
              hideable: false,
              resizable: false,
              sortable: false,
              width: 40,
            },
            {
              field: "id",
              headerName: "Id.",
              disableColumnMenu: true,
              hideable: false,
              pinnable: false,
              resizable: false,
              width: 70,
            },
            // {
            //   field: "avatar",
            //   headerName: "Avatar",
            //   disableColumnMenu: true,
            //   hideable: false,
            //   pinnable: false,
            //   resizable: false,
            //   width: 100,
            //   renderCell: ({ row: { avatar } }) => (
            //     <Image src={avatar} alt="avatar" width={50} height={50} />
            //   ),
            // },
            {
              field: "username",
              headerName: "Username",
              disableColumnMenu: true,
              hideable: false,
              pinnable: false,
              resizable: false,
              width: 125,
            },
            {
              field: "firstName",
              headerName: "First Name",
              align: "center",
              headerAlign: "center",
              // editable:
              //   permissions?.readWriteRoles?.includes(profile?.role) &&
              //   permissions?.readWriteUsers?.includes(profile?.username)
              //     ? true
              //     : false,
              resizable: false,
              width: 150,
              preProcessEditCellProps: (
                params: GridPreProcessEditCellProps
              ) => ({
                ...params.props,
                error: !params.props.value || params.props.value.length > 20,
              }),
            },
            {
              field: "lastName",
              headerName: "Last Name",
              align: "center",
              headerAlign: "center",
              // editable:
              //   permissions?.readWriteRoles?.includes(profile?.role) &&
              //   permissions?.readWriteUsers?.includes(profile?.username)
              //     ? true
              //     : false,
              resizable: false,
              width: 150,
              preProcessEditCellProps: (
                params: GridPreProcessEditCellProps
              ) => ({
                ...params.props,
                error: !params.props.value || params.props.value.length > 20,
              }),
            },
            {
              field: "phoneNumber",
              headerName: "Phone Number",
              align: "center",
              headerAlign: "center",
              // editable:
              //   permissions?.readWriteRoles?.includes(profile?.role) &&
              //   permissions?.readWriteUsers?.includes(profile?.username)
              //     ? true
              //     : false,
              resizable: false,
              sortable: false,
              width: 125,
              preProcessEditCellProps: (
                params: GridPreProcessEditCellProps
              ) => ({
                ...params.props,
                error:
                  !params.props.value ||
                  params.props.value.length !== 10 ||
                  /^[0-9]+$/.test(params.props.value) === false ||
                  (!params.props.value.startsWith("07") &&
                    !params.props.value.startsWith("01")),
              }),
            },
            {
              field: "emailAddress",
              headerName: "Email Address",
              align: "center",
              headerAlign: "center",
              // editable:
              //   permissions?.readWriteRoles?.includes(profile?.role) &&
              //   permissions?.readWriteUsers?.includes(profile?.username)
              //     ? true
              //     : false,
              width: 250,
              preProcessEditCellProps: (
                params: GridPreProcessEditCellProps
              ) => ({
                ...params.props,
                error:
                  params.props.value &&
                  /^\S+@\S+\.\S+$/.test(params.props.value) === false,
              }),
            },
            {
              type: "singleSelect",
              field: "role",
              headerName: "Role",
              align: "center",
              headerAlign: "center",
              // editable:
              //   permissions?.readWriteRoles?.includes(profile?.role) &&
              //   permissions?.readWriteUsers?.includes(profile?.username)
              //     ? true
              //     : false,
              resizable: false,
              valueOptions: data?.roles,
              width: 100,
            },
            {
              field: "createdBy",
              headerName: "Created By",
              headerAlign: "center",
              align: "center",
              width: 120,
            },
            {
              field: "createdOn",
              headerName: "Created On",
              width: 250,
              filterOperators: dateFilter,
            },
            {
              field: "modifiedBy",
              headerName: "Modified By",
              headerAlign: "center",
              align: "center",
              width: 120,
            },
            {
              field: "modifiedOn",
              headerName: "Modified On",
              width: 250,
              filterOperators: dateFilter,
            },
            // {
            //   type: "isActive",
            //   field: "isActive",
            //   headerName: "Is Active?",
            //   align: "center",
            //   headerAlign: "center",
            //   width: 100,
            //   renderCell: ({ row: { id, isActive } }) => (
            //     <DataGridSwitch
            //       id={id}
            //       isChecked={isActive}
            //       field="isActive"
            //       profile={profile}
            //       apiUrl={`${apiUrl}?scope=users`}
            //       permissions={permissions}
            //       //setData={setData}
            //       handleGetData={handleGetData}
            //     />
            //   ),
            //   filterOperators: booleanFilter,
            // },
            {
              field: "actions",
              headerName: "Reset | Delete",
              headerAlign: "center",
              align: "center",
              sortable: false,
              filterable: false,
              hideable: false,
              pinnable: false,
              resizable: false,
              disableColumnMenu: true,
              width: 120,
              renderCell: ({ row: { id, isActive, username } }) => (
                <Stack direction="row" spacing={2}>
                  {isActive && (
                    <IconButton
                      // disabled={
                      //   !permissions?.readWriteRoles?.includes(profile?.role) &&
                      //   !permissions?.readWriteUsers?.includes(
                      //     profile?.username
                      //   )
                      // }
                      onClick={() => {
                        changeRowSelection([username, id]);
                        showConfirm({
                          operation: "reset",
                          status: "info",
                          subject: "Confirm password reset",
                          body: `This will generate a new password and send to the user. Proceed?`,
                        });
                      }}
                      color="primary"
                      sx={{
                        background: green[100],
                        mt: -0.5,
                        "&:hover": { background: green[300], color: "#fff" },
                      }}
                    >
                      <AiOutlineUnlock size={20} />
                    </IconButton>
                  )}

                  <DataGridDelete
                    id={id}
                    profile={profile}
                    entity="user"
                    permissions={permissions}
                    changeRowSelection={changeRowSelection}
                    showConfirm={showConfirm}
                  />
                </Stack>
              ),
            },
          ]}
          checkboxSelection
          isRowSelectable={({ row: { isActive } }) => isActive}
          pagination
          keepNonExistentRowsSelected
          disableRowSelectionOnClick
          showCellVerticalBorder
          hideFooter
          hideFooterPagination
          hideFooterSelectedRowCount
          filterMode="server"
          paginationMode="server"
          sortingMode="server"
          loading={isLoading}
          columnVisibilityModel={columnVisibilityModel}
          filterModel={filterModel}
          paginationModel={paginationModel}
          pinnedColumns={pinnedColumnsModel}
          rowSelectionModel={rowSelectionModel}
          sortModel={sortModel}
          onColumnOrderChange={syncState}
          onColumnResize={syncState}
          onColumnVisibilityModelChange={(model) => changeVisibleColumns(model)}
          onFilterModelChange={(model) => changeFilters(model)}
          onPaginationModelChange={(model) => changePagination(model)}
          onPinnedColumnsChange={(model) => changePinnedColumns(model)}
          onRowSelectionModelChange={(model) => changeRowSelection(model)}
          onSortModelChange={(model) => changeSorting(model)}
          processRowUpdate={(newRow: GridRowModel, oldRow: GridRowModel) =>
            updateCell({
              newRow,
              oldRow,
              url: `${apiUrl}?scope=users`,
            })
          }
          slots={DataGridSlots({
            apiRef,
            apiUrl: `${apiUrl}?scope=users`,
            changeFilters,
            changeRowSelection,
            exclude: ["multiApprove", "multiReject"],
            exportURL: `${apiUrl}?scope=users&limit=${data?.count}&offset=${
              paginationModel?.page
            }&view=export&options=${encodeURI(
              JSON.stringify({ filterModel, sortModel })
            )}`,
            handleGetData,
            isExporting,
            isLoading,
            search: {
              fields: "Id, Username, Dealer, Names, Phone etc ...",
              width: 450,
            },
            setIsExporting,
            stats,
            changeStats,
            setIsAddModalOpen,
            extraActions: (
              <Button
                size="small"
                startIcon={<FaUsersCog />}
                onClick={() => setIsManageUserRolesOpen((prev: any) => !prev)}
                sx={sx}
              >
                Manage Roles
              </Button>
            ),
          })}
          slotProps={DataGridSlotProps}
          sx={DataGridStyles}
        />

        <DataGridPagination
          data={data}
          paginationModel={paginationModel!}
          changePagination={changePagination}
        />
      </Box>
    </AppDrawer>
  );
}
