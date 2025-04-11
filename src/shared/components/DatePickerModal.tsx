import { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface DatePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDateChange: (date: Date) => void;
}

export default function DatePickerModal({
  isOpen,
  onClose,
  onDateChange,
}: DatePickerModalProps) {
  const [date, setDate] = useState<Date>();

  const handleSelect = (newDate: Date | null) => {
    if (newDate) {
      setDate(newDate);
    }
  };

  const normalizeDate = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  return (
    <Modal show={isOpen} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Select Date</Modal.Title>
      </Modal.Header>
      <Modal.Body className="d-flex justify-content-center py-4">
        <ReactDatePicker
          selected={date}
          onChange={handleSelect}
          inline
          maxDate={new Date()}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
        <Button variant="primary" onClick={() => date && onDateChange(normalizeDate(date))}>
          Apply
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
