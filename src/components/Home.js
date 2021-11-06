import SpeakersList from "./SpeakersList";
import SpeakersToolbar from "./SpeakerToolbar";
import { useState } from "react";
import { Button, Col, Row, Container, ButtonGroup } from "react-bootstrap";
import HomeButtons from "./HomeButtons";
import PlanWeek from "./PlanWeek";

function Home() {
  const [showSessions, setShowSessions] = useState(true);

  const [componentToShow, setComponentToShow] = useState(0);
  return (
    <div className="d-flex justify-content-center">
      {componentToShow === 0 ? (
        <HomeButtons setComponent={setComponentToShow} />
      ) : null}
      {componentToShow === 1 ? <PlanWeek /> : null}
    </div>
  );
}

export default Home;
