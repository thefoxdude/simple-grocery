import { useState } from "react";
import { Button } from "react-bootstrap";

function HomeButtons({ setComponentToShow }) {
  return (
    <div className="d-flex flex-column p-3">
      <Button
        variant="primary px-3 m-4"
        size="lg"
        onClick={() => {
          setComponentToShow(1);
        }}
      >
        PLAN WEEK
      </Button>
      <Button
        variant="primary px-3 m-4"
        size="lg"
        onClick={() => {
          setComponentToShow(2);
        }}
      >
        MENU ITEM
      </Button>
      <Button
        variant="primary px-3 m-4"
        size="lg"
        onClick={() => {
          setComponentToShow(3);
        }}
      >
        SHOPPING LIST
      </Button>
    </div>
  );
}

export default HomeButtons;
