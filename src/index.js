import React from "react"
import ReactDOM from "react-dom/client"
import Root from "./routes/root"
import About from "./routes/about"
import FrontPage from "./routes/FrontPage"
import Home from './routes/Home'; 
import { RouterProvider, createHashRouter } from "react-router-dom"

const router = createHashRouter([
    {
        path: "/",
        element: <Root />,
        children: [
          {
            path: "/",
            element: <FrontPage />,
        },
            {
                path: "/home",
                element: <Home />,
            },
            {
                path: "/about",
                element: <About />,
            },
        ],
    },
])

const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
)