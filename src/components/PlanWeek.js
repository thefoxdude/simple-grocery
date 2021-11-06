import { useState } from "react";

function PlanWeek() {
  const [componentToShow, setComponentToShow] = useState();
  return (
    <>
      <div className="d-flex flex-column p-3">
        <div
          variant="primary px-3 m-4"
          size="lg"
          onClick={() => {
            setComponentToShow(1);
          }}
        >
          MONDAY
        </div>
        <div
          variant="primary px-3 m-4"
          size="lg"
          onClick={() => {
            setComponentToShow(2);
          }}
        >
          TUESDAY
        </div>
        <div
          variant="primary px-3 m-4"
          size="lg"
          onClick={() => {
            setComponentToShow(3);
          }}
        >
          WEDNESDAY
        </div>
      </div>
    </>
  );
}

export default PlanWeek;
