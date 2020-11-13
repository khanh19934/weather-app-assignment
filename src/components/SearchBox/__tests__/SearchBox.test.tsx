import React from 'react';
import renderer from 'react-test-renderer';
import SearchBox from '../SearchBox.component';

describe('Snapshot test', () => {
  test('render correctly', () => {
    const tree = renderer
      .create(
        <SearchBox
          handleSearchLocation={jest.fn}
          handleSubmitSearch={jest.fn}
          handleToggleShowSearchBox={jest.fn}
        />,
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });
});
