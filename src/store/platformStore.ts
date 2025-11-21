import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { invoke } from "@tauri-apps/api/core";

interface PlatformState {
  platform: string;
  isMobile: boolean;
}

const initialState: PlatformState = {
  platform: "web",
  isMobile: false,
};

export const getPlatform = createAsyncThunk<string, void, { rejectValue: string }>("platform/getPlatform", async () => {
  try {
    const platform = await invoke<string>("get_platform");
    return platform;
  } catch {
    // 直接运行在浏览器环境下，不会编译到 tauri 环境下，所以这里的 invoke 调用不会生效
    return "web";
  }
});

const platformSlice = createSlice({
  name: "platform",
  initialState,
  reducers: {
    setIsMobile: (state, action: PayloadAction<boolean>) => {
      state.isMobile = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getPlatform.fulfilled, (state, action) => {
      state.platform = action.payload;
      //   state.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      //     navigator.userAgent
      //   );
    });
    builder.addCase(getPlatform.rejected, (state, action) => {
      state.platform = action.payload as string;
    });
  },
});

export const { setIsMobile } = platformSlice.actions;
export default platformSlice.reducer;
