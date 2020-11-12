import React from 'react';
import renderer from 'react-test-renderer';
import AlertBox from '../AlertBox.component';

it('render correctly', () => {
  const tree = renderer
    .create(
      <AlertBox severity='warning'>
        For get exactly your current location because of blocked location permission. Please enable
        location.
      </AlertBox>,
    )
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('render correctly with severity error', () => {
  const tree = renderer
    .create(<AlertBox severity='error'>Sorry we can not find city name abc</AlertBox>)
    .toJSON();

  expect(tree).toMatchSnapshot();
});
