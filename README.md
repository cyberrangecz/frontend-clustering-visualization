# CyberRangeᶜᶻ Platform Trainings Clustering Visualization

The visualization provides three views with distinct processing of collected data - a subset of features that define the
trainee behavior and enable us to explore outliers or trainee strategies during their gameplay.

## Running the demo application

1. Configure and run the [Training service](https://github.com/cyberrangecz/backend-training) and the [User and group service](https://github.com/cyberrangecz/backend-user-and-group) or the whole [deployment](https://github.com/cyberrangecz/devops-helm).
2. Configure the [environment.local.ts](src/environments/environment.local.ts), pointing to the running services.
3. Run `npm install` to install dependencies.
4. Run `npm run start` to start the application.
5. Open the browser at `https://localhost:4200/`. Changes in the code will be automatically reloaded. The app will be using a self-signed certificate, so you will need to accept it in the browser.
