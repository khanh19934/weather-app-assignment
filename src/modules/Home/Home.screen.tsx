import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { format } from 'date-fns/fp';

import SearchBox from '../../components/SearchBox';
import AlertBox from '../../components/AlertBox';
import WeatherCard from '../../components/WeatherCard';
import { getWeatherByCityName, getWeatherByLocation } from '../../services/app.service';
import { getLocationAsync } from '../../services/location.service';
import { ReactComponent as LocationIcon } from '../../assets/icons/location.svg';
import './Home.scss';
import { IWeatherResponse } from '../../types/apiResponse.type';
import { compose, multiply, pathOr } from 'ramda';
import { getDayFromToday } from '../../utils/common.util';
import InfoItem from '../../components/InfoItem/InfoItem.component';

const DEFAULT_LOCATION = {
  lat: 10.762622,
  long: 106.660172,
};

const Home: React.FC = () => {
  const [searchInput, setSearchInput] = useState<string>('');
  const [isUserDeniedPermission, setIsUserDeniedPermission] = useState<boolean>(false);
  const [weatherResult, setWeatherResult] = useState<IWeatherResponse>();
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [initialLoadingText, setInitialLoadingText] = useState<string>(
    'We are try to getting your location. Please grant permission ...',
  );
  const [showSearchBox, setShowSearchBox] = useState<boolean>(false);

  const searchInputValueRef = useRef('');

  const fetchWeatherByLocation = async (latitude: number, longitude: number): Promise<void> => {
    try {
      setInitialLoadingText('Fetching the data depend on your location now. Please wait...');
      const responseOfDefaultLocation = await getWeatherByLocation({
        latitude,
        longitude,
      });
      setWeatherResult({
        ...responseOfDefaultLocation.data,
        list: getDayFromToday(5, responseOfDefaultLocation.data.list),
      });
      setInitialLoadingText('');
    } catch (e) {
      setErrorMessage('Something Went Wrong');
    }
  };

  useEffect(() => {
    if (!!errorMessage) {
      if (isSearching) {
        setErrorMessage('');
        return;
      }
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
    }
  }, [errorMessage, isSearching]);

  useEffect(() => {
    const fetchInitialData = async (): Promise<void> => {
      try {
        const resultPermission = await navigator.permissions.query({ name: 'geolocation' });
        if (resultPermission.state.toLowerCase() === 'denied') {
          setIsUserDeniedPermission(true);
          await fetchWeatherByLocation(DEFAULT_LOCATION.lat, DEFAULT_LOCATION.long);
          return;
        }
        const coords = await getLocationAsync();
        await fetchWeatherByLocation(coords.latitude, coords.longitude);
      } catch (e) {
        await fetchWeatherByLocation(DEFAULT_LOCATION.lat, DEFAULT_LOCATION.long);
      }
    };
    fetchInitialData();
  }, []);

  const handleSearchLocation = (e: ChangeEvent<HTMLInputElement>): void => {
    setSearchInput(e.target.value);
    searchInputValueRef.current = e.target.value;
  };

  const handleToggleShowSearchBox = (): void => setShowSearchBox(val => !val);

  const handleSubmitSearch = async (e: React.KeyboardEvent<HTMLInputElement>): Promise<void> => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
      try {
        if (isSearching || searchInput.length === 0) return;
        setErrorMessage('');
        setIsSearching(true);
        const res = await getWeatherByCityName(searchInput).catch(() => {
          throw new Error(`Sorry we can not find city name ${searchInputValueRef.current}`);
        });
        setWeatherResult({ ...res.data, list: getDayFromToday(5, res.data.list) });
        setIsSearching(false);
      } catch (e) {
        setIsSearching(false);
        setErrorMessage(e.message);
      }
    }
  };

  const handleFormatTime = (formatType: string, index: number = 0) =>
    compose(format(formatType), multiply(1000), pathOr(0, ['list', index, 'dt']));

  return (
    <div className='container-fluid home'>
      {isSearching && <div className='loading-overlay' />}
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
                <button className='button-change-location' onClick={handleToggleShowSearchBox}>
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

export default Home;
