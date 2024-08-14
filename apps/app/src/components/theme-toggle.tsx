import AutoModeIcon from '@mui/icons-material/AutoMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import useColorMode from "src/hooks/color-mode";
import { ColorMode } from 'src/context/color-mode';
import { IconButton, SvgIconProps } from '@mui/material';

export default function ThemeToggle() {
    const { colorMode: currentColorMode, setColorMode } = useColorMode();

    return <>
        {colorModes.map(colorMode => <IconButton key={colorMode} onClick={() => setColorMode(colorMode)}>
            <RenderIcon mode={colorMode} color={colorMode === currentColorMode ? "primary" : "action"} />
        </IconButton>)}
    </>
}

function RenderIcon({ mode, ...iconProps }: { mode: ColorMode } & SvgIconProps) {
    const iconMap: Record<ColorMode, React.ReactElement> = {
        light: <LightModeIcon {...iconProps} />,
        dark: <DarkModeIcon {...iconProps} />,
        auto: <AutoModeIcon {...iconProps} />
    };

    return iconMap[mode];
}

const colorModes = ['light', 'dark', 'auto'] as ColorMode[];