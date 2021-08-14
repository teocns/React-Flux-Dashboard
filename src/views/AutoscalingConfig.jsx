import PauseIcon from "@material-ui/icons/Pause";
import { Link as RouterLink } from "react-router-dom";
import HelpOutlineIcon from "@material-ui/icons/HelpOutline";
import CrawlerControlApi from "../api/CrawlerControl";
import { number_format } from "../helpers/numbers";
import {
  Button,
  Divider,
  FormControl,
  Tooltip,
  TextField,
  InputAdornment,
  Grid,
  Typography,
  OutlinedInput,
  ButtonGroup,
  CircularProgress,
} from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import TableContainer from "@material-ui/core/TableContainer";
import SearchIcon from "@material-ui/icons/Search";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import DomainsManagementTable from "../components/Tables/DomainsManagement";
import UserFilterComponent from "../components/Filters/UserFilter";
import sessionStore from "../store/session";
import MultiFilter from "../components/Filters/MultiFilter";
import { TextFieldsOutlined } from "@material-ui/icons";
const useStyles = makeStyles({
  table: {
    minWidth: 500,
  },
  tableContainer: {
    overflow: "hidden",
    overflowY: "hidden",
    display: "flex",
    flexDirection: "column",
  },
});
let filterTimeout = undefined;

export default function CrawlerControlCenter(props) {
  const [Config, setConfig] = useState(null);

  //const [CrawlerThreadsData, setCrawlerThreadsData] = useState();

  const theme = useTheme();

  const fetchData = () => {
    CrawlerControlApi.GetAutoscalingConfig().then((data) => {
      setConfig(data);
    });
  };

  const save = () => {
    if (window.confirm("Are you sure you accept the changes?")) {
      CrawlerControlApi.SaveConfig(Config).then(() => {
        props.history.goBack();
      });
    }
  };

  const render = () => {
    if (!Config) {
      return <CircularProgress />;
    }
    return (
      <Paper
        style={{
          padding: theme.spacing(1),
        }}
      >
        <div>
          <ButtonGroup>
            <Button
              onClick={() => {
                props.history.goBack();
              }}
            >
              ABORT
            </Button>

            <Button onClick={save}>SAVE {"&"} EXIT</Button>
          </ButtonGroup>
        </div>
        <Grid container style={{ marginTop: theme.spacing(2) }}>
          <Grid item xs={6}>
            <TextField
              fullWidth
              variant="outlined"
              label="SCRAPER Autoscaling Group Codename"
              onChange={(event) => {
                let d = { ...Config };
                d.SCRAPER.codename = event.target.value;
                setConfig(d);
              }}
              required
              value={Config.SCRAPER.codename}
            ></TextField>
          </Grid>
          <Grid item xs={6}>
            <TextField
              variant="outlined"
              type="number"
              label="Per distribution capacity"
              onChange={(event) => {
                let d = { ...Config };
                d.SCRAPER.capacity = event.target.value;
                setConfig(d);
              }}
              min={1}
              max={999999}
              step={1}
              value={Config.SCRAPER.capacity}
            ></TextField>
          </Grid>
        </Grid>

        <Grid container style={{ marginTop: theme.spacing(2) }}>
          <Grid item xs={6}>
            <TextField
              fullWidth
              variant="outlined"
              label="SPIDER Autoscaling Group Codename"
              onChange={(event) => {
                let d = { ...Config };
                d.SPIDER.codename = event.target.value;
                setConfig(d);
              }}
              required
              value={Config.SPIDER.codename}
            ></TextField>
          </Grid>
          <Grid item xs={6}>
            <TextField
              variant="outlined"
              type="number"
              label="Per distribution capacity"
              onChange={(event) => {
                let d = { ...Config };
                d.SPIDER.capacity = event.target.value;
                setConfig(d);
              }}
              min={1}
              max={999999}
              step={1}
              value={Config.SPIDER.capacity}
            ></TextField>
          </Grid>
        </Grid>

        <Grid container style={{ marginTop: theme.spacing(2) }}>
          <Grid item xs={6}>
            <TextField
              fullWidth
              variant="outlined"
              label="PROCESSOR Autoscaling Group Codename"
              onChange={(event) => {
                let d = { ...Config };
                d.PROCESSOR.codename = event.target.value;
                setConfig(d);
              }}
              required
              value={Config.PROCESSOR.codename}
            ></TextField>
          </Grid>
          <Grid item xs={6}>
            <TextField
              variant="outlined"
              type="number"
              label="Per distribution capacity"
              onChange={(event) => {
                let d = { ...Config };
                d.PROCESSOR.capacity = event.target.value;
                setConfig(d);
              }}
              min={1}
              max={999999}
              step={1}
              value={Config.PROCESSOR.capacity}
            ></TextField>
          </Grid>
        </Grid>
      </Paper>
    );
  };
  useEffect(() => {
    fetchData();
  }, []);

  return render();
}
