import React, { useContext } from "react";
import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import { darkTheme, lightTheme } from "../../config/theme.config";

type ThemeMode = "light" | "dark";
type ThemeContextType = {
  toggleThemeMode: () => void;
  mode: ThemeMode;
};
const ThemeModeContext = React.createContext<ThemeContextType>({
  toggleThemeMode: () => {},
  mode: "dark",
});
export const useThemeMode = () => useContext(ThemeModeContext);

export default function AppThemeProvider(props: any) {
  const [mode, setMode] = React.useState<ThemeMode>(() => {
    if (typeof window !== "undefined") {
      const localMode = localStorage.getItem("mode");
      if (localMode === "light" || localMode === "dark") {
        return localMode;
      }
    }
    return "dark";
  });
  const theme = React.useMemo(
    () => (mode === "light" ? lightTheme : darkTheme),
    [mode]
  );

  return (
    <ThemeModeContext.Provider
      value={{
        toggleThemeMode: () => {
          setMode((prevMode) => {
            const newMode = prevMode === "light" ? "dark" : "light";
            localStorage.setItem("mode", newMode);
            return newMode;
          });
        },
        mode,
      }}
    >
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <ChakraProvider theme={theme}>{props.children}</ChakraProvider>
    </ThemeModeContext.Provider>
  );
}
