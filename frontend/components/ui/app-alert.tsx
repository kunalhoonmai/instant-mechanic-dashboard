"use client";

import * as React from "react";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import type { AlertColor } from "@mui/material/Alert";

import { useTheme } from "@/components/theme-provider";

interface AppAlertContextValue {
  showAlert: (
    message: string,
    severity?: AlertColor
  ) => void;
  hideAlert: () => void;
}

const AppAlertContext =
  React.createContext<AppAlertContextValue | undefined>(
    undefined
  );

export function AppAlertProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { resolvedTheme } = useTheme();

  const [alert, setAlert] = React.useState<{
    message: string;
    severity: AlertColor;
  } | null>(null);

  const showAlert = React.useCallback(
    (
      message: string,
      severity: AlertColor = "success"
    ) => {
      setAlert({
        message,
        severity,
      });
    },
    []
  );

  const hideAlert = React.useCallback(() => {
    setAlert(null);
  }, []);

  const isDark = resolvedTheme === "dark";

  return (
    <AppAlertContext.Provider
      value={{
        showAlert,
        hideAlert,
      }}
    >
      {children}

      {alert && (
        <Snackbar
          open
          autoHideDuration={4000}
          onClose={hideAlert}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          sx={{
            mb: {
              xs: 2,
              sm: 3,
            },
            mr: {
              xs: 2,
              sm: 3,
            },
            ml: {
              xs: 2,
              sm: "auto",
            },
            maxWidth: {
              xs: "calc(100vw - 32px)",
              sm: 440,
            },
            zIndex: 9999,
          }}
        >
          <Alert
            onClose={hideAlert}
            severity={alert.severity}
            variant="filled"
            elevation={6}
            sx={{
              width: "100%",
              borderRadius: "12px",
              fontSize: "0.875rem",
              fontWeight: 500,
              alignItems: "center",
              boxShadow: isDark
                ? "0 12px 32px rgba(0, 0, 0, 0.45)"
                : "0 12px 32px rgba(15, 23, 42, 0.18)",
              "& .MuiAlert-icon": {
                alignItems: "center",
              },
              "& .MuiAlert-action": {
                alignItems: "center",
                paddingTop: 0,
                paddingBottom: 0,
              },
              "& .MuiIconButton-root": {
                cursor: "pointer",
              },
            }}
          >
            {alert.message}
          </Alert>
        </Snackbar>
      )}
    </AppAlertContext.Provider>
  );
}

export function useAppAlert() {
  const context =
    React.useContext(AppAlertContext);

  if (!context) {
    throw new Error(
      "useAppAlert must be used inside AppAlertProvider"
    );
  }

  return context;
}