import { FC, ReactNode, useEffect, useState } from "react";
import { darkTheme, lightTheme } from "../theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { useTheme } from "next-themes";

const ThemeProviderMui: FC<{ children: ReactNode }> = ({ children }) => {
    const [mounted, setMounted] = useState(false);
    const { resolvedTheme} = useTheme();

    useEffect(() => setMounted(true), []);

    if (!mounted) {
        return null;
    }


    return (
        <ThemeProvider theme={resolvedTheme == "dark" ? darkTheme : lightTheme}>
            {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
            <CssBaseline />
            {children}
        </ThemeProvider>
    );
};

export default ThemeProviderMui;