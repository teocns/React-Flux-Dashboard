import React from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import {
  deepOrange,
  deepPurple,
  purple,
  pink,
  red,
  cyan,
  teal,
  lightBlue,
  lime,
  lightGreen,
  green,
  amber,
  yellow,
  brown,
  grey,
  blueGrey,
  orange,
} from "@material-ui/core/colors";

import { Avatar, Tooltip } from "@material-ui/core";
import robotSvg from "../../../assets/robot.svg";
const useStyles = makeStyles((theme) => ({
  avatar: {
    fontSize: 11,
  },
  small: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
  large: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
}));

const getColor = (letter) => {
  let alphabet = [
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
  ];

  const colors = [
    deepOrange,
    deepPurple,
    purple,
    pink,
    red,
    teal,
    lightBlue,
    lightGreen,
    green,
    amber,
    brown,
    grey,
    blueGrey,
    orange,
  ];

  const colorsLen = colors.length;
  const colorPairs = {};
  for (let i = 0; i < alphabet.length; i++) {
    let targetColor = i;
    if (i > colorsLen - 1) {
      targetColor = i - colorsLen;
    }
    colorPairs[alphabet[i]] = colors[targetColor][500];
  }
  return colorPairs[letter];
};

const UserShortLettersAvatar = ({ username, fullname }) => {
  const classes = useStyles();
  const theme = useTheme();

  const isBot = !username && !fullname;

  const makeBotProps = () => {
    const shortLetters = "";
    const src = robotSvg;
    const backgroundColor = "gray";
    const tooltip = "BOT";
    return { shortLetters, src, backgroundColor, tooltip };
  };

  const makeUserProps = () => {
    const _targetName = fullname || username;
    let shortLetters = "";
    const nameParts = _targetName.toUpperCase().split(" ");
    if (true) {
      shortLetters = nameParts[0].substring(0, 1);
    } else {
      // Apply for two letters
      if (nameParts.length >= 2) {
        shortLetters =
          nameParts[0].substring(0, 1) + nameParts[1].substring(0, 1);
      } else {
        shortLetters = nameParts[0].substring(0, 2);
      }
    }
    const src = null;
    const backgroundColor = getColor(_targetName[1]);
    const tooltip = _targetName;
    return { shortLetters, src, backgroundColor, tooltip };
  };
  const { shortLetters, src, backgroundColor, tooltip } = isBot
    ? makeBotProps()
    : makeUserProps();
  return (
    <Avatar
      className={[classes.avatar, classes.small]}
      style={{
        color: "white",
        backgroundColor: backgroundColor,
      }}
      src={src}
    >
      {shortLetters}
    </Avatar>
    // <Tooltip title={tooltip} aria-label={tooltip}>
    // </Tooltip>
  );
};

export default UserShortLettersAvatar;
