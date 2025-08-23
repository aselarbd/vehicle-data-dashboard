import type { FC } from 'react';

interface DatePickerProps {
  label: string;
  id: string;
}

const DatePicker: FC<DatePickerProps> = ({ label, id }) => {
  return (
    <div className="form-group">
      <label htmlFor={id}>{label}</label>
      <input
        type="datetime-local"
        id={id}
        className="form-control"
      />
    </div>
  );
};

export default DatePicker;