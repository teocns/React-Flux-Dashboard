import ColorHash from "color-hash";

import {
  amber,
  blueGrey,
  brown,
  deepOrange,
  deepPurple,
  green,
  grey,
  lightBlue,
  lightGreen,
  orange,
  pink,
  purple,
  red,
  teal,
} from "@material-ui/core/colors";

export const getRandomColor = (letter) => {
  letter = letter.toLowerCase();
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

export function colorHash(str) {
  return new ColorHash().hex(str);
}

export function stringToHslColor(str, s = 80, l = 50) {
  var hash = 0;
  for (var i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  var h = hash % 360;
  return "hsl(" + h + ", " + s + "%, " + l + "%)";
}
