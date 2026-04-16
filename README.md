# 🚀 HackMatch: Where Hackers Connect & Build!

Welcome to **HackMatch**! 🌟 This is a platform designed to help developers find their perfect teammates for hackathons, manage projects, and communicate in real-time. Whether you're a frontend wizard or a backend goru, HackMatch brings you together.

---

## 💡 My Learning Journey: The "Security Filter Chain" 🛡️

As a student, the most challenging (and rewarding!) part of this project was setting up **Spring Security**. Initially, I was confused by how requests were being blocked or allowed. But then I discovered the **Security Filter Chain** – and it changed everything!

### What I Learned:
1. **The Guard at the Gate**: Think of the `SecurityFilterChain` as a sequence of security guards. Every request has to pass through them.
2. **Stateless Magic**: Since we use JWT (JSON Web Tokens), we don't need sessions. Setting `.sessionCreationPolicy(SessionCreationPolicy.STATELESS)` was a game-changer!
3. **The Order Matters**: Adding `jwtAuthenticationFilter` *before* `UsernamePasswordAuthenticationFilter` ensures we check for a token before Spring tries to log us in normally.
4. **OAuth2 + JWT**: Combining social login (Google/GitHub) with our own JWT system felt like solving a complex puzzle.

---

## 🛠️ Tech Stack

- **Backend**: Spring Boot 3, Spring Security (JWT & OAuth2), MySQL, Maven.
- **Frontend**: React.js (Vite), Tailwind CSS (for that premium look!), Socket.io for messaging.
- **Database**: JPA / Hibernate.

---

## 🚀 Getting Started

### 1. Prerequisite
- Java 17 or higher installed.
- Node.js & npm installed.
- MySQL Server running.

### 2. How to Initiate a Java Project (The Pro Way)
If you're starting from scratch:
- Go to [start.spring.io](https://start.spring.io/).
- Select **Maven**, **Java**, and **Spring Boot 3.x**.
- Dependencies to add: `Spring Web`, `Spring Data JPA`, `MySQL Driver`, `Spring Security`, `Lombok`.
- Click **Generate** and extract it into your workspace.

---

## 🏃‍♂️ How to Run the Project

### Backend Setup
1. Open terminal in `HackMatch_backend/auth-app-backend/auth-app-backend`.
2. **Environment Variables**: This project uses several environment variables for security. Create a `.env` file in the backend root with the following:
   ```env
   DB_URL=jdbc:mysql://localhost:3306/hackmatch
   DB_USERNAME=root
   DB_PASSWORD=your_password
   JWT_SECRET=your_super_secret_key
   GOOGLE_CLIENT_ID=your_google_id
   GOOGLE_CLIENT_SECRET=your_google_secret
   GITHUB_CLIENT_ID=your_github_id
   GITHUB_CLIENT_SECRET=your_github_secret
   ```
3. Build and Run (using PowerShell to load `.env`):
   ```powershell
   # Load .env variables and run
   Get-Content .env | ForEach-Object { if ($_ -match '^(.*?)=(.*)$') { [System.Environment]::SetEnvironmentVariable($matches[1], $matches[2], "Process") } }; .\mvnw spring-boot:run
   ```


### Frontend Setup
1. Open terminal in `HackMatch_frontend`.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

---

## 📂 Project Structure

- `configurations/SecurityConfig.java`: The brain of our security.
- `security/JwtAuthenticationFilter.java`: Validates tokens on every request.
- `controllers/`: REST Endpoints for Auth, Messages, and Hackathons.
- `HackMatch_frontend/src/context/AuthContext.jsx`: Manages user state across the app.

---

## ✨ Features
- ✅ **Secure Authentication**: JWT-based login + Google/GitHub OAuth2.
- ✅ **Real-time Chat**: Connect with teammates instantly.
- ✅ **Handcrafted UI**: Clean, modern, and responsive.
- ✅ **Project Management**: Organize your hackathon teams effectively.

---

### 📝 Notes for Students
*   If you get a `401 Unauthorized`, check your `Authorization` header. It should be `Bearer <your_token>`.
*   Always keep your `JWT_SECRET` safe! Never push it to GitHub.
*   Spring Security might feel tough at first, but once you understand the **Filter Chain**, you own the security!

---
Made with ❤️ by a curious developer. Happy Hacking! 💻🔥
