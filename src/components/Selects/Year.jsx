import {
  ButtonGroup,
  MenuItem,
  Select,
  FormControl,
  FormHelperText,
  InputLabel,
  useTheme,
} from "@material-ui/core";
import React, { useState } from "react";

const YearSelectComponent = ({ onYearChanged, year }) => {
  // Get an array of last 2 years
  const availableYears = [
    new Date().getFullYear() - 1,
    new Date().getFullYear(),
  ];

  const [Year, setYear] = useState(year ? year : new Date().getFullYear());

  const handleYearChanged = (evt) => {
    setYear(evt.target.value);
    onYearChanged && onYearChanged(evt.target.value);
  };

  const theme = useTheme();

  return (
    <FormControl variant="standard" style={{ marginLeft: theme.spacing(1) }}>
      <InputLabel id="hostiayque">Year</InputLabel>
      <Select
        labelId="hostiayque"
        id="lido"
        label="Year"
        value={Year}
        onChange={handleYearChanged}
        style={{
          minWidth: 120,
        }}
      >
        {availableYears.map((item) => {
          return <MenuItem value={item}>{item}</MenuItem>;
        })}
      </Select>
    </FormControl>
  );
};

export default React.memo(YearSelectComponent);
