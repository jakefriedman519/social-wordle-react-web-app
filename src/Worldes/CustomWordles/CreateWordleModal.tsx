import { useEffect, useState } from "react";
import { Form, Button, Modal, Row, Col } from "react-bootstrap";
import * as client from "../client";
import { useNavigate } from "react-router-dom";

export interface Wordle {
  title: string;
  wordleWord: string;
  difficulty: string;
  _id?: string;
}

export default function CreateWordleModal({
  show,
  handleClose,
  wordle,
}: {
  show: boolean;
  handleClose: () => void;
  wordle: Wordle | null;
}) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Wordle>(
    wordle || {
      title: "",
      wordleWord: "",
      difficulty: "EASY",
    }
  );

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ): void => {
    const { name, value } = e.target;
    setFormData((prev: Wordle) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    if (wordle) {
      await client
        .updateCustomWordle({
          ...formData,
          wordleWord: formData.wordleWord.toUpperCase(),
          _id: wordle._id,
        })
        .then(() => {
          handleClose(); // Close the modal after submission
        });
    } else {
      await client
        .createCustomWordle({
          ...formData,
          wordleWord: formData.wordleWord.toUpperCase(),
        })
        .then((response) => {
          handleClose(); // Close the modal after submission
          navigate(`/wordle/custom/${response._id}`);
        });
    }
  };

  useEffect(() => {
    if (wordle) {
      setFormData({
        title: wordle.title,
        wordleWord: wordle.wordleWord,
        difficulty: wordle.difficulty,
      });
      console.log("Editing wordle", wordle);
    }
  }, [wordle]);

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {wordle ? "Edit Wordle" : "Create Your Own Wordle"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group as={Row} className="mb-3" controlId="formTitle">
            <Form.Label column sm={3}>
              Title
            </Form.Label>
            <Col sm={9}>
              <Form.Control
                type="text"
                placeholder="Enter Wordle title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} className="mb-3" controlId="formWord">
            <Form.Label column sm={3}>
              Word
            </Form.Label>
            <Col sm={9}>
              <Form.Control
                type="text"
                placeholder="Enter target word"
                name="wordleWord"
                value={formData.wordleWord}
                onChange={handleChange}
                required
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} className="mb-3" controlId="formDifficulty">
            <Form.Label column sm={3}>
              Difficulty
            </Form.Label>
            <Col sm={9}>
              <Form.Select
                name="difficulty"
                value={formData.difficulty}
                onChange={handleChange}
              >
                <option value="EASY">EASY</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HARD">HARD</option>
              </Form.Select>
            </Col>
          </Form.Group>

          <Button variant="primary" type="submit">
            {wordle ? "Edit Wordle" : "Create Wordle"}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
