# Mock Interview Platform Backend

Node.js + Express + MongoDB (Mongoose) backend for Mock Interview Platform.

## .env
Create a `.env` in `backend/`:

```
PORT=5000
FRONTEND_URL=http://localhost:3000
MONGODB_URI=mongodb+srv://muthumanikandan11mk:<db_password>@mycluster.1gybapu.mongodb.net/?retryWrites=true&w=majority&appName=MyCluster/mock_interview
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
BCRYPT_SALT_ROUNDS=10
```

Do not commit secrets. Replace `<db_password>`.

## Install & Run
```
cd backend
npm install
npm run dev
```

## Endpoints
- Auth
  - POST `/auth/register` { name, email, password, role }
  - POST `/auth/login` { email, password }
- Courses (admin)
  - POST `/courses`
  - GET `/courses`
  - GET `/courses/:id`
  - PUT `/courses/:id`
  - DELETE `/courses/:id`
- Tests (student)
  - GET `/questions/:courseId/:difficulty`
  - POST `/submit/mcq`
  - POST `/submit/text`
  - POST `/submit/voice` (multipart: audio)
  - POST `/submit/video` (multipart: video)
  - GET `/results/:userId`
  - GET `/next-difficulty/:userId`

Responses are `{ success, message, data }`.

## Frontend Integration
- Set `REACT_APP_API_URL` or equivalent to `http://localhost:5000`.
- CORS allows `FRONTEND_URL` from `.env`.

## Notes
- Voice/Video use stubs in `src/utils/speechStub.js` and `src/utils/videoStub.js`.
- Multer stores uploads in `src/uploads`, removed after processing.
- Difficulty thresholds: <0.4 easy, 0.4–0.7 medium, ≥0.7 hard.

## Existing `server` folder
- A new `backend` folder replaces it. Backup old `server` to `server_backup` if needed and update frontend base URL to point to this backend.
