import { AxiosResponse } from 'axios';
import api from './api.service';
import { IWeatherResponse } from '../types/apiResponse.type';

const generateURLByQueryString = (query: string): string =>
  `/forecast/daily?${query}&appid=${process.env.REACT_APP_OPEN_WEATHER_API}&cnt=7&units=metric`;
const getWeatherByLocation = ({
  latitude,
  longitude,
}: {
  latitude: number;
  longitude: number;
}): Promise<AxiosResponse<IWeatherResponse>> => {
  return api.get(generateURLByQueryString(`lat=${latitude}&lon=${longitude}`));
};

const getWeatherByCityName = (cityName: string): Promise<AxiosResponse<IWeatherResponse>> => {
  return api.get(generateURLByQueryString(`q=${cityName}`));
};

export { getWeatherByCityName, getWeatherByLocation };
