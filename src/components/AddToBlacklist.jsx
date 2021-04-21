import {
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  InputAdornment,
  OutlinedInput,
  Radio,
  RadioGroup,
  TextField,
  Tooltip,
  Typography,
} from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { Domain, Language, TextFields } from "@material-ui/icons";
import LinkIcon from "@material-ui/icons/Link";
import React, { useState } from "react";
import { capitalizeFirstLetter } from "../helpers/strings";
import { isDomain, isHostname, isUrl } from "../helpers/url";
import { isRegex } from "../helpers/strings";
import uiActions from "../actions/UI";
import KeyboardIcon from "@material-ui/icons/Keyboard";
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

  bigRipple: {
    //borderRadius: "50%",

    "& .MuiTouchRipple-root ": { transform: "scale(1.5)" },
    "&:hover ": { backgroundColor: "transparent" },
  },

  bigRippleInput: {
    //borderRadius: "50%",

    "& .MuiInputBase-root": {
      overflow: "hidden",
    },
  },
});
let filterTimeout = undefined;

var BLACKLIST_RULE_TYPES = {
  PORTAL: 1,
  DOMAIN: 2,
  URL: 3,
  REGEX: 4,
};

var BLACKLIST_RULE_TYPES_NICE_NAMES = {
  [BLACKLIST_RULE_TYPES.PORTAL]: "Portal",
  [BLACKLIST_RULE_TYPES.DOMAIN]: "Portal domain",
  [BLACKLIST_RULE_TYPES.URL]: "Full URL match",
  [BLACKLIST_RULE_TYPES.REGEX]: "Regular expression",
};

var HasEverTypedAnything = false;

const AddToBlacklist = () => {
  const [FormBlacklistRuleType, setFormBlacklistRuleType] = useState(-1);

  const classes = useStyles();

  const theme = useTheme();

  const onAddBlacklistTypeChange = (event) => {
    // Don't allow manual change of type
    // setFormBlacklistRuleType(parseInt(event.target.value));
    const { showSnackbar } = uiActions;
    showSnackbar("The type will be auto-identified as you input the rule.");
  };

  const addRule = () => {
    uiActions.showSnackbar("Feature under development", "warning");
  };

  const getBlacklistRuleIcon = () => {
    switch (FormBlacklistRuleType) {
      case BLACKLIST_RULE_TYPES.REGEX:
        return <TextFields />;
      case BLACKLIST_RULE_TYPES.PORTAL:
        return <Language />;
      case BLACKLIST_RULE_TYPES.DOMAIN:
        return <Domain />;
      case BLACKLIST_RULE_TYPES.URL:
        return <LinkIcon />;
      default:
        return <KeyboardIcon />;
        break;
    }
  };

  const getBlacklistRuleHint = (type) => {
    switch (type) {
      case BLACKLIST_RULE_TYPES.REGEX:
        return "Regular expression match (i.e ^.*\\.(jpg|JPG|gif|GIF|doc|DOC|pdf|PDF)$)";
      case BLACKLIST_RULE_TYPES.PORTAL:
        return "Example:\tglassdoor.com";
      case BLACKLIST_RULE_TYPES.DOMAIN:
        return "Example:\tbeta.glassdoor.com";
      case BLACKLIST_RULE_TYPES.URL:
        return "Example:\thttp://glassdoor.com/about";
      default:
        return "Type something to auto identify the rule type";
        // Really big wtf?
        break;
    }
  };

  const isValidRuleType = () => {
    return Object.values(BLACKLIST_RULE_TYPES).includes(FormBlacklistRuleType);
  };

  const guessType = (input) => {
    if (!input) {
      return false;
    }
    if (isDomain(input)) {
      return BLACKLIST_RULE_TYPES.DOMAIN;
    } else if (isHostname(input)) {
      return BLACKLIST_RULE_TYPES.PORTAL;
    } else if (isUrl(input)) {
      return BLACKLIST_RULE_TYPES.URL;
    } else if (isRegex(input)) {
      return BLACKLIST_RULE_TYPES.REGEX;
    } else {
      return false;
    }
  };

  const onInputChanged = (val) => {
    HasEverTypedAnything = true;
    const guessedType = guessType(val);
    console.log("guessedType", guessedType);

    if (guessedType !== FormBlacklistRuleType) {
      setFormBlacklistRuleType(guessedType);
    }
  };

  return (
    <Paper style={{ marginBottom: theme.spacing(3) }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: theme.spacing(2),
        }}
      >
        <Typography variant="h6">Add to blacklist</Typography>

        <FormControl
          component="fieldset"
          error={!isValidRuleType()}
          style={{ marginTop: theme.spacing(2) }}
        >
          <FormLabel component="legend">Rule type</FormLabel>
          <RadioGroup
            aria-label="Rule type"
            name="ruleType"
            value={FormBlacklistRuleType}
            onChange={onAddBlacklistTypeChange}
            row
            style={{ margin: theme.spacing(1) }}
          >
            {Object.keys(BLACKLIST_RULE_TYPES).map((ruleType) => {
              const val = BLACKLIST_RULE_TYPES[ruleType];
              return (
                <Tooltip title={getBlacklistRuleHint(val)}>
                  <FormControlLabel
                    key={val}
                    value={val}
                    control={<Radio disableRipple />}
                    label={BLACKLIST_RULE_TYPES_NICE_NAMES[val]}
                  />
                </Tooltip>
              );
            })}
          </RadioGroup>
        </FormControl>

        <FormControl fullWidth size="small" className={classes.margin}>
          <TextField
            id="standard-adornment-amount"
            size="small"
            //label=
            //labelWidth={!isValidRuleType() ? 0 : "auto"}
            placeholder={getBlacklistRuleHint()}
            helperText={
              HasEverTypedAnything && !isValidRuleType()
                ? "Invalid rule"
                : undefined
            }
            error={HasEverTypedAnything && !isValidRuleType()}
            variant="outlined"
            onChange={(evt) => {
              onInputChanged(evt.target.value);
            }}
            className={classes.bigRippleInput}
            // onKeyPress={(evt) => {
            //   onInputChanged(evt.target.value);
            // }}

            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  {getBlacklistRuleIcon()}
                </InputAdornment>
              ),
              endAdornment: (
                <Button
                  disableFocusRipple
                  //style={{ backgroundColor: "transparent" }}
                  className={classes.bigRipple}
                  onClick={addRule}
                >
                  <div
                    style={{
                      whiteSpace: "nowrap",
                    }}
                  >
                    Add rule
                  </div>
                </Button>
              ),
            }}
          />
        </FormControl>
      </div>
    </Paper>
  );
};

export default AddToBlacklist;
