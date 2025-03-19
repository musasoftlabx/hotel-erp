"use client";

import {
  Box,
  Chip,
  createTheme,
  Menu,
  MenuItem,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { AppProvider, Navigation } from "@toolpad/core/AppProvider";
import { PageContainer } from "@toolpad/core/PageContainer";
import {
  DashboardLayout,
  SidebarFooterProps,
  ThemeSwitcher,
} from "@toolpad/core/DashboardLayout";
import { useDemoRouter } from "@toolpad/core/internal";
import { useRouter } from "next/router";
import { Fragment, useState } from "react";
import Users from "../users/page";

// import DashboardIcon from '@mui/icons-material/Dashboard';
// import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
// import BarChartIcon from '@mui/icons-material/BarChart';
// import DescriptionIcon from '@mui/icons-material/Description';
// import LayersIcon from '@mui/icons-material/Layers';

const demoTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: "data-toolpad-color-scheme",
  },
  colorSchemes: { light: true, dark: true },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});

function DemoPageContent({ pathname }: { pathname: string }) {
  return (
    <Box
      sx={{
        py: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <Typography>Dashboard content for {pathname}</Typography>
    </Box>
  );
}

export default function layout() {
  const [popoverAnchorEl, setPopoverAnchorEl] =
    useState<HTMLButtonElement | null>(null);

  const isPopoverOpen = Boolean(popoverAnchorEl);
  const popoverId = isPopoverOpen ? "simple-popover" : undefined;

  const handlePopoverButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.stopPropagation();
    setPopoverAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setPopoverAnchorEl(null);
  };

  const popoverMenuAction = (
    <Fragment>
      {/* <IconButton aria-describedby={popoverId} onClick={handlePopoverButtonClick}>
      <MoreHorizIcon />
    </IconButton> */}
      <Menu
        id={popoverId}
        open={isPopoverOpen}
        anchorEl={popoverAnchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        disableAutoFocus
        disableAutoFocusItem
      >
        <MenuItem onClick={handlePopoverClose}>New call</MenuItem>
        <MenuItem onClick={handlePopoverClose}>Mark all as read</MenuItem>
      </Menu>
    </Fragment>
  );

  const NAVIGATION: Navigation & { page?: React.ReactNode } = [
    {
      kind: "header",
      title: "Main items",
    },
    {
      segment: "dashboard",
      title: "Dashboard",
      action: popoverMenuAction,
      //icon: <DashboardIcon />,
    },
    {
      segment: "users",
      title: "Users",
      action: <Chip label={7} color="primary" size="small" />,
      //icon: <ShoppingCartIcon />,
    },
    {
      kind: "divider",
    },
    {
      kind: "header",
      title: "Analytics",
    },
    {
      segment: "reports",
      title: "Reports",
      //icon: <BarChartIcon />,
      children: [
        {
          segment: "sales",
          title: "Sales",
          //icon: <DescriptionIcon />,
        },
        {
          segment: "traffic",
          title: "Traffic",
          //icon: <DescriptionIcon />,
        },
      ],
    },
    {
      segment: "integrations",
      title: "Integrations",
      //icon: <LayersIcon />,
    },
  ];

  //const router = useRouter();

  //     <AppProvider
  //   navigation={NAVIGATION}
  //   theme={theme}
  //   branding={BRANDING}
  //   router={router}
  //   authentication={AUTHENTICATION}
  //   session={session}
  // >
  //   {props.children}
  // </AppProvider>
  return (
    <AppProvider
      navigation={NAVIGATION}
      //router={router}
      theme={demoTheme}
      branding={{
        logo: <img src="/images/logo.webp" alt="MUI logo" />,
        title: "Palace Istanbul",
        homeUrl: "/",
      }}
      //window={demoWindow}
    >
      <DashboardLayout
        slots={{
          appTitle: () => {
            return (
              <Stack direction="row" alignItems="center" spacing={2}>
                <img
                  src="/images/logo.webp"
                  alt="MUI logo"
                  style={{ height: 30, width: 30 }}
                />
                <Typography variant="h6" fontFamily="Montez" fontSize={30}>
                  Palace Instanbul
                </Typography>
                <Chip size="small" label="BETA" color="info" />
                {/* <Tooltip title="Connected to production">
                  <CheckCircleIcon color="success" fontSize="small" />
                </Tooltip> */}
              </Stack>
            );
          },
          toolbarActions: () => (
            <Stack>
              {" "}
              <ThemeSwitcher />
            </Stack>
          ),
          sidebarFooter: ({ mini }: SidebarFooterProps) => {
            return (
              <Typography
                variant="caption"
                sx={{ m: 1, whiteSpace: "nowrap", overflow: "hidden" }}
              >
                {mini
                  ? "© MUI"
                  : `© ${new Date().getFullYear()} Made with love by MUI`}
              </Typography>
            );
          },
        }}
      >
        <Paper sx={{ width: "100%" }}>
          <PageContainer>Page content</PageContainer>
        </Paper>
      </DashboardLayout>
    </AppProvider>
  );
}
