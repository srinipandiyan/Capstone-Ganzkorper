import React, { useState, useEffect } from "react";
import SearchForm from "../common/SearchForm";
import GanzkorperApi from "../api/api";
import WorkoutCard from "./WorkoutCard";
import LoadingSpinner from "../common/LoadingSpinner";

/** Displays page containing list of workout cards */
function WorkoutCardList() {
  const [workouts, setWorkouts] = useState(null);

  useEffect(function getWorkoutsOnMount() {
    search();
  }, []);

  /** Triggered by search form submit; reloads workouts. */
  async function search(userRef) {
    let workouts = await GanzkorperApi.getWorkouts(userRef);
    setWorkouts(workouts);
  }

  if (!workouts) return <LoadingSpinner />;

  return (
      <div className="CompanyList col-md-8 offset-md-2">
        <SearchForm searchFor={search} />
        {workouts.length
            ? (
                <div className="WorkoutList-list">
                  {workouts.map(w => (
                      <WorkoutCard
                          key={w.id}
                          name={w.workoutName}
                          exercises={w.exercises}
                      />
                  ))}
                </div>
            ) : (
                <p className="lead">Sorry, no results were found!</p>
            )}
      </div>
  );
}

export default WorkoutCardList;