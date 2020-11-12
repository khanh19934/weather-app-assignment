import React, { ReactElement } from 'react';

interface IProps {
  severity: 'warning' | 'error';
  children: string | ReactElement;
}
const AlertBox: React.FC<IProps> = ({ severity, children }: IProps) => {
  return (
    <div className={`alert ${severity === 'warning' ? 'alert-warning' : 'alert-danger'}`}>
      {children}
    </div>
  );
};

export default AlertBox;
