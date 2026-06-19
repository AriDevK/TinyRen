import React from "react";
import { createRoot } from "react-dom/client";
import {
  createHashRouter,
  RouterProvider,
} from "react-router-dom";
import App from "./App";
import "./style.css"

const router = createHashRouter([
  {
    path: "/",
    element: <App sceneName="begin" />,
  },
  {
    path: "/hello",
    element: <App sceneName="hello" />,
  },
  {
    path: "/begin", 
    element: <App sceneName="begin" />,
  },
]);

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);