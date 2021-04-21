import React, { useState } from "react";
import { IconButton, Menu, MenuItem } from "@material-ui/core";
import { FilterList } from "@material-ui/icons";

/**
 * @typedef {number} FilterType
 **/

/**
 * @enum {FilterType}
 */
var FILTER_TYPES = {
  SORTABLE: 1,
  TOGGLEABLE: 2,
  CHOICE: 3,
  CUSTOM_COMPONENT: 4,
};

/**
 * @typedef {Object} filter
 * @property {object} niceName
 * @property {object} name
 * @property {FilterType} type
 * @property {Array} choices
 * @property {bool} allowPairing // Can be active while another filter is active aswell
 * @property {React.Component} icon
 */

/**
 * @typedef {Array} filters
 * @param {*} param0
 * @returns
 */

/**
 * @param {Object} obj1
 * @param {filters} obj1.filters
 */

const ITEM_HEIGHT = 48;

const IconMultiFilter = ({ filters }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  /**
   * @type {Array.<filters>,CallableFunction>}
   */
  const [ActiveFilters, setActiveFilters] = useState();

  /**
   *
   * @param {filter} filter
   */
  const renderFilter = (filter) => {
    return (
      <MenuItem onClick={() => handleFilterAction(filter)}>
        {filter.type}
      </MenuItem>
    );
  };

  const handleFilterAction = (filter) => {
    switch (filter.type) {
    }
  };

  return (
    <div>
      <IconButton
        aria-controls="table-filter-menu"
        aria-haspopup="true"
        onClick={handleClick}
      >
        <FilterList />
      </IconButton>
      <Menu
        PaperProps={{
          style: {
            maxHeight: ITEM_HEIGHT * 4.5,
            width: "20ch",
          },
        }}
        id="table-filter-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {filters.map(renderFilter)}
      </Menu>
    </div>
  );
};

export default IconMultiFilter;
