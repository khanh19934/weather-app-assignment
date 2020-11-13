import React, { ChangeEvent } from 'react';
import { ReactComponent as LocationIcon } from '../../assets/icons/location.svg';
import { compose, pathOr } from 'ramda';
import InfoItem from '../../components/InfoItem/InfoItem.component';
import WeatherCard from '../../components/WeatherCard';
import SearchBox from '../../components/SearchBox';
import AlertBox from '../../components/AlertBox';
import { IWeatherResponse } from '../../types/apiResponse.type';

interface IProps {
  isSearching: boolean;
  initialLoadingText: string;
  weatherResult: IWeatherResponse | undefined;
  errorMessage: string;
  isUserDeniedPermission: boolean;
  handleSubmitSearch(e: React.KeyboardEvent<HTMLInputElement>): Promise<void>;
  handleToggleShowSearchBox(): void;
  handleSearchLocation(e: ChangeEvent<HTMLInputElement>): void;
  handleFormatTime(
    formatType: string,
    index?: number,
  ): (data: IWeatherResponse | undefined) => string;
  showSearchBox: boolean;
}

const HomeView: React.FC<IProps> = (props: IProps) => {
  const {
    isSearching,
    isUserDeniedPermission,
    errorMessage,
    handleSearchLocation,
    handleSubmitSearch,
    handleToggleShowSearchBox,
    weatherResult,
    initialLoadingText,
    handleFormatTime,
    showSearchBox,
  } = props;

  return (
    <div className='container-fluid home'>
      {isSearching && <div data-testid='overlay' className='loading-overlay' />}
      {!!initialLoadingText ? (
        <>
          <div className='initial-loading'>
            <span>{initialLoadingText}</span>
          </div>
        </>
      ) : (
        <div className='main-content'>
          <div className='left-container'>
            <div className='bg-overlay'></div>
            <div className='today-info-container'>
              <span className='day-of-week'>{handleFormatTime('cccc')(weatherResult)}</span>
              <span className='date'>{handleFormatTime('d MMM yyyy')(weatherResult)}</span>
              <div className='location-group'>
                <LocationIcon className='location-group-icon' color='#fff' />
                <span>{weatherResult?.city.name}</span>
              </div>

              <img
                src={`https://openweathermap.org/img/wn/${pathOr(
                  '02d',
                  ['list', 0, 'weather', 0, 'icon'],
                  weatherResult,
                )}@2x.png`}
                alt='weather'
                className='weather-icon'
              />
              <span className='main-temp'>
                {compose(Math.round, pathOr(0, ['list', 0, 'temp', 'day']))(weatherResult)} °
              </span>
              <span className='text-capitalize'>
                {pathOr('', ['list', 0, 'weather', 0, 'description'])(weatherResult)}
              </span>
            </div>
          </div>

          <div className='right-container'>
            <InfoItem
              content={`${pathOr(0, ['list', 0, 'humidity'])(weatherResult)}%`}
              label='HUMIDITY'
            />
            <InfoItem
              content={`${pathOr(0, ['list', 0, 'speed'])(weatherResult)} m/s`}
              label='WIND SPEED'
            />
            <InfoItem
              content={`${compose(
                Math.round,
                pathOr(0, ['list', 0, 'feels_like', 'day']),
              )(weatherResult)} °`}
              label='FEELS LIKE'
            />
            <InfoItem
              content={`${compose(
                Math.round,
                pathOr(0, ['list', 0, 'temp', 'max']),
              )(weatherResult)} °`}
              label='HIGHEST TEMP'
            />
            <InfoItem
              content={`${compose(
                Math.round,
                pathOr(0, ['list', 0, 'temp', 'min']),
              )(weatherResult)} °`}
              label='LOWEST TEMP'
            />

            <div className='forecast-container'>
              {weatherResult?.list.slice(1, weatherResult?.list.length).map((item, index) => (
                <WeatherCard
                  key={item.dt + index}
                  dt={item.dt}
                  weather={item.weather}
                  temp={item.temp}
                />
              ))}
            </div>
            <div className='input-container'>
              {!showSearchBox ? (
                <button
                  data-testid='submitButton'
                  className='button-change-location'
                  onClick={handleToggleShowSearchBox}
                >
                  <LocationIcon id='locationIcon' />
                  Change Location
                </button>
              ) : (
                <SearchBox
                  handleSubmitSearch={handleSubmitSearch}
                  handleToggleShowSearchBox={handleToggleShowSearchBox}
                  handleSearchLocation={handleSearchLocation}
                />
              )}
            </div>
          </div>
        </div>
      )}
      <div className='home__bottom-warning'>
        {!!errorMessage && <AlertBox severity='error'>{errorMessage}</AlertBox>}
        {isUserDeniedPermission && (
          <AlertBox severity='warning'>
            For get exactly your current location because of blocked location permission. Please
            enable location.
          </AlertBox>
        )}
      </div>
    </div>
  );
};

export default HomeView;
