import { Dispatch, ReactNode, SetStateAction, createContext, useState } from "react";

export const ColorModeContext = createContext<{
    colorMode: ColorMode;
    setColorMode: Dispatch<SetStateAction<ColorMode>>;
}>({
    colorMode: 'dark',
    setColorMode: () => { }
})

export const ColorModeProvider = ({ children }: { children: ReactNode }) => {
    const [colorMode, setColorMode] = useState<ColorMode>("auto");

    return <ColorModeContext.Provider value={{ colorMode, setColorMode }}>
        {children}
    </ColorModeContext.Provider>
}

export type ColorMode = "light" | "dark" | "auto";