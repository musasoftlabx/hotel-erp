import { BiReset } from "react-icons/bi";
// * React
import { useState } from "react";

// * NPM
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

// * MUI
import { green, grey, red } from "@mui/material/colors";
import {
  GridRowSelectionModel,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarFilterButton,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid-pro";
import LoadingButton from "@mui/lab/LoadingButton";
import Badge from "@mui/material/Badge";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import Popover from "@mui/material/Popover";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

// * Components
import { tDataGridSlots } from "./DataGridSlots";
import { TextFieldX } from "../InputFields/TextFieldX";
//import Confirm from "@/components/Shared/Confirm";

// * Store
//import { useAlertStore, useConfirmStore, useSnackBarStore } from "@/store";

// * Icons
import {
  BiCheckDouble,
  BiExport,
  BiFilter,
  BiSearchAlt2,
} from "react-icons/bi";
import { FaToggleOn, FaToggleOff } from "react-icons/fa";
import { MdAdd, MdSearch } from "react-icons/md";
import { MdDeselect } from "react-icons/md";
import { RiDeleteBinLine } from "react-icons/ri";
import { SlRefresh } from "react-icons/sl";

export const sx = {
  borderRadius: 3,
  fontFamily: "Rubik",
  px: { lg: 2, md: 3, sm: 2.5, xs: 3 },
  textTransform: "capitalize",
  whiteSpace: "nowrap",
  ":hover": { background: green[500], color: "#fff" },
};

export const ExportTooltip = ({
  children,
}: {
  children: React.ReactElement;
}) => (
  <Tooltip
    title={
      <>
        <Typography variant="body2" mb={1}>
          Note that exporting the data without any filters will export the whole
          dataset! To export only a subset of data, use:
        </Typography>
        <Chip
          color="primary"
          size="small"
          label={
            <Stack direction="row" alignItems="center">
              <BiFilter size={20} />
              <Typography variant="caption">Filters</Typography>
            </Stack>
          }
          sx={{ borderRadius: 1 }}
        />{" "}
        or{" "}
        <Chip
          variant="outlined"
          size="small"
          label={
            <Stack direction="row" alignItems="center">
              <BiSearchAlt2 size={16} />
              <Typography variant="caption">Search</Typography>
            </Stack>
          }
          sx={(theme) =>
            theme.palette.mode === "dark"
              ? {
                  borderRadius: 1,
                  border: "1px solid white",
                  color: "white",
                }
              : { borderRadius: 1, background: "white", color: "white" }
          }
        />
      </>
    }
  >
    {children}
  </Tooltip>
);

export const Separator = ({ ml, mt }: { ml?: number; mt?: number }) => (
  <Typography variant="h6" ml={ml ?? 1} mr={1} mt={mt}>
    ·
  </Typography>
);

export default function DataGridToolbar({
  apiRef,
  apiUrl,
  changeFilters,
  changeRowSelection,
  exclude,
  exportURL,
  handleGetData,
  isExporting,
  isLoading,
  setIsExporting,
  setIsAddModalOpen,
  search,
  stats,
  changeStats,
  extraActions,
}: tDataGridSlots) {
  // ? Hooks
  const confirmOperation = useConfirmStore((state) => state.operation);
  const showAlert = useAlertStore((state) => state.alert);
  const showConfirm = useConfirmStore((state) => state.alert);
  const closeConfirm = useConfirmStore((state) => state.close);
  const setSnackBar = useSnackBarStore((state) => state.setSnackBar);

  // ? States
  const [multiRejectAnchorEl, setMultiRejectAnchorEl] =
    useState<HTMLButtonElement | null>(null);
  const [multiRejectionReason, setMultiRejectionReason] = useState<string>();

  // ? Mutations
  const { mutate: deleteData } = useMutation((body: GridRowSelectionModel) =>
    axios.delete(`${apiUrl}`, { data: body })
  );
  const { mutate: resetPassword } = useMutation((body: GridRowSelectionModel) =>
    axios.put(apiUrl, body)
  );
  const { mutate: multiAction } = useMutation(
    (body: { action: string; ids: GridRowSelectionModel; feedback?: string }) =>
      axios.put(apiUrl, body)
  );

  // ? Constants
  const filters = apiRef.current.state.filter.filterModel.items;
  const rowSelection = apiRef.current.state.rowSelection;

  // ? Functions
  const SelectionsTooltip = ({
    children,
  }: {
    children: React.ReactElement;
  }) => (
    <Tooltip
      arrow
      title={
        <Stack sx={{ px: 2, py: 1 }}>
          <Typography variant="body2" flex={0.75} mb={1}>
            Selected rows
          </Typography>
          <Typography variant="caption" flex={0.75} mb={1}>
            {rowSelection?.join(", ")}
          </Typography>
          <Button
            variant="outlined"
            color="warning"
            onClick={() =>
              changeFilters({
                items: [
                  {
                    field: "id",
                    id: Math.ceil(Math.random() * 100000),
                    operator: "isAnyOf",
                    value: rowSelection,
                  },
                ],
              })
            }
            sx={{
              color: "#fff",
              fontSize: 12,
              fontWeight: 600,
              ":hover": {
                textDecoration: "underline",
                color: green[100],
              },
            }}
          >
            VIEW SELECTED ROWS
          </Button>
        </Stack>
      }
    >
      {children}
    </Tooltip>
  );

  return (
    <>
      <Confirm
        handleConfirm={() => {
          closeConfirm();
          switch (confirmOperation) {
            case "reset":
              resetPassword(rowSelection, {
                onSuccess: () => {
                  showAlert({
                    status: "success",
                    subject: "Password reset!",
                    body: `Password was reset and sent to the user.`,
                  });
                  changeRowSelection([]);
                },
                onError: (error: any) =>
                  showAlert({
                    status: "error",
                    subject: error.response.data.subject || "Reset Error!",
                    body:
                      error.response.data.body ||
                      "An issue occurred while attempting to reset password. Please try again.",
                  }),
              });
              break;
            case "delete":
              deleteData(rowSelection, {
                onSuccess: ({ data }) => {
                  setSnackBar({
                    duration: 3000,
                    message: `${apiUrl}${
                      data.length === 1 ? "" : "s"
                    } deleted!`,
                  });
                  changeRowSelection([]);
                  handleGetData();
                },
                onError: () =>
                  showAlert({
                    status: "error",
                    subject: "Deletion Error!",
                    body: `Error occurred while attempting to delete item`,
                  }),
              });
              break;
            case "multiAction":
              multiAction(
                { action: "multi-approve", ids: rowSelection },
                {
                  onSuccess: ({ data }) => {
                    setSnackBar({
                      status: "success",
                      duration: 3000,
                      message: `row${data.length === 1 ? "" : "s"} approved!`,
                    });
                    changeRowSelection([]);
                    handleGetData();
                  },
                  onError: () =>
                    showAlert({
                      status: "error",
                      subject: "Multi-Approval Error!",
                      body: `Error occurred while attempting to approve record(s)`,
                    }),
                }
              );
          }
        }}
        handleCancel={() => {
          changeRowSelection([]);
          closeConfirm();
        }}
        okText="YES"
        cancelText="NO"
      />

      <GridToolbarContainer
        sx={{
          minHeight: rowSelection?.length > 0 ? "47px" : "20px !important",
          maxHeight: rowSelection?.length > 0 ? "47px" : "42px !important",
          overflowX: "scroll",
          overflowY: "hidden",
          pb: 3,
          "&::-webkit-scrollbar, & *::-webkit-scrollbar": { height: 3 },
          "&::-webkit-scrollbar-thumb:focus": { bgcolor: "#50cc7f" },
        }}
      >
        <Stack
          direction="row"
          divider={<Separator mt={rowSelection?.length > 0 ? -0.1 : -0.1} />}
        >
          {/* // ? Add item */}
          {!exclude?.includes("add") && (
            <Button
              size="small"
              startIcon={<MdAdd />}
              onClick={() => setIsAddModalOpen((prev: any) => !prev)}
              sx={sx}
            >
              Add
            </Button>
          )}

          {/* // ? Refresh */}
          <LoadingButton
            size="small"
            startIcon={<SlRefresh />}
            onClick={handleGetData}
            loading={isLoading}
            disabled={isLoading}
            sx={sx}
          >
            Refresh
          </LoadingButton>

          {/* // ? Filter */}
          {!exclude?.includes("filtering") && (
            <GridToolbarFilterButton
              componentsProps={{
                button: {
                  variant: filters.length > 0 ? "contained" : "text",
                },
              }}
              sx={[sx, { "& .MuiBadge-badge": { bgcolor: "orange" } }]}
            />
          )}

          {/* // ? Multi-approve */}
          {!exclude?.includes("multiApprove") && rowSelection?.length > 0 && (
            <SelectionsTooltip>
              <Badge
                badgeContent={rowSelection.length}
                sx={(theme) => ({
                  ".MuiBadge-badge": {
                    color: "white !important",
                    fontWeight: "bold",
                    background: green[400],
                    border: `2px solid ${theme.palette.background.paper}`,
                    top: 6,
                  },
                })}
              >
                <Button
                  key={7}
                  startIcon={<BiCheckDouble />}
                  sx={[
                    sx,
                    {
                      background: green[400],
                      color: "#fff",
                      ":hover": { background: green[600] },
                    },
                  ]}
                  onClick={() =>
                    showConfirm({
                      operation: "multi-approve",
                      status: "info",
                      subject: `Confirm approval`,
                      body: `Are you sure you intend to multi-approve the selected rows?`,
                    })
                  }
                >
                  Multi-Approve
                </Button>
              </Badge>
            </SelectionsTooltip>
          )}

          {/* // ? Multi-reject */}
          {!exclude?.includes("multiReject") && rowSelection?.length > 0 && (
            <>
              <Popover
                open={Boolean(multiRejectAnchorEl)}
                anchorEl={multiRejectAnchorEl}
                onClose={() => setMultiRejectAnchorEl(null)}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
              >
                <Stack justifyContent="end">
                  <TextFieldX
                    label="Reason for rejection *"
                    columnspan={{ xs: 12 }}
                    inputProps={{ maxLength: 100 }}
                    multiline
                    rows={2}
                    value={multiRejectionReason}
                    onChange={(e: any) =>
                      setMultiRejectionReason(e.target.value)
                    }
                  />

                  <Button
                    variant="text"
                    size="small"
                    onClick={() => {
                      multiAction(
                        {
                          action: "multi-reject",
                          ids: rowSelection,
                          feedback: multiRejectionReason,
                        },
                        {
                          onSuccess: () => {
                            setSnackBar({
                              status: "success",
                              duration: 3000,
                              message: "Rejected!",
                            });
                            changeRowSelection([]);
                            handleGetData();
                          },
                          onError: () =>
                            setSnackBar({
                              status: "error",
                              duration: 3000,
                              message: "Failed to reject!",
                            }),
                        }
                      );
                      setMultiRejectAnchorEl(null);
                    }}
                    sx={{ alignSelf: "end", mt: -1 }}
                  >
                    SUBMIT
                  </Button>
                </Stack>
              </Popover>

              <SelectionsTooltip>
                <Badge
                  badgeContent={rowSelection.length}
                  sx={(theme) => ({
                    ".MuiBadge-badge": {
                      color: "white !important",
                      fontWeight: "bold",
                      background: red[400],
                      border: `2px solid ${theme.palette.background.paper}`,
                      top: 6,
                    },
                  })}
                >
                  <Button
                    key={7}
                    startIcon={<BiCheckDouble />}
                    sx={[
                      sx,
                      {
                        background: red[400],
                        color: "#fff",
                        ":hover": { background: red[600] },
                      },
                    ]}
                    onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
                      setMultiRejectAnchorEl(e.currentTarget)
                    }
                  >
                    Multi-Reject
                  </Button>
                </Badge>
              </SelectionsTooltip>
            </>
          )}

          {!exclude?.includes("multiDelete") && rowSelection?.length > 0 && (
            <SelectionsTooltip>
              <Badge
                badgeContent={rowSelection.length}
                sx={(theme) => ({
                  ".MuiBadge-badge": {
                    color: "white !important",
                    fontWeight: "bold",
                    background: red[400],
                    border: `2px solid ${theme.palette.background.paper}`,
                    top: 6,
                  },
                })}
              >
                <Button
                  key={7}
                  startIcon={<RiDeleteBinLine />}
                  sx={[
                    sx,
                    {
                      background: red[400],
                      color: "#fff",
                      ml: 1.5,
                      py: 0,
                      ":hover": { background: red[600] },
                    },
                  ]}
                  onClick={() =>
                    showConfirm({
                      operation: "delete",
                      status: "info",
                      subject: `Confirm deletion`,
                      body: `Are you sure you intend to delete the selected rows?`,
                    })
                  }
                >
                  Multi-Delete
                </Button>
              </Badge>
            </SelectionsTooltip>
          )}

          {/* // ? Deselect all */}
          {!exclude?.includes("deselectAll") && rowSelection?.length > 0 && (
            <Button
              startIcon={<MdDeselect />}
              sx={[
                sx,
                {
                  background: grey[400],
                  color: "#fff",
                  ":hover": { background: grey[700] },
                },
              ]}
              onClick={() => changeRowSelection([])}
            >
              De-select all
            </Button>
          )}

          {/* // ? Toggle stats */}
          {!exclude?.includes("toggleStats") && (
            <Button
              size="small"
              startIcon={stats ? <FaToggleOn /> : <FaToggleOff />}
              onClick={() => changeStats && changeStats(!stats)}
              sx={sx}
            >
              Toggle stats
            </Button>
          )}

          {extraActions}

          {!exclude?.includes("columns") && (
            <GridToolbarColumnsButton sx={sx} />
          )}

          {!exclude?.includes("exporting") && exportURL && (
            <ExportTooltip>
              <LoadingButton
                size="small"
                startIcon={<BiExport />}
                loading={isExporting}
                disabled={isExporting}
                sx={sx}
                onClick={() => {
                  setIsExporting(true);
                  axios
                    .get(exportURL)
                    .then(({ data }) => {
                      location.href = data;
                      setIsExporting(false);
                    })
                    .catch((e) => {
                      setIsExporting(false);
                      showAlert({
                        status: "error",
                        subject: "Export error!",
                        body:
                          e.message ||
                          "Error occurred while attempting to export users",
                      });
                    });
                }}
              >
                Export
              </LoadingButton>
            </ExportTooltip>
          )}
        </Stack>

        <Grid flexGrow={1} />

        {!exclude?.includes("resetDefaults") && exportURL && (
          <Tooltip title="This will reset page components such as pagination, sorting, filters, row selections.">
            <LoadingButton
              size="small"
              startIcon={<BiReset />}
              loading={isExporting}
              disabled={isExporting}
              sx={sx}
              onClick={() => {
                localStorage.removeItem(`_${apiUrl}_filtered_columns`);
                localStorage.removeItem(`____${apiUrl}_pagination`);
                localStorage.removeItem(`_${apiUrl}_pinned_columns`);
                localStorage.removeItem(`_${apiUrl}_selected_rows`);
                localStorage.removeItem(`_${apiUrl}_sorted_columns`);
                localStorage.removeItem(`_${apiUrl}_state`);
                localStorage.removeItem(`_${apiUrl}_visible_columns`);
                localStorage.removeItem(`_${apiUrl}_stats`);
                location.reload();
              }}
            >
              Reset Defaults
            </LoadingButton>
          </Tooltip>
        )}

        {!exclude?.includes("search") && (
          <GridToolbarQuickFilter
            debounceMs={2000}
            variant="filled"
            size="small"
            hiddenLabel
            InputProps={{
              disableUnderline: true,
              startAdornment: <MdSearch size={25} opacity={0.7} />,
              placeholder: search?.fields
                ? `Search by (${search?.fields})`
                : "Search...",
            }}
            sx={(theme) => ({
              background: "transparent",
              borderRadius: 3,
              borderWidth: 1,
              borderStyle: "solid",
              borderColor:
                theme.palette.mode === "light" ? "divider" : "action.disabled",
              height: 40,
              mt: -1.2,
              overflow: "hidden",
              width: search?.width ?? 260,
              ".MuiInputBase-root": { background: "transparent" },
            })}
          />
        )}
      </GridToolbarContainer>
    </>
  );
}
