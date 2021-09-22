import React, { useState, useRef, useEffect } from "react";
import clsx from "clsx";
import { isFunction } from "../../helpers/utils";
import {
  DateRangePicker,
  DateRange,
  DefinedRange,
} from "materialui-daterange-picker";
import ClearAllIcon from "@material-ui/icons/ClearAll";
import PersonIcon from "@material-ui/icons/Person";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import ListItemText from "@material-ui/core/ListItemText";
import Select from "@material-ui/core/Select";
import Checkbox from "@material-ui/core/Checkbox";
import Chip from "@material-ui/core/Chip";
import userFilterStore from "../../store/UserFilter";
import userFilterActions from "../../actions/UserFilter";
import { Skeleton } from "@material-ui/lab";
import {
  Menu,
  Button,
  IconButton,
  ButtonGroup,
  Divider,
  Typography,
  Badge,
} from "@material-ui/core";
import {
  Close,
  Public,
  FilterList as FilterListIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  FastForward,
  Search,
  Done,
} from "@material-ui/icons";
import DateRanges from "../../constants/DateRanges";
import countryFilterStore from "../../store/CountryFilter";
import ActionTypes from "../../constants/ActionTypes";
import dispatcher from "../../dispatcher";
import { CircularProgress } from "@material-ui/core";
import sessionStore from "../../store/session";
const useStyles = makeStyles((theme) => ({
  select: {
    "&:before": {
      border: "none",
    },
    "&:after": {
      border: "none",
    },
    "&:focus": {
      border: "none",
      outline: "none",
    },
    "& .MuiSelect-select ": {
      backgroundColor: "transparent!important",
      border: "none",
    },
  },
  chips: {
    display: "flex",
    flexWrap: "wrap",
  },
  chip: {
    margin: 2,
  },
  noLabel: {
    marginTop: theme.spacing(3),
  },
  selectedCountriesContainer: {
    display: "inline-flex",
    maxWidth: 520,
    flexWrap: "nowrap",
    overflow: "hidden",
  },
  formControl: {
    //margin: theme.spacing(1),
    minWidth: 160,
  },
  loader: {
    "& svg": {
      position: "absolute",
      left: "50%",
      top: "50%",
      transform: "translate(-50%, -50%)",
      margin: 0,
    },
  },
}));

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 7 + ITEM_PADDING_TOP,
      width: 250,
      overflow: "hidden",
    },
  },
};

function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

function GenericSelect({ onChange, label, required, ajaxEndpoint }) {
  const [Items, setItems] = useState(undefined);

  const [SelectedItems, setSelectedItems] = useState(undefined);
  const isLoading = !Array.isArray(Items);
  const classes = useStyles();
  const theme = useTheme();

  const id = "generic-select-" + label;

  useEffect(() => {
    ajaxEndpoint &&
      ajaxEndpoint().then((data) => {
        if (typeof data === "string") {
          setItems(JSON.parse(data));
        }
        setItems(data);
      });

    //return bindListeners();
  }, []);

  const handleChange = (ev) => {
    setSelectedItems(ev.target.value);
    onChange && onChange(ev.target.value);
  };

  const render = () => {
    return (
      <FormControl variant="standard" className={classes.formControl}>
        <InputLabel id={id + "label"}>{label ? label : ""}</InputLabel>
        <Select
          labelId={id + "label"}
          id={id}
          size="small"
          disabled={isLoading}
          value={SelectedItems}
          onChange={handleChange}
          label={label ? label : ""}
          required
          startAdornment={
            isLoading && <CircularProgress className={classes.loader} />
          }
        >
          {!required && <MenuItem value="">None</MenuItem>}
          {!isLoading &&
            Items.map((item) => {
              return <MenuItem value={item}>{item}</MenuItem>;
            })}
        </Select>
      </FormControl>
    );
  };
  return render();
}
export default React.memo(GenericSelect);
