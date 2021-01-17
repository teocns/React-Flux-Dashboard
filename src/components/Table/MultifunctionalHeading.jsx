import {
  TableHead,
  TableRow,
  TableCell,
  TableSortLabel,
  Checkbox,
} from "@material-ui/core";

import React from "react";
import { lighten, makeStyles } from "@material-ui/core/styles";

// Exmaple of columns

let columnExample = {
  name: "dessert",
  sortable: true,
  width: "25%",
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  paper: {
    width: "100%",
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    top: 20,
    width: 1,
  },
}));

const MultifunctionalTableHeading = ({
  columns,
  onCheckedChanged,
  onSortChanged,
  sort,
  allRowsChecked = false,
  disableChecker = false,
}) => {
  const classes = useStyles();
  return (
    <TableHead>
      <TableRow>
        {!disableChecker && (
          <TableCell>
            <Checkbox
              size="small"
              disabled={disableChecker}
              checked={allRowsChecked}
              onChange={(event) => {
                onCheckedChanged(event.target.checked);
              }}
            />
          </TableCell>
        )}
        {columns.map(({ name, label, width = "auto", sortable = true }) => {
          const thisColumnSort = sort && sort.name === name ? sort.sort : "asc";
          const isActive = sort && sort.name === name;
          return (
            <TableCell width={width}>
              <TableSortLabel
                active={isActive}
                direction={thisColumnSort}
                hideSortIcon={!isActive}
                onClick={() => {
                  if (!sortable) {
                    return;
                  }
                  onSortChanged({
                    name: name,
                    sort: thisColumnSort === "asc" ? "desc" : "asc",
                  });
                }}
              >
                {label}
                {isActive && sortable ? (
                  <span className={classes.visuallyHidden}>
                    {sort === "desc" ? "sorted descending" : "sorted ascending"}
                  </span>
                ) : null}
              </TableSortLabel>
            </TableCell>
          );
        })}
      </TableRow>
    </TableHead>
  );
};

export default React.memo(MultifunctionalTableHeading);
