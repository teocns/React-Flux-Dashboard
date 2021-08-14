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

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const MonthSelectComponent = ({ onMonthChanged }) => {
  const [Month, setMonth] = useState(new Date().getMonth() + 1);

  const handleMonthChanged = (evt) => {
    setMonth(evt.target.value);
    onMonthChanged && onMonthChanged(evt.target.value);
  };

  const theme = useTheme();

  return (
    <FormControl variant="outlined" style={{ marginLeft: theme.spacing(1) }}>
      <InputLabel id="hostiayque">Month</InputLabel>
      <Select
        labelId="hostiayque"
        id="lido"
        label="Month"
        value={Month}
        onChange={handleMonthChanged}
        style={{
          minWidth: 120,
        }}
      >
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((month) => {
          let month_name = months[month - 1];
          return <MenuItem value={month}>{month_name}</MenuItem>;
        })}
      </Select>
    </FormControl>
  );
};

export default React.memo(MonthSelectComponent);
