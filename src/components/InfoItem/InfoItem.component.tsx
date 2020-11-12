import React from 'react';

interface IProps {
  content: string;
  label: string;
}

const InfoItem: React.FC<IProps> = ({ content, label }: IProps) => {
  return (
    <div className='d-flex justify-content-between mb-2 info-item'>
      <span className='text-white'>{label}</span>
      <span className='text-white'>{content}</span>
    </div>
  );
};

export default InfoItem;
