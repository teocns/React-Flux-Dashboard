import {
  createMuiTheme,
  makeStyles,
  ThemeProvider,
} from "@material-ui/core/styles";
const theme = createMuiTheme({
  typography: {
    fontSize: 14,
  },
  palette: {
    primary: {
      main: "#4b4f56",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#f2902b",
      contrastText: "#ffffff",
    },
  },
});

export default theme;
