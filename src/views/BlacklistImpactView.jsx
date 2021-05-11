import KeyboardBackspaceIcon from "@material-ui/icons/KeyboardBackspace";
import {
  Button,
  CircularProgress,
  Divider,
  FormControl,
  InputAdornment,
  OutlinedInput,
  Typography,
} from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import TableContainer from "@material-ui/core/TableContainer";
import { Domain, Language, TextFields } from "@material-ui/icons";
import LinkIcon from "@material-ui/icons/Link";
import SearchIcon from "@material-ui/icons/Search";

import React, { useEffect, useState } from "react";
import BlacklistApi from "../api/Blacklist";
import AddToBlacklist from "../components/AddToBlacklist";
import BlacklistTable from "../components/Tables/Blacklist";

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

var BLACKLIST_RULE_TYPES = {
  PORTAL: 1,
  DOMAIN: 2,
  URL: 3,
  REGEX: 4,
};

function BlacklistImpactView(props) {
  const ruleId = props.match.params.ruleId;
  const [AffectedUrls, setAffectedUrls] = useState("-1");

  const isLoading = AffectedUrls === "-1";

  if (AffectedUrls === "-1") {
    BlacklistApi.getAffectedUrls(ruleId).then((c) => {
      setAffectedUrls(c);
    });
  }

  const renderUrls = () =>
    isLoading ? (
      <CircularProgress />
    ) : (
      <React.Fragment>
        {AffectedUrls.map((c, index) => {
          return <li key={index}>{c.url}</li>;
        })}
      </React.Fragment>
    );
  return (
    <div>
      {
        <Button
          onClick={() => window.history.go(-1)}
          startIcon={<KeyboardBackspaceIcon />}
        >
          Go back
        </Button>
      }
      {renderUrls()}
    </div>
  );
}

export default React.memo(BlacklistImpactView);
