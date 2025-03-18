import React, {useState, useEffect} from "react";
import { RouterProvider } from "react-router-dom";
import {routes} from "./routes/routes";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";

function App() {

  const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  const [MyMode, setMyMode] = useState(
    localStorage.getItem("currentMode") || (systemPrefersDark ? "dark" : "light")
  );

  useEffect(() => {
    localStorage.setItem("currentMode", MyMode);
  }, [MyMode]);

  const theme = createTheme({
    palette: {
      mode: MyMode,
    },
  })

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline/>
      <RouterProvider router={routes(setMyMode)} />
    </ThemeProvider>
  );
}

export default App;
