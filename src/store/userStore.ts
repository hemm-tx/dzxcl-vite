import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { UserService } from "@/api";
import { LoginResponseType, ValidateTokenResponseType } from "@/api";

const initialState = {
  username: "",
  password: "",
  access_token: "",
  token_type: "",
  user_id: "",
  is_verified: false,
  isLoggedIn: false,
};

const local_key = "userinfo";

export const post_Login = createAsyncThunk<LoginResponseType, UserInfoType, { rejectValue: string }>(
  "userStore/post_Login",
  async (params, { rejectWithValue }) =>
    await UserService.login(params)
      .then((res) => res)
      .catch(() => rejectWithValue("登录失败，请检查用户名和密码"))
);

export const validate_token = createAsyncThunk<ValidateTokenResponseType, void, { rejectValue: string }>(
  "userStore/validate_token",
  async (_, { rejectWithValue }) =>
    await UserService.validate_token()
      .then((res) => res)
      .catch(() => rejectWithValue("令牌失效，请重新登录"))
);

const userStore = createSlice({
  name: "userStore",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<UserInfoType>) => {
      Object.assign(state, { ...action.payload, isLoggedIn: true });
      localStorage.setItem(local_key, JSON.stringify(action.payload));
    },
    login_out: (state) => {
      Object.assign(state, initialState);
      localStorage.removeItem(local_key);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(post_Login.fulfilled, (state, action) => {
      const { access_token, token_type, userInfo } = action.payload;
      const _state = { ...state, ...userInfo, access_token, token_type, isLoggedIn: true };
      Object.assign(state, _state);
      localStorage.setItem(local_key, JSON.stringify(_state));
    });
    builder.addCase(validate_token.fulfilled, (state) => {
      const local_userinfo_str = localStorage.getItem(local_key);
      if (local_userinfo_str) {
        const local_userinfo = JSON.parse(local_userinfo_str);
        const { username, password, access_token, token_type, user_id, is_verified } = local_userinfo;
        const _state = { ...state, username, password, access_token, token_type, user_id, is_verified, isLoggedIn: true };
        Object.assign(state, _state);
      }
    });
    builder.addCase(validate_token.rejected, (state) => {
      Object.assign(state, initialState);
      localStorage.removeItem(local_key);
    });
  },
});

export const { login, login_out } = userStore.actions;

export default userStore.reducer;
