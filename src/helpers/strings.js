export const capitalizeFirstLetter = (string) => {
  string = string.toLowerCase();
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const isRegex = (string) => {
  try {
    new RegExp(string);
    return true;
  } catch (e) {
    return false;
  }
};

export const isWildcardRule = (string) => {
  try {
    return string.match(/^(\*|(\*|\*\.)?\w+(\.\w+)*(\.\*|\*)?)$/);
  } catch (e) {
    return false;
  }
};

export const hasSlashAfterDot = (string) => {
  const hasAnotherDotBeforeSlash = (string) => {
    let slashIndex = 0;
    let dotIndex = 0;
    for (let i = 0; i < string.length; i++) {
      const currentChar = string[i];
      switch (currentChar) {
        case "/":
          slashIndex = i;
          break;
        case ".":
          dotIndex = i;
          break;
        default:
          break;
      }
    }
    return dotIndex > slashIndex;
  };

  let dotIndex = 0;
  let slashIndex = 0;
  for (let i = 0; i < string.length; i++) {
    const currentChar = string[i];
    switch (currentChar) {
      case "/":
        slashIndex = i;
        break;
      case ".":
        if (!hasAnotherDotBeforeSlash) {
          return true;
        }
        dotIndex = i;
        break;
      default:
        break;
    }
    return slashIndex > dotIndex;
  }
};
