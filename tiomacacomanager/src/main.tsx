import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import { ThemeProvider, createTheme } from "@mui/material/styles"
import App from "./App"

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2"
    }
  }
})

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
)
