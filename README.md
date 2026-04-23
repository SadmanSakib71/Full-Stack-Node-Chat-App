# Full-Stack Node Chat App

A real-time chat application built with Node.js, Express, MongoDB (Mongoose), EJS, and Socket.IO.

## Features

- User registration and login with JWT-based authentication
- Role-based access control (`admin` and `user`)
- Signed cookie-based session token handling
- Admin user management (list, add, remove users)
- Conversation management (create, list, delete)
- Real-time messaging with Socket.IO events
- Image upload support for avatars and message attachments

## Tech Stack

- Node.js
- Express
- MongoDB + Mongoose
- EJS templating
- Socket.IO
- JWT (`jsonwebtoken`)
- Multer (file uploads)
- Express Validator
- bcrypt (password hashing)

## Project Structure

- `app.js` - Application entry point, middleware setup, DB connection, Socket.IO server
- `controller/` - Route controller logic
- `router/` - Express route modules
- `models/` - Mongoose models (`people`, `Conversation`, `Message`)
- `middleWares/` - Auth, validation, upload, and error middleware
- `utilities/` - Helpers for upload handling and sanitization
- `views/` - EJS templates
- `public/` - Static assets and uploaded files

## Prerequisites

- Node.js (LTS recommended)
- npm
- MongoDB instance (local or cloud)

## Installation

1. Clone the repository:

```bash
git clone <your-repository-url>
cd Full-Stack-Node-Chat-App
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the project root and add required variables (see below).

4. Start the app in development mode:

```bash
npm start
```

The server runs on `http://localhost:3000` by default unless `PORT` is set.

## Environment Variables

Create a `.env` file in the root with:

```env
PORT=3000
NODE_ENV=development
MongoDb_Connection=mongodb://localhost:27017/chat_app

COOKIE_SECRET=your_cookie_secret
COOKIE_NAME=your_cookie_name

JWT_SECRET=your_jwt_secret
JWT_secret=your_jwt_secret
JWT_EXPIRY=86400000
```

Notes:

- `JWT_EXPIRY` is used for both token expiration and cookie max age in current code.
- The current code references both `JWT_SECRET` and `JWT_secret` in different files, so keep both set to the same value to avoid auth issues.

## Available Scripts

- `npm start` - Run app with `NODE_ENV=development` using nodemon
- `npm run production` - Run app with `NODE_ENV=production` using nodemon

## Main Routes

### Auth Routes

- `GET /` - Login page
- `POST /` - Process login
- `DELETE /` - Logout
- `GET /register` - Registration page
- `POST /register` - Register a new user

### User Routes (Admin Protected)

- `GET /users` - Users page
- `POST /users` - Add user
- `DELETE /users/:id` - Remove user

### Inbox/Chat Routes (Authenticated)

- `GET /inbox` - Inbox page
- `POST /inbox/search` - Search users for new conversation
- `POST /inbox/conversation` - Create conversation
- `GET /inbox/messages/:conversation_id` - Get conversation messages
- `POST /inbox/message` - Send text/image message
- `DELETE /inbox/:conversationId` - Delete conversation and messages

## Real-Time Events (Socket.IO)

- `new_conversation` - Emitted when a conversation is created
- `new_message` - Emitted when a new message is sent

Clients join a room using the authenticated `userId` passed during socket handshake.

## File Upload Limits

- Avatar upload:
  - Formats: `jpg`, `jpeg`, `png`
  - Max size: `1MB`
- Message attachments:
  - Formats: `jpg`, `jpeg`, `png`
  - Max size per file: `1MB`
  - Max files: `2`

## License

ISC
