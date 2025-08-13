import React from "react";

const reactElementToString = (element) => {
  if (typeof element === "string") return element;
  else if (React.isValidElement(element)) {
    return reactElementToString(element.props.children);
  } else if (Array.isArray(element)) {
    return element.map((e) => reactElementToString(e)).join("");
  } else if (element && typeof element === "object") {
    return Object.values(element)
      .map((e) => reactElementToString(e))
      .join("");
  }
};

export default reactElementToString;
