import { Suspense, useEffect, useState } from "react";
import { Container, Card, Button, Badge, Placeholder } from "react-bootstrap";
import { Link, useParams, useSearchParams } from "react-router-dom";
import * as client from "./client";

interface WordDetails {
  title: string;
  extract: string;
  related: string[];
  error?: string;
}

export default function Details() {
  const { day } = useParams<{ day: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showDetails, setShowDetails] = useState(false);
  const [wordDetails, setWordDetails] = useState<WordDetails>();

  useEffect(() => {
    setShowDetails(searchParams.get("showDetails") === "true");
    const fetchDetails = async () => {
      await client.getWordDetails((day || "").toLowerCase()).then((data) => {
        setWordDetails(data);
      });
    };
    fetchDetails();
  }, [day, searchParams]);

  return (
    <Container className="py-5">
      {showDetails ? (
        <div className="mb-5">
          <div className="text-center">
            <h1 className="display-4 fw-bold mb-2">
              {wordDetails?.title.toUpperCase()}
            </h1>
            <p className="text-muted">Detailed information about this word</p>
          </div>

          <Suspense fallback={<WordInfoSkeleton />}>
            <WordInfo details={wordDetails} />
          </Suspense>
        </div>
      ) : (
        <div className="text-center mb-5">
          <p className="display-4 fw-bold mb-2">
            Wordle game not completed yet
          </p>
          <p className="display-6 text-muted mb-5">
            Please complete the game to view details
          </p>
          <Button
            variant="danger"
            onClick={() => {
              setShowDetails(true);
              setSearchParams({ showDetails: "true" });
            }}
          >
            Show Details Anyways (THIS WILL REVEAL THE ANSWER)
          </Button>
        </div>
      )}
    </Container>
  );
}

async function WordInfo({ details }: { details?: WordDetails }) {
  if (!details || details.error) {
    return (
      <Card className="mb-4">
        <Card.Header>
          <Card.Title>No information found</Card.Title>
          <Card.Subtitle className="text-muted">
            We couldn't find any information about this word on Wikipedia.
          </Card.Subtitle>
        </Card.Header>
        <Card.Body>
          <p>Try searching for a different word or check your spelling.</p>
        </Card.Body>
      </Card>
    );
  }

  return (
    <div className="mt-4">
      <Card className="mb-4">
        <Card.Header>
          <Card.Title>Definition & Information</Card.Title>
          <Card.Subtitle className="text-muted">
            Information sourced from Wikipedia
          </Card.Subtitle>
        </Card.Header>
        <Card.Body>
          <div className="mb-4">
            <p>{details.extract}</p>
          </div>

          <div className="d-flex justify-content-end">
            <Button
              variant="outline-secondary"
              as="a"
              href={`https://en.wikipedia.org/wiki/${encodeURIComponent(details?.title)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="d-inline-flex align-items-center"
            >
              View on Wikipedia
            </Button>
          </div>
        </Card.Body>
      </Card>

      {details.related && details.related.length > 0 && (
        <Card>
          <Card.Header>
            <Card.Title>Related Terms</Card.Title>
            <Card.Subtitle className="text-muted">
              Words and phrases related to "{details?.title.toUpperCase()}"
            </Card.Subtitle>
          </Card.Header>
          <Card.Body>
            <div className="d-flex flex-wrap gap-2">
              {details.related.map((term, index) => (
                <>
                  <Link
                    to={`/details/${encodeURIComponent(term)}`}
                    key={index}
                    className="text-decoration-none"
                  >
                    <Badge bg="secondary" className="p-2 text-decoration-none">
                      {term}
                    </Badge>
                  </Link>
                </>
              ))}
            </div>
          </Card.Body>
        </Card>
      )}
    </div>
  );
}

function WordInfoSkeleton() {
  return (
    <div className="mt-4">
      <Card className="mb-4">
        <Card.Header>
          <Placeholder as={Card.Title} animation="glow">
            <Placeholder xs={6} />
          </Placeholder>
          <Placeholder as={Card.Subtitle} animation="glow">
            <Placeholder xs={8} />
          </Placeholder>
        </Card.Header>
        <Card.Body>
          <Placeholder as="p" animation="glow">
            <Placeholder xs={12} />
            <Placeholder xs={12} />
            <Placeholder xs={8} />
          </Placeholder>
          <div className="d-flex justify-content-end">
            <Placeholder.Button variant="outline-secondary" xs={4} />
          </div>
        </Card.Body>
      </Card>

      <Card>
        <Card.Header>
          <Placeholder as={Card.Title} animation="glow">
            <Placeholder xs={4} />
          </Placeholder>
          <Placeholder as={Card.Subtitle} animation="glow">
            <Placeholder xs={7} />
          </Placeholder>
        </Card.Header>
        <Card.Body>
          <div className="d-flex flex-wrap gap-2">
            <Placeholder.Button variant="secondary" xs={2} />
            <Placeholder.Button variant="secondary" xs={3} />
            <Placeholder.Button variant="secondary" xs={2} />
            <Placeholder.Button variant="secondary" xs={4} />
            <Placeholder.Button variant="secondary" xs={3} />
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}
