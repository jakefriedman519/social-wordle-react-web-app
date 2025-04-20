import { Link, useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";

export default function LandingPage() {
  const navigate = useNavigate();
  return (
    <div className="d-flex flex-column align-items-center p-5">
      <h1>Social Wordle</h1>
      <h3 className="text-muted mb-5">Russell Leung, Jake Friedman (CS4550)</h3>
      <p>
        Social Wordle is a website that augments the popular Wordle game. On
        this site, you can play the normal New York Times word of the day,
        create a custom Wordle and play custom Wordles created by other users,
        join tournaments, view leaderboards, and see details from Wikipedia
        about any Wordle puzzle! You can also view your stats, leave comments
        about certain words, and share your profile with friends.
      </p>
      <Button
        variant="primary"
        size="lg"
        className="mt-3 mb-2"
        onClick={() => navigate("/wordle")}
      >
        Take Me To The Wordle!
      </Button>
      <div className="flex flex-row mt-2">
        <Link
          className="me-4 fs-6"
          to={"https://github.com/jakefriedman519/social-wordle-react-web-app"}
        >
          React App Repo
        </Link>
        <Link
          className="fs-6"
          to={
            "https://github.com/jakefriedman519/social-wordle-node-server-app"
          }
        >
          Node Server App Repo
        </Link>
      </div>
    </div>
  );
}
