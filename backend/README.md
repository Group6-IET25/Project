# Accisense Backend

This is the backend server for the Accisense application. It is built with Node.js and connects to a MongoDB database. Follow the steps below to run the server locally.

### 1. Install Dependencies

```bash
npm install
```

### 2. Create a `.env` File

In the backend directory of the project, create a `.env` file and add the following environment variables:

```
PORT=
JWT_SECRET=
MONGODB_URI=
FRONTEND_URL=
MODEL_URL=
```

### 3. Start the Server

To run the server, use one of the following commands:

```bash
npm run server
```

or

```bash
nodemon server.js
```

This will start the backend server on the port defined in your `.env` file.

---

## Additional Notes

- Ensure MongoDB is accessible at the provided `MONGODB_URI`.
- The frontend should be running at the URL specified in `FRONTEND_URL` or `http://localhost:5173`.
- The model server (i.e. machine learning model) should be accessible at the `MODEL_URL`.
- Make sure to add your backend’s IP and port to the allowed CORS origins on the model server.

---
