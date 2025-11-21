import { createBrowserRouter } from "react-router-dom";
import { lazy } from "react";

const App = lazy(() => import("@/App.tsx"));

const routes = createBrowserRouter([
  {
    path: "",
    Component: App,
    children: [
      {
        index: true,
        path: "/",
        Component: lazy(() => import("@/pages/Login")),
      },
      {
        index: true,
        path: "/login",
        Component: lazy(() => import("@/pages/Login")),
      },
      {
        path: "/index",
        Component: lazy(() => import("@/pages/Index")),
        children: [
          {
            index: true,
            path: "/index",
            Component: lazy(() => import("@/pages/Home")),
          },
          {
            path: "/index/home",
            Component: lazy(() => import("@/pages/Home")),
          },
          {
            path: "/index/resource",
            Component: lazy(() => import("@/pages/Resource")),
            children: [
              {
                path: "/index/resource",
                index: true,
                Component: lazy(() => import("@/pages/Floor")),
              },
              {
                path: "/index/resource/flue-gas",
                Component: lazy(() => import("@/pages/FlueGas")),
              },
              {
                path: "/index/resource/pipeline",
                Component: lazy(() => import("@/pages/Pipeline")),
              },
            ],
          },
        ],
      },
    ],
  },
]);

export default routes;
