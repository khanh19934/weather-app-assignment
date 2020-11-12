import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { format } from 'date-fns';

import SearchBox from '../../components/SearchBox';
import { getWeatherByCityName, getWeatherByLocation } from '../../services/app.service';
import { getLocationAsync } from '../../services/location.service';
import { ReactComponent as LocationIcon } from '../../assets/icons/location.svg';
import './Home.scss';
import { IWeatherResponse } from '../../types/apiResponse.type';
import { compose, multiply, pathOr } from 'ramda';
import { getDayFromToday } from '../../utils/common.util';
import { throws } from 'assert';

const Home: React.FC = () => {
  const [searchInput, setSearchInput] = useState<string>('');
  const [isUserDeniedPermission, setIsUserDeniedPermission] = useState<boolean>(false);
  const [weatherResult, setWeatherResult] = useState<IWeatherResponse>();
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [initialLoadingText, setInitialLoadingText] = useState<string>(
    'We are try to getting your location. Please access the permission ...',
  );
  const [showSearchBox, setShowSearchBox] = useState<boolean>(false);

  const searchInputValueRef = useRef('');

  const fetchInitialData = async (): Promise<void> => {
    try {
      const resultPermission = await navigator.permissions.query({ name: 'geolocation' });
      if (resultPermission.state.toLowerCase() === 'denied') {
        setIsUserDeniedPermission(true);
        setInitialLoadingText('Fetching the data depend on your location now. Please wait...');
        const responseOfDefaultLocation = await getWeatherByLocation({
          latitude: 10.762622,
          longitude: 106.660172,
        });
        setWeatherResult({
          ...responseOfDefaultLocation.data,
          list: getDayFromToday(5, responseOfDefaultLocation.data.list),
        });
        setInitialLoadingText('');
        return;
      }
      const coords = await getLocationAsync();

      setInitialLoadingText('Fetching the data depend on your location now. Please wait...');
      const res = await getWeatherByLocation({
        latitude: coords.latitude,
        longitude: coords.longitude,
      });
      setWeatherResult({ ...res.data, list: getDayFromToday(5, res.data.list) });
      setInitialLoadingText('');
    } catch (e) {
      // TODO Handle Error here
      if (e.response.status === 404) {
        console.log('e');
        setErrorMessage(`Sorry we can not find city name ${searchInputValueRef}`);
      }
    }
  };

  useEffect(() => {
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
        console.log('call here');
        setIsSearching(true);
        const res = await getWeatherByCityName(searchInput).catch(e => {
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

  return (
    <div className='container-fluid home'>
      {!!initialLoadingText ? (
        initialLoadingText
      ) : (
        <div className='main-content'>
          <div className='left-container'>
            <div className='bg-overlay'></div>
            <div className='today-info-container'>
              <span className='day-of-week'>
                {format(
                  compose(multiply(1000), pathOr(0, ['list', 0, 'dt']))(weatherResult),
                  'cccc',
                )}
              </span>
              <span className='date'>
                {format(
                  compose(multiply(1000), pathOr(0, ['list', 0, 'dt']))(weatherResult),
                  'd MMM yyyy',
                )}
              </span>
              <div className='location-group'>
                <LocationIcon className='location-group-icon' color='#fff' />
                <span>{weatherResult?.city.name}</span>
              </div>

              <img
                src={`http://openweathermap.org/img/wn/${pathOr(
                  '02d',
                  ['list', 0, 'weather', 0, 'icon'],
                  weatherResult,
                )}@2x.png`}
                alt='weather'
                className='weather-icon'
              />
              <span className='main-temp'>
                {pathOr(0, ['list', 0, 'temp', 'day'], weatherResult)} °
              </span>
              <span className='text-capitalize'>
                {pathOr('', ['list', 0, 'weather', 0, 'description'])(weatherResult)}
              </span>
            </div>
          </div>

          <div className='right-container'>
            <div className='d-flex justify-content-between mb-2 info-item'>
              <span className='text-white'>HUMIDITY</span>
              <span className='text-white'>
                {pathOr(0, ['list', 0, 'humidity'])(weatherResult)}%
              </span>
            </div>
            <div className='d-flex justify-content-between mb-2 info-item'>
              <span className='text-white'>WIND SPEED</span>
              <span className='text-white'>
                {pathOr(0, ['list', 0, 'speed'])(weatherResult)} m/s
              </span>
            </div>
            <div className='d-flex justify-content-between mb-2 info-item'>
              <span className='text-white'>FEELS LIKE</span>
              <span className='text-white'>
                {Math.round(pathOr(0, ['list', 0, 'feels_like', 'day'])(weatherResult))} °
              </span>
            </div>
            <div className='d-flex justify-content-between mb-2 info-item'>
              <span className='text-white'>HIGHEST TEMP</span>
              <span className='text-white'>
                {Math.round(pathOr(0, ['list', 0, 'temp', 'max'])(weatherResult))} °
              </span>
            </div>
            <div className='d-flex justify-content-between mb-2 info-item'>
              <span className='text-white'>LOWEST TEMP</span>
              <span className='text-white'>
                {Math.round(pathOr(0, ['list', 0, 'temp', 'min'])(weatherResult))} °
              </span>
            </div>

            <div className='forecast-container'>
              {weatherResult?.list.slice(1, weatherResult?.list.length).map((item, index) => (
                <div key={item.dt + index} className='forecast-day'>
                  <img
                    src={`http://openweathermap.org/img/wn/${item.weather[0].icon || '02d'}@2x.png`}
                    alt='weather'
                    className='weather-icon-card'
                  />
                  <span>{format(item.dt * 1000, 'ccc')}</span>
                  <span>
                    {Math.round(item.temp.min)} ° - {Math.round(item.temp.max)} °
                  </span>
                </div>
              ))}
            </div>
            <div className='input-container'>
              {!showSearchBox ? (
                <button
                  id='undo'
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

      {isUserDeniedPermission && (
        <div className='alert alert-warning home__bottom-warning' role='alert'>
          For get exactly your current location because of blocked location permission. Please
          enable location.
        </div>
      )}
      {errorMessage}
    </div>
  );
};

export default Home;
