import "./globals.css";

import { ThemeProvider } from "@/components/theme-provider";
import { AppAlertProvider } from "@/components/ui/app-alert";
import { OperationsProvider } from "@/lib/operations-store";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className="theme-loading"
    >
      <body>
        <ThemeProvider>
          <OperationsProvider>
            <AppAlertProvider>
              {children}
            </AppAlertProvider>
          </OperationsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}