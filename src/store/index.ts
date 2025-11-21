// 导入组合函数
import { configureStore } from "@reduxjs/toolkit";
import { type TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

import systemSlice from "./system";
import platformStore from "./platformStore";
import userStore from "./userStore";
import weatherSlice from "./weatherStore";
import deviceSlice from "./deviceStore";

const store = configureStore({
  reducer: {
    system: systemSlice,
    platform: platformStore,
    user: userStore,
    weather: weatherSlice,
    device: deviceSlice,
  },
});

export default store;

// 从 store 本身推断出 `RootState` 和 `AppDispatch` 类型
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// 导出自定义 hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// 导出 action creators
export { setMediaMTXStart, setAnimationDuration, setCameraIconShow, setHumitureIconShow, setDifferentialIconShow, setDeviceIconShow } from "./system";
export { setIsMobile } from "./platformStore";
export { login, login_out, post_Login, validate_token } from "./userStore";
export { fetchWeather } from "./weatherStore";
// export { fetchWeather, selectWeatherData, selectUpdateTime } from "./weatherStore";
export {
  get_alarm_table_data,
  get_log_table_data,
  post_affirm_alarm,
  post_edit_device_params,
  get_full_data,
  setDeviceDataList,
  setDeviceStatusData,
  setAlarmStatusData,
  setLogTotal,
  setFullData,
  selectFJData,
  selectDeviceHeaderData,
  selectDevicePieChartData,
  selectAlarmCompareData,
} from "./deviceStore";
