import {
  Badge,
  Box,
  Checkbox,
  CircularProgress,
  IconButton,
  Tooltip,
} from "@material-ui/core";
import { Delete, Refresh } from "@material-ui/icons";
import React from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { AnimatePresence, motion } from "framer-motion";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    display: "flex",
  },
}));

const ManageUrlsHeader = ({
  rows,
  SelectedRows,
  IsLoading,
  selectAllRowsFunc: selectAllRows,
  deleteSelectedRowsFunc: deleteSelectedRows,
  refreshFunc,
  theme,
}) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Box display="flex" width="100%" position="relative" alignItems="center">
        <div style={{ display: "flex", alignItems: "center" }}>
          <Checkbox
            size="small"
            disabled={rows.length < 1}
            checked={rows.length && SelectedRows.length === rows.length}
            onChange={selectAllRows}
          />
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginLeft: theme.spacing(1),
          }}
        >
          <Tooltip title={`Permanently delete ${SelectedRows.length} links?`}>
            <IconButton
              disabled={SelectedRows.length < 1}
              size="small"
              onClick={deleteSelectedRows}
            >
              <Badge badgeContent={SelectedRows.length} color="secondary">
                <Delete />
              </Badge>
            </IconButton>
          </Tooltip>
        </div>
      </Box>

      <div
        style={{
          justifyContent: "flex-end",
          display: "flex",
          position: "relative",
          alignItems: "center",
          width: 32,
          height: 32,
        }}
      >
        <div
          style={{
            position: "absolute",
            justifyContent: "center",
            display: "flex",

            alignItems: "center",
            right: 0,
            top: "50%",
            transform: "translateY(-50%)",
            width: "100%",
            height: "100%",
          }}
        >
          <motion.div
            initial={{
              scale: IsLoading ? 0 : 1,
            }}
            animate={{
              scale: IsLoading ? 1 : 0,
              opacity: IsLoading ? 1 : 0,
            }}
            transition={
              {
                // type: "spring",
              }
            }
          >
            <CircularProgress
              style={{ width: 24, height: 24 }}
              color="secondary"
            />
          </motion.div>
        </div>
        <div
          style={{
            position: "absolute",
            right: 0,
            top: "50%",
            transform: "translateY(-50%)",
            width: "100%",
            height: "100%",
          }}
        >
          <motion.div
            initial={{
              scale: IsLoading ? 1 : 0,
            }}
            animate={{
              scale: IsLoading ? 0 : 1,
              opacity: IsLoading ? 0 : 1,
            }}
            transition={
              {
                //duration: 1,
                //type: "spring",
              }
            }
          >
            <Tooltip title="Refresh the page results">
              <IconButton
                size="small"
                onClick={refreshFunc}
                disabled={IsLoading}
              >
                <Refresh />
              </IconButton>
            </Tooltip>
          </motion.div>
        </div>
      </div>
    </div>

    /* <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginLeft: theme.spacing(1),
                }}
              >
                <MultiFilter
                  Countries={tableData.availableCountries}
                  onCountriesChanged={handleCountryFilterChanged}
                  onDateRangeChanged={handleDateFilterChanged}
                />
              </div> */
  );
};

export default ManageUrlsHeader;
