import { useEffect, useState } from "react";
import { BsCalendar, BsChevronLeft, BsChevronRight } from "react-icons/bs";
import { Card, Button, Row, Col } from "react-bootstrap";

import LeaderboardScoreCard from "./LeaderboardScoreCard";
import DatePickerModal from "../shared/components/DatePickerModal";
import { WordleGuess } from ".";

export default function DailyLeaderboardComponent({
  leaderboard,
  onDateChange,
  allowDateChange,
}: {
  leaderboard: WordleGuess[];
  onDateChange: (date: string) => void;
  allowDateChange: boolean;
}) {
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [isDatePickerOpen, setIsDatePickerOpen] = useState<boolean>(false);

  const handleDateChange = (date: Date) => {
    if (date) {
      const dateString = date.toISOString().split("T")[0];
      setSelectedDate(dateString);
      setIsDatePickerOpen(false);
    }
  };

  const goToPreviousDay = () => {
    const prevDay = new Date(selectedDate);
    prevDay.setDate(prevDay.getDate() - 1);
    handleDateChange(prevDay);
  };

  const goToNextDay = () => {
    const nextDay = new Date(selectedDate);
    nextDay.setDate(nextDay.getDate() + 1);
    handleDateChange(nextDay);
  };

  useEffect(() => {
    onDateChange(selectedDate);
  }, [selectedDate]);

  return (
    <Card>
      <Card.Header className="d-flex justify-content-between align-items-center">
        <h5 className="mb-0">
          {selectedDate === new Date().toISOString().split("T")[0]
            ? "Today's"
            : selectedDate}
          &nbsp;Results
        </h5>
        {allowDateChange && (
          <div className="d-flex gap-2">
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={goToPreviousDay}
              aria-label="Previous day"
            >
              <BsChevronLeft style={{ fontSize: "16px" }} />
            </Button>
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={() => setIsDatePickerOpen(true)}
              className="d-flex align-items-center gap-2"
            >
              <BsCalendar style={{ fontSize: "16px" }} />
              <span className="d-none d-sm-inline">Change Date</span>
            </Button>
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={goToNextDay}
              disabled={selectedDate === new Date().toISOString().split("T")[0]}
              aria-label="Next day"
            >
              <BsChevronRight style={{ fontSize: "16px" }} />
            </Button>
          </div>
        )}
      </Card.Header>
      <Card.Body>
        {leaderboard.length ? (
          <>
            <Row className="px-3 py-2 text-muted small fw-medium justify-content-between">
              <Col xs={2} className="px-2">
                Rank
              </Col>
              <Col xs={2} className="text-end px-2">
                Score
              </Col>
            </Row>
            <div className="mt-2">
              {leaderboard.map((entry, index) => (
                <LeaderboardScoreCard
                  key={entry._id}
                  rank={index + 1}
                  entry={entry}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center text-muted py-4">
            No results available.
          </div>
        )}
      </Card.Body>
      <DatePickerModal
        isOpen={isDatePickerOpen}
        onClose={() => setIsDatePickerOpen(false)}
        onDateChange={handleDateChange}
      />
    </Card>
  );
}
