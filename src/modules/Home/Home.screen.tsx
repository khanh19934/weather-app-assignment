import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { format } from 'date-fns/fp';

import { getWeatherByCityName, getWeatherByLocation } from '../../services/app.service';
import { getLocationAsync } from '../../services/location.service';
import './Home.scss';
import { IWeatherResponse } from '../../types/apiResponse.type';
import { compose, multiply, pathOr } from 'ramda';
import { getDayFromToday } from '../../utils/common.util';
import HomeView from './Home.view';

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

  const handleFormatTime = (
    formatType: string,
    index: number = 0,
  ): ((data: IWeatherResponse | undefined) => string) =>
    compose(format(formatType), multiply(1000), pathOr(0, ['list', index, 'dt']));

  return (
    <HomeView
      errorMessage={errorMessage}
      isSearching={isSearching}
      isUserDeniedPermission={isUserDeniedPermission}
      handleSubmitSearch={handleSubmitSearch}
      handleSearchLocation={handleSearchLocation}
      handleToggleShowSearchBox={handleToggleShowSearchBox}
      initialLoadingText={initialLoadingText}
      weatherResult={weatherResult}
      handleFormatTime={handleFormatTime}
      showSearchBox={showSearchBox}
    />
  );
};

export default Home;
