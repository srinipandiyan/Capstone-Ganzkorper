-- Top-down data schema. User > workouts > exercises > histories

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR,
  password VARCHAR
);

CREATE TABLE workouts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER,
  workout_name VARCHAR,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE exercises (
  id SERIAL PRIMARY KEY,
  workout_id INTEGER,
  name VARCHAR,
  type VARCHAR,
  muscle VARCHAR,
  equipment VARCHAR,
  difficulty VARCHAR,
  instructions VARCHAR,
  FOREIGN KEY (workout_id) REFERENCES workouts(id)
);

CREATE TABLE histories (
  id SERIAL PRIMARY KEY,
  exercise_id INTEGER,
  weight_used INTEGER,
  num_sets INTEGER,
  num_reps INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (exercise_id) REFERENCES exercises(id)
);