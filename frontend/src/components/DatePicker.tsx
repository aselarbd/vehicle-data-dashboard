import type { FC } from 'react';

interface DatePickerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  id: string;
}

const DatePicker: FC<DatePickerProps> = ({ label, value, onChange, id }) => {
  return (
    <div className="form-group">
      <label htmlFor={id}>{label}</label>
      <input
        type="datetime-local"
        id={id}
        className="form-control"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default DatePicker;