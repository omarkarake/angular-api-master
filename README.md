# Angular API Master

hosted version link: https://angular-api-master-ten.vercel.app/

## Project Description

Angular API Master is an Angular application designed to demonstrate proficiency in working with APIs. The project includes features such as data fetching, error handling, authentication, optimization, and environment configuration. The application interacts with the JSONPlaceholder API to perform CRUD operations on posts and comments.

## Setup and Run Instructions

### Prerequisites

- Node.js (>= 14.x)
- Angular CLI (>= 12.x)

### Installation

1. Clone the repository:

   git clone https://github.com/omarkarake/angular-api-master
   cd angular-api-master

2. Install dependencies
   npm install

## Running the Application

1. Start the development server:
   npm run start

2. Open your browser and navigate to http://localhost:4200.

## Building the Application

Build for production:

    npm run build

The build artifacts will be stored in the dist/ directory.

## Running Tests
1. Run unit tests:
    npm run test

2. Run unit tests in watch mode:
    npm run test:watch

3. Run tests with coverage:
    npm run test:coverage

## Available npm Scripts and Their Purposes
npm start: Starts the development server.
npm run build: Builds the application for production.
npm run watch: Builds the application in watch mode for development.
npm test: Runs unit tests using Jest.
npm run test:watch: Runs unit tests in watch mode.
npm run test:coverage: Runs unit tests and generates a coverage report.

## Project Structure and Key Features
# Project Structure

angular-api-master/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── post-list/
│   │   │   ├── post-detail/
│   │   │   ├── post-create/
│   │   │   └── post-edit/
│   │   ├── services/
│   │   │   ├── api-client.service.ts
│   │   │   ├── error-handler.service.ts
│   │   │   └── auth-interceptor.service.ts
│   │   ├── models/
│   │   │   ├── post.model.ts
│   │   │   └── comment.model.ts
│   │   ├── environments/
│   │   │   ├── environment.ts
│   │   │   ├── environment.prod.ts
│   │   │   └── environment.staging.ts
│   │   ├── app.module.ts
│   │   └── app-routing.module.ts
│   ├── assets/
│   ├── styles.css
│   ├── index.html
│   └── main.ts
├── [angular.json]
├── [package.json]
└── [README.md]

## Key Features
1. API Client Service:

- Methods to interact with the JSONPlaceholder API for GET, POST, PUT, and DELETE operations.
- Proper error handling and return of Observables.
- Retry logic for failed requests.

2. Components:

- PostListComponent: Lists all posts with pagination.
- PostDetailComponent: Displays a single post and its comments.
- PostCreateComponent: Allows creating a new post.
- PostEditComponent: Allows editing an existing post.

3. Error Handling:

- ErrorHandlerService: Displays user-friendly error messages for network issues and API errors.

4. HTTP Interceptor:

- Adds a mock authentication token to all outgoing requests.
- Logs all HTTP requests and responses.

5. Pagination:

- Uses query parameters to request paginated data from the API.
- Includes a reusable pagination component.

6. Caching:

- Caches GET requests for a specified duration.
- Includes a method to clear the cache.

7. Environment Configuration:

- Separate configurations for development, staging, and production environments.
- Environment-specific API URLs.
- Build configurations for each environment using Angular CLI.

# Test the Application with Different Environments
Run the application in different environments to ensure that it uses the correct API URLs:

- Development: ng serve --configuration=development

- Staging: ng serve --configuration=staging

- Production: ng serve --configuration=production

8. Lazy Loading:

- Implements lazy loading for the post detail module.

9. Unit Tests:

- Comprehensive unit tests for the API client service and components using Jest.
License
- This project is licensed under the MIT License.
