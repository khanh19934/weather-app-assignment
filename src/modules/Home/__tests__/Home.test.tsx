import React from 'react';
import renderer from 'react-test-renderer';
import { render, waitFor, cleanup, act } from '@testing-library/react';
import Home from '../Home.screen';
import axios from 'axios';
// import { getWeatherByCityName, getWeatherByLocation } from '../../../services/app.service';

describe('Test Snap shot', () => {
  it('render correctly', () => {
    const tree = renderer.create(<Home />).toJSON();

    expect(tree).toMatchSnapshot();
  });
});

describe('Test Component', () => {
  beforeEach(() => {
    navigator.permissions = { query: jest.fn() };
    navigator.geolocation = {
      getCurrentPosition: jest.fn().mockResolvedValue({ latitude: 1, longitude: 1 }),
    };
  });
  afterEach(cleanup);

  test('Show loading for get location', async () => {
    const { getByText } = render(<Home />);
    await act(async () => {
      getByText('We are try to getting your location. Please grant permission ...');
      await navigator.permissions.query({ name: 'geolocation' });
    });
    getByText('Fetching the data depend on your location now. Please wait...');
  });
});
