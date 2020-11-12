import React from 'react';
import renderer from 'react-test-renderer';
import InfoItem from '../InfoItem.component';

it('render correctly', () => {
  const tree = renderer.create(<InfoItem content='12%' label='HUMIDITY' />).toJSON();

  expect(tree).toMatchSnapshot();
});
