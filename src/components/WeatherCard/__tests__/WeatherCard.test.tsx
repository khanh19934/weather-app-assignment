import React from 'react';
import renderer from 'react-test-renderer';
import WeatherCard from '../WeatherCard.component';

it('render correctly', () => {
  const tree = renderer
    .create(
      <WeatherCard dt={12} temp={{ min: 1, max: 10 }} weather={[{ description: '', icon: '' }]} />,
    )
    .toJSON();

  expect(tree).toMatchSnapshot();
});
