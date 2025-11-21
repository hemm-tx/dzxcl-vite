import axios, { type InternalAxiosRequestConfig } from "axios";
import { useNavigate } from "react-router-dom";
import { useRef, useEffect } from "react";
import { showMessage } from "./status.ts";
import { message, modal } from "@/utils/antdGlobal.tsx";

const pendingRequests = new Map();

const generateReqKey = (config: InternalAxiosRequestConfig) => {
  const { url, method, params, data } = config;
  return `${url}-${method}-${JSON.stringify(params)}-${JSON.stringify(data)}`;
};

const addPendingRequest = (config: InternalAxiosRequestConfig) => {
  const reqKey = generateReqKey(config);
  config.cancelToken =
    config.cancelToken ||
    new axios.CancelToken((cancel) => {
      if (!pendingRequests.has(reqKey)) {
        pendingRequests.set(reqKey, cancel);
      }
    });
};

const removePendingRequest = (config: InternalAxiosRequestConfig) => {
  const reqKey = generateReqKey(config);
  if (pendingRequests.has(reqKey)) {
    pendingRequests.delete(reqKey);
  }
};

const cancelPendingRequest = (config: InternalAxiosRequestConfig) => {
  const reqKey = generateReqKey(config);
  if (pendingRequests.has(reqKey)) {
    const cancel = pendingRequests.get(reqKey);
    if (cancel) cancel("取消请求");
    pendingRequests.delete(reqKey);
  }
};

const instance = axios.create({
  // 这里是将请求的 baseURL 放入环境变量中，方便在不同环境下切换
  baseURL: import.meta.env.VITE_API_URL,
  timeout: +import.meta.env.VITE_API_TIMEOUT,

  // 这里请求的 headers 定义，可以根据实际情况进行修改
  // 也可以和上面的 baseURL 一样放入环境变量中
  headers: {
    "Source-Client": "PC-web",
  },
});

// 封装请求拦截器，在请求前添加 token 信息
instance.interceptors.request.use((_config) => {
  cancelPendingRequest(_config);
  addPendingRequest(_config);

  const userInfo_str = localStorage.getItem("userinfo");
  if (userInfo_str !== null) {
    const userInfo = JSON.parse(userInfo_str);
    const { access_token, token_type } = userInfo;
    if (access_token !== "" && token_type !== "") {
      _config.headers.Authorization = `${token_type} ${access_token}`;
    }
  }

  return _config;
});

// 封装响应拦截器，在响应后统一处理错误信息
instance.interceptors.response.use(
  (response) => {
    removePendingRequest(response.config);
    return response.data;
  },
  (error) => {
    removePendingRequest(error.config);
    throw error;
  }
);

// 封装请求方法
export async function request<T>(
  url: string = "",
  params: { [key: string]: unknown } = {},
  method: "GET" | "POST" | "OPTIONS" = "GET",
  headers: { [key: string]: string } = {}
) {
  return new Promise<T>((resolve, reject) => {
    let promise;
    instance.defaults.headers = { ...instance.defaults.headers, ...headers };

    if (method === "GET") promise = instance({ url, params });
    else if (method === "POST") promise = instance({ url, data: params, method: "POST" });
    else promise = instance({ url, method: "OPTIONS" });

    promise.then((res) => resolve(res as T)).catch((err) => reject(err));
  });
}

export function useAxiosNavigation() {
  const navRef = useRef(useNavigate());

  useEffect(() => {
    const interceptor = instance.interceptors.response.use(
      (response) => response,
      (error) => {
        switch (error?.response?.status) {
          // 这里可以根据实际情况进行修改
          // 401 代表登录失效，需要弹窗提示用户重新登录
          case 401:
            modal.info({
              title: "登录失效",
              content: "登录已失效，请重新登录",
              onOk: () => navRef.current("/login"),
            });
            break;
          // 其他情况可以根据实际情况进行处理，我这里是调用了前面封装好的 showMessage 函数，弹窗提示用户
          default:
            message.warning(showMessage(error.response.status));
            break;
        }
        return Promise.reject(error);
      }
    );

    return () => instance.interceptors.response.eject(interceptor);
  }, []);
}
