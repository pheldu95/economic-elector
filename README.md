# Economic Elector

## Description

Every candidate said they would support infrastructure, education, no taxes, and every other nice thing. Economic Elector is an application that allows users to see the actual budget commitments behind these promises. The application has two authorization levels, users and administrators.

Users can see a list of elections and each candidate in those elections. They can also input their ideal budget and compare it to each candidate's proposed budget.

Administators can see, add, edit, and delete elections as well as candidates and their budgets.

## Duration

Two week sprint

## Prerequisites

- Postgres
- Node.js
- npm
- brew

## Instructions

* Create a database named **economic_elector**
* Run the SQL queries found in the databse.sql file
- Create .env file and add the following:
* * SERVER_SESSION_SECRET=y<)~C,689La;Amj\+3~c
* * EMAIL=EconomicElector@gmail.com
* * PASS=economicelector!
* In the project folder on the terminal type in **npm install**
* To spin up the server type in **npm run server**
* Then in a new terminal tab/window type in **npm run client**

This should open up a window in your default browser that displays the application.

## Built With

* HTML
* CSS
* JavaScript
* [PostgreSQL](https://www.postgresql.org/)
* [Express](https://expressjs.com/)
* [React](https://reactjs.org/)
* [Node.js](https://nodejs.org/en/)
* [react-vis](https://uber.github.io/react-vis/)
* [Nodemailer](https://nodemailer.com/about/)
* [Material-UI](https://material-ui.com/)
* [Redux](https://redux.js.org/)
* [Sagas](https://redux-saga.js.org/)

## Known Issues
The add category feature has been implemented on the admin side of the app. The admin can click edit election, and they will see the add category button, as well as buttons for removing categories. Here, they can adda new budget category, and then go and update the candidate's allocation for that category. It will default to $0 for each candidate. The user side is not dynamic yet. It only accounts for the default categories. If the admin deletes a default category, the user side will error out. 

Admin cannot delete an election without first removing the candidates from the election. Once all candidates have been removed, then they can go back to the admin home page and press delete election. 

Nodemailer is working and sending emails when the admin presses the request budget button. But the message in the email may need to be tailored. As of right now the message just says "Hello candidate, please respond with your proposed budget for this election."
## Acknowledgement

Thanks to our Casie Siekman and Dev Java at Prime Digital Academy who equipped and helped us to make this application a reality.
