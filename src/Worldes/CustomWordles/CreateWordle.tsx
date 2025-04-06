import { useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import * as client from "../client";
import { useNavigate } from "react-router-dom";

export interface NewWordle {
  title: string;
  wordleWord: string;
  difficulty: string;
}

export default function CreateWordle() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<NewWordle>({
    title: "",
    wordleWord: "",
    difficulty: "EASY",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ): void => {
    const { name, value } = e.target;
    setFormData((prev: NewWordle) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    await client
      .createCustomWordle({ ...formData, title: formData.title.toUpperCase() })
      .then((response) => {
        navigate(`/wordle/custom/${response._id}`);
      });
  };

  return (
    <Container className="mt-4">
      <h2>Create Your Own Wordle</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group as={Row} className="mb-3" controlId="formTitle">
          <Form.Label column sm={2}>
            Title
          </Form.Label>
          <Col sm={10}>
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
          <Form.Label column sm={2}>
            Word
          </Form.Label>
          <Col sm={10}>
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
          <Form.Label column sm={2}>
            Difficulty
          </Form.Label>
          <Col sm={10}>
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
          Create Wordle
        </Button>
      </Form>
    </Container>
  );
}
