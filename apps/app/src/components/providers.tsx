import { ReactNode, useMemo } from "react";
import { ColorModeProvider } from "src/context/color-mode";
import { CssBaseline, ThemeProvider as MuiThemeProvider, useMediaQuery } from "@mui/material";
import useColorMode from "src/hooks/color-mode";
import { darkTheme, lightTheme } from "ui/mui";

export default function Providers({ children }: { children: ReactNode }) {
    return <ColorModeProvider>
        <ThemeProvider>
            {children}
        </ThemeProvider>
    </ColorModeProvider>
}

function ThemeProvider({ children }: { children: ReactNode }) {
    const { colorMode } = useColorMode();
    console.log(colorMode)
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

    const theme = useMemo(() => {
        if (colorMode === 'auto') {
            return prefersDarkMode ? darkTheme : lightTheme;
        } else if (colorMode === 'dark') return darkTheme;
        else return lightTheme;
    }, [colorMode, prefersDarkMode])

    return <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
    </MuiThemeProvider>
}