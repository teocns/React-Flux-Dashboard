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

const getDays = (year, month) => {
  const days = [];

  const date = new Date(year, month, -1);
  for (let i = 0; i <= date.getDate(); i++) {
    days.push(i + 1);
  }
  return days;
};

// given Year and Month, return the day of today
const getDay = (year, month) => {
  const date = new Date();
  date.setFullYear(year);
  date.setMonth(month);
  return date.getDate();
};

const DaySelectComponent = ({ onDayChanged, year, month, required }) => {
  const availableDays = getDays(year, month);

  const [Day, setDay] = useState(getDay(year, month));

  const handleDayChanged = (evt) => {
    setDay(evt.target.value);
    onDayChanged && onDayChanged(evt.target.value);
  };

  const theme = useTheme();

  return (
    <FormControl variant="standard" style={{ marginLeft: theme.spacing(1) }}>
      <InputLabel id="hostiayque">Day</InputLabel>
      <Select
        labelId="hostiayque"
        id="lido"
        label="Day"
        value={Day}
        onChange={handleDayChanged}
        style={{
          minWidth: 120,
        }}
      >
        {!required && <MenuItem value={""}>All</MenuItem>}
        {availableDays.map((day) => {
          let day_name = availableDays[day - 1];
          return <MenuItem value={day}>{day_name}</MenuItem>;
        })}
      </Select>
    </FormControl>
  );
};

export default React.memo(DaySelectComponent);
