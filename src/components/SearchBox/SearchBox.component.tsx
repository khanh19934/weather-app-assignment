import React from 'react';
import { ReactComponent as SearchIcon } from '../../assets/icons/search_icon.svg';
import { ReactComponent as CloseIcon } from '../../assets/icons/close_icon.svg';
import './search-box.scss';

interface IProps {
  handleSearchLocation(e: React.ChangeEvent<HTMLInputElement>): void;
  handleToggleShowSearchBox(): void;
  handleSubmitSearch(e: React.KeyboardEvent<HTMLInputElement>): Promise<void>;
}

const SearchBox: React.FC<IProps> = ({
  handleSearchLocation,
  handleToggleShowSearchBox,
  handleSubmitSearch,
}: IProps) => {
  return (
    <div className='form-group search-box'>
      <div className='form-control-feedback'>
        <SearchIcon />
      </div>
      <input
        autoFocus
        onKeyDown={handleSubmitSearch}
        onChange={handleSearchLocation}
        type='text'
        className='form-control'
        placeholder='Search by city name...'
      />
      <div className='close-search' onClick={handleToggleShowSearchBox}>
        <CloseIcon />
      </div>
    </div>
  );
};

export default SearchBox;
