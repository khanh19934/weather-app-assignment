# Weather App (NAB Assignment Test)

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Table of content
* [Tech Stack](#tech-stack)
* [Getting Startedt](#getting-started)
* [API Information](#api-information)
* [Deployment](#deployment)
* [Roadmap](#roadmap)


## Getting Started

```
git clone https://github.com/khanh19934/weather-app-assignment.git
cd weather-app-assignment
yarn
yarn start
```

## Tech Stack

#### Application Blueprint
 * Up-to-date [React](https://reactjs.org/) version
 * [Typescript](https://www.typescriptlang.org/) for static type checking
 * [Axios](https://github.com/axios/axios) for handling API call
 * [Ramda](https://ramdajs.com/docs/) for functional programming
 * State management with React Hook.

#### Testing Setup
 * [Jest](https://jestjs.io/) for unit testing application code and providing coverage information
 * [react-testing-library](https://testing-library.com/docs/react-testing-library/intro/) for testing functional component
 
#### API Information
For this project I use the api public from https://openweathermap.org/api.
The API https://www.metaweather.com/api is good too but for some case searching is not have too much data for searching by text or by the coordinate.

For get the data from `openweathermap` we will need and `API_KEY` which I added in `.env`.

The API for get five day weather by location is: 
```
/forecast/daily?lat=${latitude}&lon=${longitude}&appid=${process.env.REACT_APP_OPEN_WEATHER_API}&cnt=7&units=metric
```

And for get five day weather by city name is: 
```
/forecast/daily?q=${cityName}&appid=${process.env.REACT_APP_OPEN_WEATHER_API}&cnt=7&units=metric
```
For get more information about query params of `openweathermap` you can take a look at [here](https://openweathermap.org/forecast16)

#### Deployment

I already setup the CD for deploy app to [Netlify](https://www.netlify.com/).

You can check the live app at Netlify [here](https://fivedayweather.netlify.app/)

For Manual deploy we can follow:

Step 1: Build Project

```
yarn build
```

Step 2: Install Netlify CLI and deploy it.

```
npm install netlify-cli -g
netlify deploy
```

Step 3: Add the information for Netlify. Then go to the Netlify Dashboard for check. 

#### Roadmap

* Add some component to Storybook if application is coming bigger and reusable many time.
* Add Redux to handle State Management. for this app is quite small, so we not need it, but if coming bigger we should do that for easier manage the state of application. 