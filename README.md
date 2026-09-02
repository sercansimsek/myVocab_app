# myVocab

myVocab is a full-stack vocabulary practice application for learning English words with Turkish and Slovak translations. The project is being built as a practical way to learn backend development, relational databases, and secure authentication.

## Planned Features

- User registration, login, logout, and protected routes
- A private vocabulary collection for each user
- Create, view, search, edit, and delete words
- English-to-Turkish and English-to-Slovak practice modes
- Randomized practice sessions and score summaries
- Responsive loading, empty, validation, and error states

## Tech Stack

### Frontend

- React
- TypeScript
- React Router
- Axios
- Tailwind CSS

### Backend

- Node.js
- Express
- TypeScript
- Zod

### Database and Authentication

- PostgreSQL
- Prisma ORM
- bcrypt password hashing
- JWT access tokens and refresh sessions

## Project Structure

```text
myVocab/
├── client/       # React frontend
├── server/       # Express API
├── .gitignore
└── README.md
```

## Current Status

The project is in its initial setup phase.

## Development Roadmap

1. Set up the React client and Express server
2. Configure PostgreSQL and Prisma
3. Implement registration and login
4. Build user-specific vocabulary CRUD operations
5. Add vocabulary practice sessions
6. Test, polish, and deploy the application

## Local Development

Setup and run instructions will be added as the client and server are implemented.

## Learning Goals

- Design a relational PostgreSQL database
- Use Prisma migrations and database queries
- Implement authentication and authorization securely
- Design and consume a REST API
- Validate user input and handle errors consistently
- Test and deploy a complete full-stack application
