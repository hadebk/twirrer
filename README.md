# Twirrer | Social Network App

I tried in this project to build an application similar to Twitter but certainly does not have all the features, but it contains the basic features such as (create an account, add a tweet, add a friend, like, comment, etc..).

## Live Demo
[twirrer.netlify.app](https://twirrer.netlify.app/)

## Project Screenshot
![Twirrer screenshot](./home.PNG)
![Twirrer screenshot](./twirrer.PNG)

## Project Features:
- Nice design as Twitter design.
- Fully responsive design (100%).
- Dark/Light theme.
- English/German languages.
- Notifications in app. 

## Technologies used in the project:
### 1- Backend:
    - using 'Firebase cloud function' + 'Express.js' to build an API, to handle all operations with database.
    - using 'Firebase Triggers' to execute some events in app like (fire notification, listen to user avatar changes, etc..).
    - using 'Firebase Authentication' to handel login/signup users.
    - using 'Firebase Firestore&Storage' to store data of the app (NoSQL database).

### 2- Frontend:
    - using 'React.js' to build the frontend of Twirrer.
    - using 'React Hooks' to handle local state & 'React Context api' to handle global state in the app.
    - using 'Axios' to execute all RestFull api requests in the app.
    - implement infinite scroll (pure js) to posts in home page
    - using 'SCSS, CSS Normalize & Css Resets'.
    - using 'BEM' methodology to naming the items in HTML.
