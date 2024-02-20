import React from "react";
import { Link } from "react-router-dom";
import "./WorkoutCard.css";

/** Component renders workout card to provide info on a workout */
function WorkoutCard({ name, exercises}) {
  return (
      <Link className="WorkoutCard card" to={`/workouts/${name}`}>
        <div className="card-body">
          <h6 className="card-title">
            {name}
          </h6>
            <ul>
              {exercises.map((exercise) => (
                <li key={exercise.id}>{exercise.name}</li>
              ))}
          </ul>
        </div>
      </Link>
  );
}

export default WorkoutCard;