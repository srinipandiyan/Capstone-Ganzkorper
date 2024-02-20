import React from "react";
import ExerciseCard from "./ExerciseCard";

/** Renders a list of exercise card components */
function ExerciseCardList({ exercises }) {
  return (
      <div className="ExerciseCardList">
        {exercises.map(e => (
            <ExerciseCard
                key={e.id}
                name={e.name}
                type={e.type}
                muscle={e.muscle}
                equipment={e.equipment}
                difficulty={e.difficulty}
            />
        ))}
      </div>
  );
}

export default ExerciseCardList;