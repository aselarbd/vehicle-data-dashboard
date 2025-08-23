import { useState } from 'react';

interface UseFormStateReturn {
  selectedVehicleId: string;
  setSelectedVehicleId: (id: string) => void;
  startDateTime: string;
  setStartDateTime: (dateTime: string) => void;
  endDateTime: string;
  setEndDateTime: (dateTime: string) => void;
  clearForm: () => void;
}

export const useFormState = (): UseFormStateReturn => {
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('');
  const [startDateTime, setStartDateTime] = useState<string>('');
  const [endDateTime, setEndDateTime] = useState<string>('');

  const clearForm = () => {
    setSelectedVehicleId('');
    setStartDateTime('');
    setEndDateTime('');
  };

  return {
    selectedVehicleId,
    setSelectedVehicleId,
    startDateTime,
    setStartDateTime,
    endDateTime,
    setEndDateTime,
    clearForm,
  };
};