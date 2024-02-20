import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import GanzkorperApi from "../api/api";
import ExerciseCardList from "../exercises/ExerciseCardList";
import LoadingSpinner from "../common/LoadingSpinner";

/** Exercise Detail page renders full information about an exercise including the history sessions.*/
function ExerciseDetail(e) {
  const { handle } = useParams();
  console.debug("ExerciseDetail", "handle=", handle);

  const [exercise, setExercise] = useState(null);

  useEffect(function getExerciseAndHistoriesForUser() {
    async function getExercise() {
      setExercise(await GanzkorperApi.getHistories({username, exercise}));
    }

    getExercise();
  }, [handle]);

  if (!exercise) return <LoadingSpinner />;

  return (
      <div className="ExerciseDetail col-md-8 offset-md-2">
        <h4>{exercise.name}</h4>
        <p>{exercise.instructions}</p>
        <ExerciseCardList exercises={exercises} />
      </div>
  );
}

export default ExerciseDetail;