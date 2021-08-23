# Getting Started with Azure Sample Webapp

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## How-to

- Start the application locally:
  - Run `yarn install && yarn start` in the project root folder

- Configuration:
  - [Global configuration](https://github.com/Cosmo-Tech/azure-sample-webapp/tree/main/src/config)
  - PowerBI Iframes configuration
    - [Scenario view iframe](https://github.com/Cosmo-Tech/azure-sample-webapp/tree/main/src/views/Scenario)
    - [Dashboards view iframes](https://github.com/Cosmo-Tech/azure-sample-webapp/tree/main/src/views/Dashboards)
  - [Scenario Parameters](https://github.com/Cosmo-Tech/azure-sample-webapp/tree/main/src/components/ScenarioParameters)
    - [Input types](https://github.com/Cosmo-Tech/azure-sample-webapp/tree/main/src/components/ScenarioParameters/components)
    - [Upload file](https://github.com/Cosmo-Tech/azure-sample-webapp/tree/main/src/components/ScenarioParameters/components/tabs)
  - [Azure Functions](https://github.com/Cosmo-Tech/azure-sample-webapp/tree/main/api)


## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

### `i18next`
We have defined our own i18next-parser.config.js file.

Once you had launched the command `yarn install`, you'll be able to run the command `i18next` in the project root folder.
This command will :
- look for react-i18next usage within the __src/__ folder
- get all keys defined
- add all keys into translation files (by default __public/locales/en/translation.json__ and __public/locales/fr/translation.json__)
Feel free to add new supported languages or change the parser configuration. ( See [react-i18next](https://github.com/i18next/react-i18next) and [i18next-parser](https://github.com/i18next/i18next-parser) )
