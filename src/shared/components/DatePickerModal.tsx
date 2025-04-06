import { SetStateAction, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

// TODO move this logic outside of this component
export default function DatePickerModal({
  datePickerHandler,
}: {
  datePickerHandler: (date: string) => void;
}) {
  const [show, setShow] = useState(false);
  const [date, setDate] = useState("");

  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);
  const handleChange = (e: { target: { value: SetStateAction<string> } }) =>
    setDate(e.target.value);

  const handleSubmit = () => {
    handleClose();
    if (date) {
      datePickerHandler(date);
    }
  };

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Open Date Picker
      </Button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Select a Date</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="formDate">
            <Form.Label>Date</Form.Label>
            <Form.Control type="date" value={date} onChange={handleChange} />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Save Date
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
