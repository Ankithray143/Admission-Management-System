# College Admission Management System

A web application for managing student admissions, built with Spring Boot (Java), PostgreSQL, and a Bootstrap-based frontend.

---

## Features
- Student registration and application form (multi-step)
- Document upload (photo, certificates)
- Application tracking and details view
- Admin management via REST API

## Tech Stack
- **Backend:** Java 17+, Spring Boot, PostgreSQL, Maven
- **Frontend:** HTML, CSS, Bootstrap, JavaScript (optionally React)

---

## Getting Started

### Backend Setup

1. **Install Java, Maven, PostgreSQL**
   - [Java Download](https://adoptopenjdk.net/)
   - [Maven Download & Install Guide](https://maven.apache.org/install.html)
   - [PostgreSQL Download](https://www.postgresql.org/download/)

2. **Create Database:**
   ```sql
   CREATE DATABASE college_admission;
   CREATE USER postgres WITH ENCRYPTED PASSWORD 'postgres';
   GRANT ALL PRIVILEGES ON DATABASE college_admission TO postgres;
   ```
   *(Adjust username/password if you use something different; update `application.properties` accordingly.)*

3. **Configure `application.properties` if needed**
   - File: `backend/src/main/resources/application.properties`
   - Example:
     ```
     spring.datasource.url=jdbc:postgresql://localhost:5432/college_admission
     spring.datasource.username=postgres
     spring.datasource.password=postgres
     ```

4. **Build and Run:**
   - Open a terminal and run:
     ```bash
     cd backend
     mvn clean install
     mvn spring-boot:run
     ```
   - If you see `'mvn' is not recognized`, you need to [install Maven](https://maven.apache.org/install.html) and add it to your system PATH.

---

### Frontend Setup

- **Static HTML:**
  - Open `index.html` or `admission.html` in your browser.
  - No build step is required for the static HTML/JS frontend.

- **React (optional):**
  - The project includes a `package.json` and `App.js`, but does **not** have a `start` script or a full React setup.
  - If you want to use React, you must scaffold a React app (e.g., with `npx create-react-app .`), move your code into the `src` folder, and add a `start` script to `package.json`.
  - For now, use the static HTML files for the frontend.

---

## API Endpoints

- `POST /api/students` — Create application
- `POST /api/students/{id}/photo` — Upload photo
- `GET /api/students/search?query=...` — Search
- `GET /api/students/{id}` — Get details
- `DELETE /api/students/{id}` — Delete

---

## Troubleshooting

### `'mvn' is not recognized as the name of a cmdlet...`
- **Solution:** Install Maven and add it to your system PATH. [Maven Install Guide](https://maven.apache.org/install.html)

### `npm start` error: Missing script: "start"
- The project does **not** include a React app with a `start` script. Use the static HTML files (`index.html`, `admission.html`) for the frontend.
- If you want a React frontend, scaffold a new React app and migrate your code.

---

## License

For educational use. 
