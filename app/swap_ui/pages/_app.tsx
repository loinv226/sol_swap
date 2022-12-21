import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ErrorBoundary } from "../components/layout/error_boundary";
import AppThemeProvider from "../components/layout/theme_provider";
import { StoreProvider } from "../components/layout/store_provider";
import AppWalletProvider from "../components/layout/wallet_provider";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ErrorBoundary>
      <AppThemeProvider>
        <StoreProvider>
          <AppWalletProvider>
            <Component {...pageProps} />
          </AppWalletProvider>
        </StoreProvider>
      </AppThemeProvider>
    </ErrorBoundary>
  );
}

export default MyApp;
