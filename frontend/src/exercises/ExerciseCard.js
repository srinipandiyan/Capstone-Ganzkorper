import React from "react";
import "./ExerciseCard.css";

/** Displays appended information about an exercise in the form of a card component */
function ExerciseCard({ name, type, muscle, equipment, difficulty }) {

  return (
      <div className="ExerciseCard card"> {applied}
        <div className="card-body">
          <h6 className="card-title">{title}</h6>
          <p>{name}</p>
          <div><small>{type}</small></div>
          <div><small>{muscle}</small></div>
          <div><small>{equipment}</small></div>
          <div><small>{difficulty}</small></div>
        </div>
      </div>
  );
}

export default ExerciseCard;