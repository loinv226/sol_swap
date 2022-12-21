import { extendTheme } from "@chakra-ui/react";

const breakpoints = {
  sm: "320px",
  md: "768px",
  lg: "960px",
  xl: "1024px",
  "2xl": "1336px",
  "3xl": "1440px",
};

export const darkTheme = extendTheme({
  colors: {
    button: {
      500: "#0E97FF",
    },
    button2: {
      500: "#E4E6EA",
    },
    text: "#E5E6EB",
    primary: "#0E97FF",
    background: "#293249",
    paper: "#1A1A1A",
    toolbar: "#1A1A1A",
    text2: "#E4E4EC",
    text3: "#BCC0C9",
    function1: "#58C27D",
    border: "#6C6D6F",
    icon: "#757C8E",
  },
  textStyles: {
    h1: {
      fontSize: ["48px", "72px"],
      fontWeight: "bold",
      lineHeight: "110%",
      letterSpacing: "-2%",
      color: "text",
    },
    h3: {
      fontSize: "24px",
      fontWeight: "semibold",
      lineHeight: "110%",
      letterSpacing: "-1%",
      color: "text",
    },
    h6: {
      fontSize: "18px",
      fontWeight: "semibold",
      lineHeight: "110%",
      letterSpacing: "-1%",
      color: "text",
    },
    body1: {
      fontSize: "16px",
      fontWeight: "normal",
      color: "text",
    },
    body2: {
      fontSize: "14px",
      fontWeight: "normal",
      color: "text",
    },
    subtitle1: {
      fontSize: "16px",
      fontWeight: "semibold",
      color: "text",
    },
    subtitle2: {
      fontSize: "14px",
      fontWeight: "semibold",
      color: "text",
    },
    menu: {
      fontSize: "12px",
      color: "text",
    },
    caption: {
      fontSize: "12px",
      color: "text2",
    },
    smallText: {
      fontSize: "10px",
      color: "text",
    },
  },
  breakpoints,
});

export const lightTheme = extendTheme({
  colors: {
    button: {
      500: "#0E97FF",
    },
    button2: {
      500: "#E4E6EA",
    },
    sprimary: {
      500: "#0E97FF",
      600: "#0E97FF",
    },
    sbackground: {
      500: "#3B71FE",
      600: "#3B71FE",
    },
    text: "#333333",
    primary: "#0E97FF",
    background: "#F4F4F4",
    paper: "white",
    toolbar: "#F4F4F4",
    text2: "#66676B",
    text3: "#BCC0C9",
    function1: "#58C27D",
    border: "#CACACC",
    icon: "#757C8E",
  },
  textStyles: {
    h1: {
      fontSize: ["48px", "72px"],
      fontWeight: "bold",
      lineHeight: "110%",
      letterSpacing: "-2%",
      color: "text",
    },
    h3: {
      fontSize: "24px",
      fontWeight: "semibold",
      lineHeight: "110%",
      letterSpacing: "-1%",
      color: "text",
    },
    h6: {
      fontSize: "18px",
      fontWeight: "semibold",
      lineHeight: "110%",
      letterSpacing: "-1%",
      color: "text",
    },
    body1: {
      fontSize: "16px",
      fontWeight: "normal",
      color: "text",
    },
    body2: {
      fontSize: "14px",
      fontWeight: "normal",
      color: "text",
    },
    subtitle1: {
      fontSize: "16px",
      fontWeight: "semibold",
      color: "text",
    },
    subtitle2: {
      fontSize: "14px",
      fontWeight: "semibold",
      color: "text",
    },
    menu: {
      fontSize: "12px",
      color: "text",
    },
    caption: {
      fontSize: "12px",
      color: "text2",
    },
    smallText: {
      fontSize: "10px",
      color: "text",
    },
  },
  breakpoints,
});

export const Z_INDEX = {
  header: 1,
};
