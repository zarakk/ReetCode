import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
    text: {
      primary: "#fff",
      secondary: "#aaa",
    },
  },
  typography: {
    h4: {
      color: "text.primary",
    },
  },
});
export default theme;
