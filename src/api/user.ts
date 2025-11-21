import axios from "axios";
import { request } from "./useRequest";

const baseURL = import.meta.env.VITE_API_URL;
const timeout = +import.meta.env.VITE_API_TIMEOUT;
const headers = {
  "Source-Client": "PC-web",
  "content-type": "application/x-www-form-urlencoded",
};

export interface LoginResponseType {
  access_token: string;
  token_type: string;
  userInfo: {
    username: string;
    user_id: string;
    is_verified: boolean;
  };
}

export interface ValidateTokenResponseType {
  status: number;
  message: string;
}

export class UserService {
  static url_prefix = "";

  /**
   * 登录
   * @param params {UserInfoType}
   * @returns 返回token信息
   */
  static async login(params: UserInfoType): Promise<LoginResponseType> {
    return await axios
      .create({ baseURL, timeout, headers })
      .post(`${this.url_prefix}/login`, { ...params, grant_type: "password" })
      .then((res) => {
        if (res.status === 200) return Promise.resolve(res.data);
        else return Promise.reject(res.data);
      })
      .catch((err) => Promise.reject(err));
  }

  /**
   * 验证token
   * @returns 返回登录状态信息
   */
  static async validate_token(): Promise<ValidateTokenResponseType> {
    return await request(`${this.url_prefix}/validate_token`, {}, "GET");
  }
}
