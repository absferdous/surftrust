// /src-jsx/builder.js
import React from "react";
import { render } from "@wordpress/element";
// We import the Builder "page" component we just made
import Builder from "./pages/Builder";
render(/*#__PURE__*/React.createElement(Builder, null), document.getElementById("surftrust-builder-app"));