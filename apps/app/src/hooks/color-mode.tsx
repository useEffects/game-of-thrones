import { useContext } from "react";
import { ColorModeContext } from "src/context/color-mode";

export default function useColorMode() {
    return useContext(ColorModeContext);
}