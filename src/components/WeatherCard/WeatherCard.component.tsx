import React from 'react';
import { format } from 'date-fns';

interface IWeather {
  icon: string;
  description: string;
}

interface IProps {
  dt: number;
  weather: IWeather[];
  temp: {
    min: number;
    max: number;
  };
}

const WeatherCard: React.FC<IProps> = ({ dt, weather, temp }: IProps) => {
  return (
    <div className='forecast-day'>
      <img
        src={`https://openweathermap.org/img/wn/${weather[0].icon || '02d'}@2x.png`}
        alt='weather'
        className='weather-icon-card'
      />
      <span>{format(dt * 1000, 'ccc')}</span>
      <span>
        {Math.round(temp.min)} ° - {Math.round(temp.max)} °
      </span>
    </div>
  );
};

export default WeatherCard;
