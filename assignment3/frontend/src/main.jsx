import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./styles/global.css";

// TODO: Import your route components (Home and EditPaper)

// This is the main entry point of your React application
// You need to set up React Router here to enable client-side routing
// Requirements:
// 1. Create a router configuration using createBrowserRouter
// 2. Set up two routes:
//    - Home route ("/") should render the Home component
//    - Edit route ("/edit/:id") should render the EditPaper component
//    Note: ":id" is a URL parameter that will be used to identify which paper to edit

// TODO: Define your router configuration here
// Example route configuration:
// const router = createBrowserRouter([]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* TODO: Replace null with your Router instance */}
    <RouterProvider router={null} />
  </React.StrictMode>
);
