import React from "react";
import {
  TextField,
  Grid,
  Menu,
  MenuItem,
  FormControl,
  makeStyles,
  Backdrop,
  ClickAwayListener,
} from "@material-ui/core";
import { Search } from "@material-ui/icons";
import { Autocomplete } from "@material-ui/lab";

var HasEverSearched = false;
var filterTimeout = undefined;

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      marginRight: theme.spacing(2),
    },
  },
}));

const AjaxAutocomplete = ({ ajaxEndpoint, label, onChange }) => {
  // Create an autocomplete using TextField
  // When more than 4 characters are inputted, the autocomplete will be triggered
  // Make a call to ajaxEndpoint with the inputted text
  // Retrieve the suggested items and show them in a dropdown using <Menu></Menu>
  // For each suggested item, show a <MenuItem></MenuItem>
  // When an item is selected, hide the dropdown
  // When an item is selected, call the onChange function with the selected item

  const [suggestions, setSuggestions] = React.useState([]);

  const handleSuggestionSelected = (event, value) => {
    // Avoid firing ajax call
    console.log("onChange", value);
    if (suggestions.includes(value)) {
      onChange && onChange(value);
    } else {
      onChange(undefined);
    }
  };

  const onFilterChanged = (event) => {
    HasEverSearched = true;
    clearTimeout(filterTimeout);

    filterTimeout = setTimeout(() => {
      ajaxEndpoint(event.target.value).then((suggestions) => {
        setSuggestions(suggestions);
      });
    }, 1000);
  };

  const classes = useStyles();

  return (
    <div className={classes.root}>
      <FormControl>
        <Autocomplete
          clearOnEscape
          onAbort={() => {
            console.log("aborted");
          }}
          options={suggestions}
          autoHighlight
          renderOption={(option) => (
            <React.Fragment>
              <span>{option}</span>
            </React.Fragment>
          )}
          onChange={handleSuggestionSelected}
          //   onChange={(event, value) => {
          //     debugger;
          //     //handleSuggestionSelected(value);
          //   }}
          renderInput={(params) => (
            <TextField
              style={{ minWidth: 210, width: "auto" }}
              {...params}
              label={label}
              onChange={(evt) => {
                onFilterChanged(evt);
              }}
              id="asdfjkihjaisudfjhusdajmf"
              InputProps={{
                ...params.InputProps,
                autoComplete: "new-password", // disable autocomplete and autofill
                // endAdornment: <Search />,
              }}
            />
          )}
        >
          {/* {suggestions.map((suggestion) => (
            <MenuItem
              key={suggestion}
              onClick={(event) => handleSuggestionSelected(suggestion)}
            >
              {suggestion}
            </MenuItem>
          ))} */}
        </Autocomplete>
      </FormControl>
    </div>
  );
};

export default React.memo(AjaxAutocomplete);
