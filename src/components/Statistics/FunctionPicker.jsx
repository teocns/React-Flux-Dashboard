import { MenuItem, Menu, Button } from "@material-ui/core";
import React from "react";

const FunctionPickerComponent = ({
  availableOptions = [{ shortName: "AVG", description: "Average" }],
}) => {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <React.Fragment>
      <Button
        aria-controls="simple-menu"
        aria-haspopup="true"
        onClick={handleClick}
      >
        Open Menu
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        keepMounted
      >
        {availableOptions.map(({ shortName, description }) => {
          return <MenuItem>{description}</MenuItem>;
        })}
      </Menu>
    </React.Fragment>
  );
};

export default FunctionPickerComponent;
