import {
  Button,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormLabel,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Tooltip,
  Typography,
} from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import {
  ContactSupportOutlined,
  Domain,
  Language,
  TextFields,
} from "@material-ui/icons";
import LinkIcon from "@material-ui/icons/Link";
import React, { useRef, useState, useEffect } from "react";
import { capitalizeFirstLetter, isWildcardRule } from "../helpers/strings";
import { isDomain, isHostname, isUrl } from "../helpers/url";
import { isRegex } from "../helpers/strings";
import uiActions from "../actions/UI";
import KeyboardIcon from "@material-ui/icons/Keyboard";
import blacklistActions from "../actions/Blacklist";
import ActionTypes from "../constants/ActionTypes";
import {
  BLACKLIST_RULE_TYPES,
  BLACKLIST_RULE_TYPES_NICE_NAMES,
} from "../constants/Blacklist";
import blacklistStore from "../store/Blacklist";
import { Skeleton } from "@material-ui/lab";
import { number_format } from "../helpers/numbers";
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

var HasEverTypedAnything = false;

const blacklist_reasons = [
  "Cannot scrape jobs",
  "Cannot scrape links",
  "Partner",
];

var previousImpactForecastRule = undefined;
var lazyRuleForcastImpactTimeout = undefined;
const AddToBlacklist = ({ onRuleAdded }) => {
  const [FormBlacklistRuleType, setFormBlacklistRuleType] = useState(-1);

  const [Reasons, setReasons] = useState(blacklistStore.getReasons());

  const getDefaultReason = () => {
    return Reasons ? Reasons[0].id : undefined;
  };

  const [SelectedBlacklistReasonId, setSelectedBlacklistReasonId] = useState(
    getDefaultReason() || 1
  );

  /**
   * Accepted values:
   * -1 for loading
   * Dictionary for results
   */
  const [ImpactForecast, setImpactForecast] = useState(undefined);

  const isLoadingImpactForecasts = ImpactForecast === -1;
  const canShowImpactForecasts =
    !isLoadingImpactForecasts &&
    ImpactForecast &&
    ImpactForecast.domains !== undefined;
  const [Rule, setRule] = useState();

  const onReasonChange = (event) => {
    setSelectedBlacklistReasonId(event.target.value);
  };

  const classes = useStyles();

  const theme = useTheme();

  const ruleInput = useRef(null);

  const onAddBlacklistTypeChange = (event) => {
    // Don't allow manual change of type
    // setFormBlacklistRuleType(parseInt(event.target.value));
    const { showSnackbar } = uiActions;
    showSnackbar("The type will be auto-identified as you input the rule.");
  };

  const addRule = async () => {
    const reason = await window.confirm(
      "Are you sure you want to add the rule? Make sure you double check the impact forecasts to prevent damage."
    );

    if (!reason) {
      return false;
    }

    await blacklistActions.addRule(Rule, reason);

    onRuleAdded && onRuleAdded();
    //uiActions.showSnackbar("Feature under development", "warning");
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
    }
  };

  const getBlacklistRuleHint = (type) => {
    switch (type) {
      case BLACKLIST_RULE_TYPES.REGEX:
        return "Example: *.glassdoor.com or *.glassdoor.*";
      case BLACKLIST_RULE_TYPES.PORTAL:
        return "Example:\tglassdoor.com";
      case BLACKLIST_RULE_TYPES.WILDCARD_RULE:
        return "Example:\tbeta.glassdoor.com or glassdoor.com";
      case BLACKLIST_RULE_TYPES.URL:
        return "Example:\thttp://glassdoor.com/about";
      default:
        return "Type something to auto identify the rule type";
    }
  };

  const lazyFetchImpactForecastRule = () => {
    // Used to retrieve impact forecast in a lazy manner
    // We cannot abuse the Rule state as this will cause massive amounts of requests to the server
    // Since ImpactForecastRule is only set once every .5 sec after done typing
    clearTimeout(lazyRuleForcastImpactTimeout);
    lazyRuleForcastImpactTimeout = setTimeout(() => {
      fetchImpactForecastRule();
    }, 500);
  };

  const onBlacklistReasonsSynced = () => {
    setReasons(blacklistStore.getReasons());
  };

  const bindListeners = () => {
    blacklistStore.addChangeListener(
      ActionTypes.Blacklist.SYNC_BLACKLIST_REASONS,
      onBlacklistReasonsSynced
    );

    return () => {
      blacklistStore.removeChangeListener(
        ActionTypes.Blacklist.SYNC_BLACKLIST_REASONS,
        onBlacklistReasonsSynced
      );
    };
  };

  const fetchImpactForecastRule = async () => {
    if (!Rule) {
      setImpactForecast(undefined);
    }
    setImpactForecast(-1);

    setTimeout(async () => {
      try {
        const impactForecast = await blacklistActions.getImpactForecast({
          rule: Rule,
        });
        setImpactForecast(impactForecast);
      } catch (e) {
        setImpactForecast(undefined);
      }
    });
  };

  useEffect(() => {
    if (previousImpactForecastRule !== Rule) {
      if (isValidRuleType()) {
        lazyFetchImpactForecastRule();
      } else {
        setImpactForecast(undefined);
      }
    }
    return bindListeners();
  }, [Rule]);
  const isValidRuleType = (val) => {
    const isValid =
      (val || FormBlacklistRuleType) === BLACKLIST_RULE_TYPES.DOMAIN ||
      (val || FormBlacklistRuleType) === BLACKLIST_RULE_TYPES.WILDCARD_RULE;
    console.log("isValidRuleType ", isValid);
    return isValid;
    //return Object.values(BLACKLIST_RULE_TYPES).includes(FormBlacklistRuleType);
  };

  window.isRegex = isRegex;
  const guessType = (input) => {
    if (!input) {
      return false;
    }
    if (isDomain(input)) {
      return BLACKLIST_RULE_TYPES.DOMAIN;
    } else if (isWildcardRule(input)) {
      return BLACKLIST_RULE_TYPES.WILDCARD_RULE;
    } else {
      return false;
    }
  };

  const onInputChanged = (val) => {
    HasEverTypedAnything = true;
    const guessedType = guessType(val);

    if (guessedType !== FormBlacklistRuleType) {
      setFormBlacklistRuleType(guessedType);
    }

    setTimeout(() => {
      previousImpactForecastRule = Rule;
      setRule(val);
    });
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
        {!Reasons ? (
          <Skeleton variant="rect" style={{ height: 128 }}></Skeleton>
        ) : (
          <React.Fragment>
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
                  if (ruleType !== "DOMAIN" && ruleType !== "WILDCARD_RULE") {
                    return;
                  }
                  const val = BLACKLIST_RULE_TYPES[ruleType];
                  return (
                    <Tooltip title={getBlacklistRuleHint(val)}>
                      <FormControlLabel
                        key={val}
                        value={val}
                        control={
                          <Radio
                            disableRipple
                            disabled={
                              ruleType !== "DOMAIN" &&
                              ruleType !== "WILDCARD_RULE"
                            }
                          />
                        }
                        label={BLACKLIST_RULE_TYPES_NICE_NAMES[val]}
                      />
                    </Tooltip>
                  );
                })}
              </RadioGroup>
            </FormControl>
            <FormControl
              variant="outlined"
              required
              style={{ maxWidth: 256, marginBottom: theme.spacing(2) }}
            >
              <InputLabel id="demo-simple-select-outlined-label">
                Blacklist reason
              </InputLabel>
              <Select
                autoWidth
                size="small"
                labelId="demo-simple-select-outlined-label"
                id="demo-simple-select-outlined"
                value={SelectedBlacklistReasonId}
                onChange={onReasonChange}
                label="Blacklist reason"
              >
                {Reasons.map(({ id, reason }) => {
                  return (
                    <MenuItem key={id} value={id}>
                      {reason}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
            <FormControl fullWidth size="small" className={classes.margin}>
              <TextField
                ref={ruleInput}
                id="standard-adornment-amount"
                size="small"
                //label=
                //labelWidth={!isValidRuleType() ? 0 : "auto"}
                placeholder={getBlacklistRuleHint()}
                helperText={
                  HasEverTypedAnything && !isValidRuleType()
                    ? `Invalid rule type. ${
                        Rule && !Rule.includes("*")
                          ? "Remember to make appropriate use of * wildcards."
                          : ""
                      }`
                    : undefined
                }
                error={HasEverTypedAnything && !isValidRuleType()}
                variant="outlined"
                onChange={(evt) => {
                  onInputChanged(evt.target.value);
                }}
                className={classes.bigRippleInput}
                onKeyPress={(evt) => {
                  if (evt.key === "Enter") {
                    addRule();
                  }
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      {getBlacklistRuleIcon()}
                    </InputAdornment>
                  ),
                }}
              />
            </FormControl>
            <div style={{ padding: theme.spacing(1) }}>
              {isLoadingImpactForecasts && (
                <CircularProgress color="secondary" />
              )}
              {canShowImpactForecasts ? (
                <div>
                  <Typography
                    variant="caption"
                    style={{
                      color: theme.palette.text.disabled,
                      marginTop: theme.spacing(1),
                      marginBottom: theme.spacing(1),
                    }}
                  >
                    Impact forecast
                  </Typography>
                  <Typography>
                    Affected Domains:
                    <code style={{ marginLeft: theme.spacing(1) }}>
                      {number_format(ImpactForecast.domains)}
                    </code>
                  </Typography>
                  <Typography>
                    Affected Tracked URLs:
                    <code style={{ marginLeft: theme.spacing(1) }}>
                      {number_format(ImpactForecast.trackedUrls)}
                    </code>
                  </Typography>

                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={addRule}
                    disabled={!isValidRuleType()}
                    disableElevation
                    style={{
                      whiteSpace: "nowrap",
                      marginTop: theme.spacing(1),
                    }}
                  >
                    Add rule
                  </Button>
                </div>
              ) : null}
            </div>
          </React.Fragment>
        )}
      </div>
    </Paper>
  );
};

export default AddToBlacklist;
