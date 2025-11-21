import axios from "axios";

/**
 * 获取天气数据
 * @returns 天气数据
 * @param location 需要查询地区的 ID
 */
export const getWeather = async (location: string) => {
  return axios
    .get(`https://devapi.qweather.com/v7/weather/now?location=${location}&key=3f87ecbd07304006a90ac3bdc2c86478`)
    .then((res) => res.data.now as WeatherDataConfig)
    .catch((err) => {
      throw err;
    });
};

/**
 * 获取城市ID
 * @param location 需要查询地区的名称
 * @param adm 城市的上级行政区划，可设定只在某个行政区划范围内进行搜索，用于排除重名城市或对结果进行过滤。
 * @returns
 */
export const getCityID = async (location: string, adm?: string) => {
  return axios
    .get(`https://p44qbfvkdt.re.qweatherapi.com/geo/v2/city/lookup?location=${location}${adm ? `&adm=${adm}` : ""}&key=3f87ecbd07304006a90ac3bdc2c86478`)
    .then((res) => res.data)
    .catch((err) => console.error(err));
};
