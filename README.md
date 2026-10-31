CIS 3339 Homework 1: Student Management System (Vue 3 + Express + MongoDB)

A full-stack app for managing students, courses, and enrollments.

Frontend: Vue 3 (Composition API, <script setup>), Vue Router, Pinia, built with Vite
Backend: Node.js, Express 5, Mongoose
Database: MongoDB Community Edition (local, no credentials)
Required software
Node.js 18 or newer (includes npm)
MongoDB Community Edition running locally on the default port 27017
A modern web browser
Environment variables

The real .env file is committed in the project root and already works with a default local MongoDB:

env
MONGODB_URI=mongodb://127.0.0.1:27017/cis3339_homework1
PORT=3000
Variable Purpose Default if unset
MONGODB_URI Local MongoDB connection string (no credentials) (required)
PORT Port the Express server listens on 3000
Start MongoDB Community Edition locally

Use whichever matches your system, and leave it running:

bash

# macOS (Homebrew)

brew services start mongodb-community

# Windows: MongoDB runs as a service after install; otherwise start it from Services,

# or run: "C:\Program Files\MongoDB\Server\<version>\bin\mongod.exe"

# Linux (systemd)

sudo systemctl start mongod

# Any OS, directly (using an empty folder for data)

mongod --dbpath ./mongo-data

No database setup is needed. The database, collections, and indexes (unique student IDs, unique course IDs, unique student+course enrollments) are created automatically when the server starts, even if the database is empty or does not exist yet. There are no seed, import, or migration commands.

Install, build, and run

From the project root:

bash
npm install # installs root, backend, and frontend dependencies
npm run build # builds the Vue production assets into frontend/dist
npm start # starts Express, which serves the API and the built app

Then open http://localhost:3000 in your browser.

Express serves the built Vue app and falls back to index.html for client-side routes, so refreshing /courses or /enrollments works.

Optional: development mode with hot reload
bash
npm run dev:backend # terminal 1: API on http://localhost:3000
npm run dev:frontend # terminal 2: Vite on http://localhost:5173 (proxies /api to :3000)
Features
Area What you can do
Students Add (name, student ID, phone, ZIP), search by name or ID, view details, delete
Courses Add (course ID, name), list with enrollment counts, delete
Enrollments Pick a student and a course from backend data, enroll, view a course roster, remove an enrollment
Integrity Duplicate students, courses (case-insensitive), and enrollments are rejected; deleting a student or course also deletes its enrollments
Project structure
.env MongoDB + port configuration (committed on purpose)
package.json root scripts: install, build, start
backend/
server.js Express app, error handling, serves frontend/dist
db.js Mongo connection + automatic collection/index creation
models/ Student, Course, Enrollment (Mongoose schemas)
routes/ students.js, courses.js, enrollments.js
frontend/
src/
main.js, App.vue
router/ Vue Router (history mode)
stores/ Pinia stores: students, courses, enrollments, notifications
api/client.js fetch wrapper that turns failures into readable errors
views/ StudentsView, CoursesView, EnrollmentsView, NotFoundView
components/ Forms, tables, search, roster, dialog, toasts, base inputs
assets/styles.css Responsive, accessible styling (light and dark)
REST API

All responses are JSON. Errors look like { "error": "message", "fields": { "zip": "..." } }.

Method & path Description Status codes
GET /api/students?search= List students, optionally filtered 200
POST /api/students Add { name, studentId, phone, zip } 201, 400, 409
DELETE /api/students/:studentId Delete student and their enrollments 200, 404
GET /api/courses List courses with enrollmentCount 200
POST /api/courses Add { courseId, name } 201, 400, 409
DELETE /api/courses/:courseId Delete course and its enrollments 200, 404
GET /api/courses/:courseId/students Course roster 200, 404
POST /api/enrollments Enroll { studentId, courseId } 201, 400, 404, 409
DELETE /api/enrollments/:id Remove one enrollment 200, 404
GET /api/health Database connectivity check 200, 503

If MongoDB is unreachable at startup, the server prints a clear message and exits. If it goes down while running, API calls return 503.

Troubleshooting
"Could not connect to MongoDB": start MongoDB (see above) and check MONGODB_URI in .env.
"Frontend build not found": run npm run build before npm start.
Port already in use: change PORT in .env.
AI tools disclosureS

This project was developed with AI assistance (Claude). All code was tested against a local MongoDB and is understood and explainable by the submitter.
