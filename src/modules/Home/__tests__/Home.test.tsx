// @ts-nocheck
import React from 'react';
import renderer from 'react-test-renderer';
import { render, cleanup, act, fireEvent } from '@testing-library/react';
import HomeContainer from '../Home.screen';
import HomeView from '../Home.view';

const defaultProps = {
  errorMessage: '',
  isSearching: false,
  isUserDeniedPermission: false,
  handleSubmitSearch: jest.fn,
  handleSearchLocation: jest.fn,
  handleToggleShowSearchBox: jest.fn,
  initialLoadingText: '',
  weatherResult: { city: { name: 'asd' }, list: [] },
  handleFormatTime: () => jest.fn(),
  showSearchBox: false,
};

describe('Test Snap shot', () => {
  it('render correctly', () => {
    const tree = renderer.create(<HomeContainer />).toJSON();

    expect(tree).toMatchSnapshot();
  });
});

describe('Snapshot home view', () => {
  const tree = renderer.create(<HomeView {...defaultProps} />).toJSON();
  expect(tree).toMatchSnapshot();
});

describe('Test View Via Props', () => {
  test('Should Show getting location in the first time use app', async () => {
    const { getByText } = render(
      <HomeView
        {...{
          ...defaultProps,
          initialLoadingText: 'We are try to getting your location. Please grant permission ...',
        }}
      />,
    );
    expect(
      getByText('We are try to getting your location. Please grant permission ...'),
    ).toBeInTheDocument();
  });

  test('Should Show Fetching data via location', async () => {
    const { getByText } = render(
      <HomeView
        {...{
          ...defaultProps,
          initialLoadingText: 'Fetching the data depend on your location now. Please wait...',
        }}
      />,
    );
    expect(
      getByText('Fetching the data depend on your location now. Please wait...'),
    ).toBeInTheDocument();
  });

  test('Should Show input search box when click button Change Location', async () => {
    const { getByTestId } = render(<HomeView {...{ ...defaultProps, showSearchBox: true }} />);

    expect(getByTestId('searchBox')).toBeVisible();
  });

  test('Should Show overlay when search box', async () => {
    const { getByTestId } = render(
      <HomeView {...{ ...defaultProps, showSearchBox: true, isSearching: true }} />,
    );

    act(() => {
      fireEvent.keyDown(getByTestId('searchBox', { key: 'Enter', code: 'Enter' }));
    });

    expect(getByTestId('overlay')).toBeVisible();
  });
});

describe('Test Home container', () => {
  beforeEach(async () => {
    navigator.permissions = { query: jest.fn().mockResolvedValue };
    navigator.geolocation = {
      getCurrentPosition: jest.fn().mockResolvedValue({ latitude: 1, longitude: 1 }),
    };
  });
  afterEach(cleanup);

  test('Show loading for get location', async () => {
    const { getByText } = render(<HomeContainer />);
    await act(async () => {
      await navigator.permissions.query({ name: 'geolocation' });
    });

    expect(
      getByText('Fetching the data depend on your location now. Please wait...'),
    ).toBeInTheDocument();
  });
});
