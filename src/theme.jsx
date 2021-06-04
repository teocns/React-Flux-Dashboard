import {
  createMuiTheme,
  makeStyles,
  ThemeProvider,
} from "@material-ui/core/styles";
const theme = createMuiTheme({
  typography: {
    fontSize: 12,
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
  overrides: {
    MuiTooltip: {
      tooltip: {
        fontSize: 13,
      },
    },
  },
});

export default theme;
