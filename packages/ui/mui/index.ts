import { PaletteOptions, ThemeOptions, createTheme } from '@mui/material';

const baseConfig: ThemeOptions = {
    components: {
        MuiButton: {
            defaultProps: {
                variant: "text"
            },
        }
    }
}

const darkThemePalette: PaletteOptions = {
    mode: 'dark',
    primary: {
        main: '#73EEF8',
    },
    secondary: {
        main: '#EE21FF',
    },
    background: {
        default: '#000000',
        paper: '#121212',
    },
};

const lightThemePalette: PaletteOptions = {
    mode: 'light',
    primary: {
        main: '#057077',
    },
    secondary: {
        main: '#8A0094',
    },
    background: {
        default: '#ffffff',
        paper: '#F9F9F9',
    },
}

export const darkTheme: ThemeOptions = createTheme({
    ...baseConfig,
    palette: darkThemePalette
});
export const lightTheme: ThemeOptions = createTheme({
    ...baseConfig,
    palette: lightThemePalette
});