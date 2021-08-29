//@ts-check
import {
  Button,
  Divider,
  FormControl,
  InputAdornment,
  OutlinedInput,
  Typography,
} from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import TableContainer from "@material-ui/core/TableContainer";
import AddCircleIcon from "@material-ui/icons/Add";
import LinkIcon from "@material-ui/icons/Link";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import scrapingThreadsActions from "../actions/ScrapingThread";
import SpinnerGrow from "../components/SpinnerGrow";
import AddTrackUrlTable from "../components/Tables/AddTrackUrl";
import urlHelpers from "../helpers/url";

function createData(name, calories, fat) {
  return { name, calories, fat };
}

const useStyles = makeStyles({
  root: {
    display: "flex",
    overflowY: "hidden",
    padding: 2,
  },
  tableContainer: {
    overflow: "hidden",
    overflowY: "hidden",
    display: "flex",
    flexDirection: "column",
  },
});
let lastChanged = null;

/**
 * @typedef {Object} InputValue
 * @property {string} inputValue
 * @property {string} hostName
 */

export default function CustomPaginationActionsTable() {
  /**
   * @type {[InputValue, CallableFunction]}
   */
  const [UrlInputValue, setUrlInputValue] = useState("");

  const hostName = UrlInputValue.hostName;

  console.log(hostName);

  //const [Host, setHost] = useState(hostsStore.getByName(hostName));

  const classes = useStyles();

  const history = useHistory();

  const theme = useTheme();

  const createThread = () => {
    scrapingThreadsActions.create(UrlInputValue);
  };

  return (
    <div
      style={{
        overflowY: "scroll",
        overflowX: "hidden",
        padding: theme.spacing(4),
      }}
    >
      <Paper style={{ marginBottom: theme.spacing(3) }}>
        <div
          style={{
            padding: theme.spacing(2),
            width: "100%",
            display: "flex",
            flexDirection: "row",
            flexWrap: "nowrap",
          }}
        >
          <FormControl fullWidth size="small" className={classes.margin}>
            <OutlinedInput
              id="standard-adornment-amount"
              size="small"
              placeholder="URL to track"
              value={UrlInputValue.inputValue}
              onChange={(evt) => {
                const inputValue = evt.target.value;
                setUrlInputValue({
                  inputValue,
                  hostName: urlHelpers.parseHostname(inputValue),
                });
              }}
              onKeyPress={(evt) => {
                if (evt.key === "Enter") {
                  createThread();
                }
              }}
              startAdornment={
                <InputAdornment position="start">
                  <LinkIcon />
                </InputAdornment>
              }
            />
          </FormControl>
          <Button
            variant="contained"
            color="secondary"
            disableElevation
            startIcon={<AddCircleIcon />}
            endIcon={<SpinnerGrow />}
            onClick={createThread}
            style={{ whiteSpace: "nowrap", marginLeft: theme.spacing(2) }}
          >
            Add URL
          </Button>
        </div>
      </Paper>
      {/* {hostName && <HostPatternInputComponent hostName={hostName} />} */}

      <Divider />
      <TableContainer component={Paper} className={classes.tableContainer}>
        <Typography variant="h6" style={{ padding: theme.spacing(2) }}>
          Recently Tracked URLs
        </Typography>
        <AddTrackUrlTable />
      </TableContainer>
    </div>
  );
}
