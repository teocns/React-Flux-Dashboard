import React, { useState } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";

import { motion } from "framer-motion";
const useStyles = makeStyles((theme) => ({
  spinner: {
    width: 18,
    height: 18,
    maxWidth: "100%",
    maxHeight: "100%",
    background: "white",
    borderRadius: "50%",
  },
}));
const SpinnerGrow = () => {
  const classes = useStyles();
  return (
    <motion.div
      initial={{ scale: 0.25, opacity: 1 }}
      animate={{ scale: 1, opacity: 0 }}
      transition={{ repeat: Infinity, duration: 0.9 }}
    >
      <div className={classes.spinner}></div>
    </motion.div>
  );
};

export default SpinnerGrow;
