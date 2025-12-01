import { createSlice } from "@reduxjs/toolkit";

const counterSlice = createSlice({
  name: "system",
  initialState: {
    animationDuration: 500,
    mediaMTXStart: false,
    cameraIconShow: true,
    humitureIconShow: true,
    differentialIconShow: false,
    deviceIconShow: true,
  },
  reducers: {
    setMediaMTXStart: (state, action) => {
      state.mediaMTXStart = action.payload;
    },
    setAnimationDuration: (state, action) => {
      state.animationDuration = action.payload;
    },
    setCameraIconShow: (state, action) => {
      state.cameraIconShow = action.payload;
    },
    setHumitureIconShow: (state, action) => {
      state.humitureIconShow = action.payload;
    },
    setDifferentialIconShow: (state, action) => {
      state.differentialIconShow = action.payload;
    },
    setDeviceIconShow: (state, action) => {
      state.deviceIconShow = action.payload;
    },
  },
});

export const { setMediaMTXStart, setAnimationDuration, setCameraIconShow, setHumitureIconShow, setDifferentialIconShow, setDeviceIconShow } =
  counterSlice.actions;
export default counterSlice.reducer;
