// import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "@/assets/styles/mixin.scss";
import "qweather-icons/font/qweather-icons.css";

import { RouterProvider } from "react-router-dom";
import router from "./routes";
import "@ant-design/v5-patch-for-react-19";
// 导入 根store
import store from "./store";
// 导入 react-redux 的内置组件 Provider
import { Provider } from "react-redux";

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(
  // React.StrictMode 为整个应用启用严格模式  -- 严格模式下，组件渲染两次
  // <React.StrictMode>
  <Provider store={store}>
    {/* 使用 redux 的时候，需要用 Provider 包裹 RouterProvider */}
    {/* 路由绑定，注入路由实例对象 */}
    <RouterProvider router={router} />
  </Provider>
  // </React.StrictMode>
);
