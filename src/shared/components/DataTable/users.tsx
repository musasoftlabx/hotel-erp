// * React
import { useEffect, useState } from "react";

// * Next
import dynamic from "next/dynamic";

// * NPM
const ApexCharts = dynamic(() => import("react-apexcharts"), { ssr: false });
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import CountUp from "react-countup";

// * MUI
import {
  DataGridPro,
  GRID_CHECKBOX_SELECTION_COL_DEF,
  GridPreProcessEditCellProps,
  GridRowModel,
  GridValidRowModel,
  useGridApiRef,
} from "@mui/x-data-grid-pro";
import { ThemeOptions } from "@mui/material";
import { green } from "@mui/material/colors";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

// * Components
import { booleanFilter, dateFilter } from "@/components/Shared/DataGridFilters";
import { DataGridStyles } from "@/components/Shared/DataGridStyles";
import {
  DataGridSlotProps,
  DataGridSlots,
} from "@/components/Shared/DataGridSlots";
import {
  DataGridDelete,
  DataGridSwitch,
} from "@/components/Shared/DataGridCustomElements";
import { sx } from "@/components/Shared/DataGridToolbar";
import AddUser from "@/components/PageComponents/home/AddUser";
import AppDrawer from "@/components/Layouts/AppDrawer";
import DataGridPagination from "@/components/Shared/DataGridPagination";
import ManageUserRoles from "@/components/PageComponents/ManageUserRoles";
import Navigator from "@/components/Layouts/Navigator";

// * Hooks
import useCustomDataGrid from "@/hooks/useCustomDataGrid";
import useJWT from "@/hooks/useJWT";

// * Stores
import { useConfirmStore } from "@/store";

// * Shared
import fetchDealers from "@/shared/fetchDealers";

// * Icons
import { AiOutlineUnlock } from "react-icons/ai";
import { FaUsersCog } from "react-icons/fa";

// * Server
import { DB } from "./api/helpers/DB.connect";
import path from "path";

export async function getServerSideProps() {
  const filename = path.parse(__filename).name;
  return {
    props: {
      apiUrl: filename,
      dealers: await fetchDealers(),
      permissions: await DB.getrow(
        `SELECT readWriteRoles, readWriteUsers FROM dp_drawer_links_internal WHERE route = ?`,
        [`/${filename}`]
      ),
    },
  };
}

export default function Users({
  apiUrl,
  dealers,
  permissions,
  theme,
}: {
  apiUrl: string;
  dealers: Dealers[];
  permissions: TPermissions;
  theme: ThemeOptions;
}) {
  // ? Refs
  const apiRef = useGridApiRef();

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
    toHide: { id: profile?.role !== "Technical Support" ? false : true },
    toSort: [{ field: "id", sort: "desc" }],
    toPin: {
      left: [
        GRID_CHECKBOX_SELECTION_COL_DEF.field,
        "id",
        "username",
        "dealerCode",
      ],
      right: ["isActive", "actions"],
    },
  });
  const showConfirm = useConfirmStore((state) => state.alert);

  // ? States
  const [data, setData] = useState<GridValidRowModel>();
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
  const { isLoading } = useQuery(
    [
      apiUrl,
      paginationModel?.pageSize,
      paginationModel?.page,
      "display",
      encodeURI(JSON.stringify({ filterModel, sortModel })),
    ],
    ({ queryKey }) =>
      axios.get(
        `${queryKey[0]}?limit=${queryKey[1]}&offset=${queryKey[2]}&view=${queryKey[3]}&options=${queryKey[4]}&scope=users`
      ),
    {
      enabled: JSON.stringify({ filterModel, sortModel }) !== "{}",
      select: ({ data }) => data,
      onSuccess: (data) => setData(data),
    }
  );

  return (
    <AppDrawer>
      <Navigator
        dataset={data?.dataset}
        count={data?.count}
        name="User Management"
        alt={`${data?.count !== 1 ? apiUrl : apiUrl.slice(0, -1)}`}
      />

      <AddUser
        dealers={dealers}
        roles={data?.roles}
        isAddModalOpen={isAddModalOpen}
        setIsAddModalOpen={setIsAddModalOpen}
        handleGetData={handleGetData}
      />

      <ManageUserRoles
        isManageUserRolesOpen={isManageUserRolesOpen}
        setIsManageUserRolesOpen={setIsManageUserRolesOpen}
        handleGetData={handleGetData}
      />

      {stats && (
        <Stack
          direction="row"
          spacing={2}
          sx={{
            mb: 0.5,
            overflowX: "scroll",
            overflowY: "hidden",
            pb: 1,
            px: 2,
            "&::-webkit-scrollbar, & *::-webkit-scrollbar": { height: 3 },
            "&::-webkit-scrollbar-thumb:focus": { bgcolor: "#50cc7f" },
          }}
        >
          <Stack flex={0.2} minWidth={200}>
            <Paper
              variant="outlined"
              sx={(theme) => ({
                border: `1px solid ${theme.palette.grey}`,
                borderRadius: 3,
                pt: 1,
              })}
            >
              <Stack alignItems="center">
                <Typography variant="subtitle2" mb={-0.5} px={2}>
                  Total users
                </Typography>

                <CountUp
                  start={0}
                  end={data?.totalUsers}
                  duration={1}
                  style={{
                    fontFamily: "Rubik",
                    fontWeight: 600,
                    fontSize: 50,
                    marginTop: -3,
                    opacity: 0.6,
                  }}
                />
              </Stack>
            </Paper>
          </Stack>

          {filters && (
            <Stack flex={0.2} mt={-4} minWidth={200}>
              <Paper
                variant="outlined"
                sx={(theme) => ({
                  background: "#2cb34a",
                  border: `5px double ${
                    theme.palette.mode === "dark" ? "#000" : "#fff"
                  }`,
                  borderRadius: 3,
                  mt: -0.3,
                  pt: 1,
                })}
              >
                <Stack alignItems="center">
                  <Typography
                    variant="subtitle2"
                    mb={-0.5}
                    px={2}
                    sx={{ color: "yellow" }}
                  >
                    Filtered
                  </Typography>

                  <CountUp
                    start={0}
                    end={data?.count}
                    duration={1}
                    style={{
                      color: "#fff",
                      fontFamily: "Rubik",
                      fontWeight: 600,
                      fontSize: 48,
                      marginTop: -3,
                      opacity: 0.9,
                    }}
                  />
                </Stack>
              </Paper>
            </Stack>
          )}

          <Stack flex={filters ? 0.3 : 0.4} minWidth={280}>
            <Paper
              variant="outlined"
              sx={{ borderRadius: 3, height: 100, pt: 1 }}
            >
              <Typography variant="subtitle2" mb={-0.5} px={2}>
                Monthly & daily new users
              </Typography>

              <Typography
                variant="h6"
                fontFamily="Rubik"
                fontWeight="bold"
                px={2}
                sx={{ opacity: 0.7 }}
              >
                {data?.newUsersDaily}
                <Typography variant="caption">
                  &nbsp;this month
                </Typography>, {data?.newUsersToday}
                <Typography variant="caption">&nbsp;today</Typography>
              </Typography>

              <Stack direction="row">
                {data?.newUsers?.length > 0 && (
                  <ApexCharts
                    type="line"
                    height={40}
                    style={{ width: "100%" }}
                    series={[
                      {
                        name: "New users",
                        data: data?.newUsers.map(
                          ({ users }: { users: number }) => users
                        ),
                      },
                    ]}
                    options={{
                      chart: {
                        background: "transparent",
                        sparkline: { enabled: true },
                      },
                      theme: { mode: theme?.palette?.mode },
                      colors: ["#2CB34A"],
                      tooltip: {
                        fixed: {
                          enabled: true,
                          position: "topLeft",
                          offsetY: -40,
                        },
                      },
                      stroke: { curve: "smooth", lineCap: "round", width: 2 },
                      xaxis: {
                        categories: data?.newUsers.map(
                          ({ day }: { day: string }) => day
                        ),
                      },
                      fill: {
                        type: "gradient",
                        gradient: {
                          type: "vertical",
                          colorStops: [
                            { offset: 50, color: "#2CB34A", opacity: 0.7 },
                            { offset: 100, color: "#2CB34A", opacity: 0.5 },
                          ],
                        },
                      },
                    }}
                  />
                )}
              </Stack>
            </Paper>
          </Stack>

          <Stack flex={filters ? 0.3 : 0.4} minWidth={280}>
            <Paper
              variant="outlined"
              sx={{
                borderRadius: 3,
                height: 100,
                pl: 2,
                pr: 1,
                pt: 1,
                pb: 0.3,
              }}
            >
              <Typography variant="subtitle2" mb={-0.5}>
                Dealer with most users
              </Typography>

              <Typography variant="subtitle1" color="primary">
                {data?.mostUsers?.[data?.mostUsers.length - 2].dealerName}
              </Typography>

              <Stack direction="row" spacing={1}>
                <Typography variant="h4" sx={{ fontFamily: "Rubik" }}>
                  <CountUp
                    start={0}
                    end={data?.mostUsers?.[data?.mostUsers.length - 2].users}
                    duration={1}
                    style={{
                      fontWeight: 600,
                      fontSize: 34,
                      marginTop: -3,
                      opacity: 0.6,
                    }}
                  />
                  <Typography variant="caption">&nbsp;users</Typography>
                </Typography>

                {data?.mostUsers?.length > 0 && (
                  <ApexCharts
                    type="bar"
                    height={40}
                    style={{ marginTop: -8, width: "100%" }}
                    series={[
                      {
                        name: "Users",
                        data: data?.mostUsers.map(
                          ({ users }: { users: number }) => users
                        ),
                      },
                    ]}
                    options={{
                      chart: {
                        background: "transparent",
                        sparkline: { enabled: true },
                      },
                      theme: { mode: theme?.palette?.mode },
                      plotOptions: {
                        bar: { borderRadius: 2, columnWidth: "35%" },
                      },
                      labels: data?.mostUsers.map(
                        ({ dealerName }: { dealerName: string }) => dealerName
                      ),
                      fill: { type: "color", colors: ["#2CB34A"] },
                      tooltip: {
                        fixed: {
                          enabled: true,
                          position: "topLeft",
                          offsetX: 10,
                          offsetY: -20,
                        },
                      },
                    }}
                  />
                )}
              </Stack>
            </Paper>
          </Stack>
        </Stack>
      )}

      <Box sx={{ height: `calc(100vh - ${stats ? 300 : 185}px)` }}>
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
              field: "dealerCode",
              headerName: "Dealer Code",
              align: "center",
              headerAlign: "center",
              editable:
                permissions?.readWriteRoles?.includes(profile?.role) &&
                permissions?.readWriteUsers?.includes(profile?.username)
                  ? true
                  : false,
              disableColumnMenu: true,
              hideable: false,
              pinnable: false,
              resizable: false,
              width: 120,
            },
            {
              field: "dealerName",
              headerName: "Dealer Name",
              filterable: false,
              sortable: false,
              width: 300,
            },
            {
              field: "firstName",
              headerName: "First Name",
              align: "center",
              headerAlign: "center",
              editable:
                permissions?.readWriteRoles?.includes(profile?.role) &&
                permissions?.readWriteUsers?.includes(profile?.username)
                  ? true
                  : false,
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
              field: "middleName",
              headerName: "Middle Name",
              align: "center",
              headerAlign: "center",
              editable:
                permissions?.readWriteRoles?.includes(profile?.role) &&
                permissions?.readWriteUsers?.includes(profile?.username)
                  ? true
                  : false,
              resizable: false,
              width: 150,
              preProcessEditCellProps: (
                params: GridPreProcessEditCellProps
              ) => ({
                ...params.props,
                error: params.props.value
                  ? params.props.value.length > 20
                  : false,
              }),
            },
            {
              field: "lastName",
              headerName: "Last Name",
              align: "center",
              headerAlign: "center",
              editable:
                permissions?.readWriteRoles?.includes(profile?.role) &&
                permissions?.readWriteUsers?.includes(profile?.username)
                  ? true
                  : false,
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
              editable:
                permissions?.readWriteRoles?.includes(profile?.role) &&
                permissions?.readWriteUsers?.includes(profile?.username)
                  ? true
                  : false,
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
              editable:
                permissions?.readWriteRoles?.includes(profile?.role) &&
                permissions?.readWriteUsers?.includes(profile?.username)
                  ? true
                  : false,
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
              editable:
                permissions?.readWriteRoles?.includes(profile?.role) &&
                permissions?.readWriteUsers?.includes(profile?.username)
                  ? true
                  : false,
              resizable: false,
              valueOptions: data?.roles,
              width: 100,
            },
            {
              field: "reasonForDeactivation",
              headerName: "Reason For De-activation",
              disableColumnMenu: true,
              filterable: false,
              pinnable: false,
              sortable: false,
              width: 300,
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
            {
              type: "isActive",
              field: "isActive",
              headerName: "Is Active?",
              align: "center",
              headerAlign: "center",
              width: 100,
              renderCell: ({ row: { id, isActive } }) => (
                <DataGridSwitch
                  id={id}
                  isChecked={isActive}
                  field="isActive"
                  profile={profile}
                  apiUrl={`${apiUrl}?scope=users`}
                  permissions={permissions}
                  setData={setData}
                  handleGetData={handleGetData}
                />
              ),
              filterOperators: booleanFilter,
            },
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
                      disabled={
                        !permissions?.readWriteRoles?.includes(profile?.role) &&
                        !permissions?.readWriteUsers?.includes(
                          profile?.username
                        )
                      }
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
