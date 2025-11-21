import { getWeather } from "@/api";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
// import { createSelector } from "reselect";
// import { RootState } from ".";

export const fetchWeather = createAsyncThunk("weather/fetchWeather", async () => {
  return getWeather("101250309");
});

interface WeatherSliceProps {
  loading: boolean;
  error: boolean;
  weather: WeatherDataConfig;
  weatherData: { value: string; title: string; suffix: string }[];
}

const initialState: WeatherSliceProps = {
  loading: false,
  error: true,
  weatherData: [],
  weather: {
    obsTime: "",
    temp: "",
    feelsLike: "",
    icon: "",
    text: "",
    wind360: "",
    windDir: "",
    windScale: "",
    windSpeed: "",
    humidity: "",
    precip: "",
    pressure: "",
    vis: "",
  },
};

const weatherSlice = createSlice({
  name: "weather",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchWeather.pending, (state) => {
      state.loading = true;
      state.error = false;
    });
    builder.addCase(fetchWeather.rejected, (state) => {
      state.loading = false;
      state.error = true;
    });
    builder.addCase(fetchWeather.fulfilled, (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.weather = action.payload;
      state.weatherData = [
        {
          value: action.payload.windScale,
          title: action.payload.windDir,
          suffix: "级",
        },
        {
          value: action.payload.humidity,
          title: "相对湿度",
          suffix: "%RH",
        },
        {
          value: action.payload.feelsLike,
          title: "体感温度",
          suffix: "°C",
        },
        {
          value: action.payload.vis,
          title: "能见度",
          suffix: "km",
        },
        {
          value: action.payload.precip,
          title: "降水量",
          suffix: "mm",
        },
        {
          value: action.payload.pressure,
          title: "大气压",
          suffix: "hPa",
        },
      ];
    });
  },
});

export default weatherSlice.reducer;

// export const selectWeatherData = createSelector(
//   (state: RootState) => state.weather.weather,
//   (weather) => {
//     return [
//       {
//         value: weather.windScale,
//         title: weather.windDir,
//         suffix: "级",
//       },
//       {
//         value: weather.humidity,
//         title: "相对湿度",
//         suffix: "%RH",
//       },
//       {
//         value: weather.feelsLike,
//         title: "体感温度",
//         suffix: "°C",
//       },
//       {
//         value: weather.vis,
//         title: "能见度",
//         suffix: "km",
//       },
//       {
//         value: weather.precip,
//         title: "降水量",
//         suffix: "mm",
//       },
//       {
//         value: weather.pressure,
//         title: "大气压",
//         suffix: "hPa",
//       },
//     ];
//   }
// );

// export const selectUpdateTime = createSelector(
//   (state: RootState) => state.weather.weather.obsTime,
//   (obsTime) => {
//     if (obsTime === "") return undefined;
//     const date = new Date(obsTime);
//     const year = date.getFullYear();
//     const month = (date.getMonth() + 1).toString().padStart(2, "0");
//     const day = date.getDate().toString().padStart(2, "0");
//     const hour = date.getHours().toString().padStart(2, "0");
//     const minute = date.getMinutes().toString().padStart(2, "0");
//     const second = date.getSeconds().toString().padStart(2, "0");
//     return [`${year}-${month}-${day}`, `${hour}:${minute}:${second}`];
//   }
// );
