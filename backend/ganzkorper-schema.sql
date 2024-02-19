-- Top-down data schema. User > workouts > exercises > histories

CREATE TABLE users (
  username VARCHAR PRIMARY KEY,
  password VARCHAR
);

CREATE TABLE workouts (
  id VARCHAR PRIMARY KEY, --uuid generate v4
  user_ref VARCHAR,
  workout_name VARCHAR,
  exercises VARCHAR[],
  FOREIGN KEY (user_ref) REFERENCES users(username)
);

CREATE TABLE exercises (
  id VARCHAR PRIMARY KEY, --uuid generate v4
  name VARCHAR,
  type VARCHAR,
  muscle VARCHAR,
  equipment VARCHAR,
  difficulty VARCHAR,
  instructions VARCHAR
);

CREATE TABLE histories (
  id VARCHAR PRIMARY KEY, --uuid generate v4
  user_ref VARCHAR,
  exercise_id VARCHAR,
  weight_used INTEGER,
  num_sets INTEGER,
  num_reps INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_ref) REFERENCES users(username)
);