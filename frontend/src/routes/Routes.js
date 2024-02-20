import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import Homepage from "../homepage/Homepage";

import WorkoutList from "../workouts/WorkoutCardList";
import ExerciseList from "../exercises/ExerciseCardList";

import LoginForm from "../auth/LoginForm";
import ProfileForm from "../profile/ProfileForm";
import SignupForm from "../auth/SignupForm";
import PrivateRoute from "./PrivateRoute";

/** 
 * File containing all the routes for the application 
 * / : Homepage — just a simple welcome message
 * /exercises : List all exercises
 * /exercises/squat : View details of squat exercise
 * /workouts : display user profile of workouts
 * /workouts/pull_day : View details of pull_day workout
 * /login : Login/signup
 * /signup : Signup form
 * /profile : Edit profile page
 * 
*/

function Routes({login, signup}){
    return (
        <div className="pt-5">
          <Switch>
            <Route exact path="/">
              <Homepage />
            </Route>
  
            <PrivateRoute exact path="/exercises">
              <ExerciseList />
            </PrivateRoute>

            <PrivateRoute exact path="/workouts">
              <WorkoutList />
            </PrivateRoute>
  
            <Route exact path="/login">
              <LoginForm login={login} />
            </Route>
  
            <Route exact path="/signup">
              <SignupForm signup={signup} />
            </Route>
  
            <PrivateRoute path="/profile">
              <ProfileForm />
            </PrivateRoute>
  
            <Redirect to="/" />
          </Switch>
        </div>
    );
}

export default Routes;