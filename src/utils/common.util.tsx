import { findIndex, slice } from 'ramda';
import { IWeatherOfDay } from '../types/apiResponse.type';
import { isSameDay } from 'date-fns';

const getDayFromToday = (numberOfDay: number, data: IWeatherOfDay[]): IWeatherOfDay[] => {
  const startIndex = findIndex((item: IWeatherOfDay) => isSameDay(item.dt * 1000, Date.now()))(
    data,
  );
  return slice(startIndex, startIndex + numberOfDay)(data);
};

export { getDayFromToday };
