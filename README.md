# Ganzkörper

Capstone Two is a fitness tracking web application built with React for the frontend and Node.js for the backend. The app aims to provide users with an easy-to-use interface to track and monitor their workout progression, all in one convenient web space. Powered by the wger API, users will have access to a comprehensive database of exercises.

## Features

- **User-Friendly Interface**: The app prioritizes frontend user experience with an intuitive and easy-to-update UI.
- **Workout Tracking**: Users can easily track and monitor their workout progression through the app.
- **Exercise Database**: Access a vast database of exercises, allowing users to explore and incorporate new exercises into their routine.
- **Data-Driven Health**: The app empowers users, regardless of age or background, with data-driven insights to support their health and self-improvement goals.

## Technical Details

- **Frontend**: Developed using React.js and Bootstrap, providing a responsive user interface.
- **Backend**: Node.js serves as the backend, handling data processing and API requests.
- **Database**: PostgreSQL is used for data storage.
- **Security**: User passwords are hashed before storage in the database to ensure sensitive data protection.
- **API Integration**: The app leverages the [Ninja Exercise API](https://api-ninjas.com/api/exercises) for exercise data, with regular testing to address any API-related issues.

## Routes

- **Homepage (/)**: Displays a simple welcome message.
- **Exercises (/exercises)**: Lists all available exercises.
- **Exercise Details (/exercises/:exercise)**: Displays details of a specific exercise, such as squat, pull-up, etc.
- **Workouts (/workouts)**: Displays user dashboard of workouts, allowing users to view and manage their workout data.
- **Login (/login)**: Provides login/signup functionality.
- **Signup (/signup)**: Offers a signup form for new users to create an account.
- **Profile (/profile)**: Allows users to edit their profile information.

## Functionality

- **Dashboard**: Upon logging in, users are directed to their dashboard, where they can view exercise data from previous visits and add new workouts.
- **Workout Tracking**: Users can track exercises within a workout to monitor progression over time.
- **Exercise Search**: Users can search and learn about different exercises available through the API.
- **Stretch Goals**: Plans include implementing a buttonless exercise component for dynamic updating of exercise history data using onClick or similar event handlers.

## Technologies Used

- Axios
- Express.js
- Node.js
- React.js
- PostgreSQL

This project aims to provide users with a comprehensive fitness tracking solution, combining user-friendly design with powerful functionality to support users in achieving their health and fitness goals.