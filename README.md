# Wordle Clone

## Description

**Wordle Clone** is a web application built using **Node.js**, **React**, **Express**, and **Vite** that replicates the popular word puzzle game, **Wordle**. The app allows users to play the game with the option to log in, register, or play as a guest. It also includes a **solver** feature, which provides a hint for the best possible guess based on the current state of the game.

### Features:
- **User Authentication**: Users can log in, register, or play as a guest.
- **Game State Persistence**: Users' game progress is saved in a PostgreSQL database.
- **Word Solver**: A built-in word solver that provides hints based on the current guesses.
- **Password Encryption**: User passwords are securely hashed using **Argon2**.
- **Cross-Origin Resource Sharing (CORS)**: Ensures proper communication between frontend and backend.

## Technologies Used:
- **Frontend**: React.js, Vite, CSS
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **Password Hashing**: Argon2
- **API**: RESTful API for communication between frontend and backend
- **Session Management**: Express-session for managing user sessions
- **Security**: Lusca middleware for CSRF protection, XSS protection, and secure HTTP headers
- **Containerization**: Docker for easy setup and deployment

## Installation

### Prerequisites

- Node.js (v16.x or higher)
- PostgreSQL
- Git
- Docker (optional, but recommended)

### **Docker Setup (Recommended)**

1. **Clone the repository**:  
   '''bash
   git clone https://github.com/TomaszSkrzyp/my-own-wordle.git  
   cd my-own-wordle
   '''

2. **Copy the backend environment file**:  
   '''bash
   cp backend/.env.example backend/.env
   '''

3. **Open `.env` in a text editor and fill in your database credentials and secrets**:  
   '''env
   DB_USER=postgres                 # PostgreSQL default user
   DB_HOST=db                      # The name of the database service in docker-compose.yml
   DB_NAME=wordle_clone            # The name of your PostgreSQL database
   POSTGRES_PASSWORD=your_secure_password # Set the same password as in docker-compose or use the default
   DB_PORT=5432                    # PostgreSQL container port
   BACK_PORT=5000                  # Port for backend (Express)
   FRONT_PORT=5173                 # Port for frontend (Vite)
   NODE_ENV=development            # Change to 'production' if deploying
   SECRET=your_app_secret          # Change to a secure session secret
   '''

4. **Start the application with Docker Compose**:  
   '''bash
   docker-compose up --build
   '''

5. **Access the app**:  
   - Frontend: [http://localhost:5173]
   - Backend API: [http://localhost:5000]

6. **Database Setup**
   Since you're using Docker there is no need for any extra DB setup


### Non-Docker Setup

1. **Clone the repository**:
 ```bash
 git clone https://github.com/TomaszSkrzyp/my-own-wordle.git  
 cd my-own-wordle
  ```


2. **Backend Setup**:
   - Navigate to the `backend` folder:
    ```bash
      cd backend
    ```
   - Install the required dependencies:
   ```bash
      npm install
    ```
   - Copy the backend environment file:  
   '''bash
      cp backend/.env.example backend/.env
   '''
    - Open `.env` in a text editor and update it with your database credentials and secrets:
   ```env
      DB_USER=postgres                 # Your PostgreSQL username (e.g., 'postgres')
      DB_HOST=your_db_hostname         # Your PostgreSQL host (usually 'localhost' for local setup)
      DB_NAME=wordle_clone             # The name of your PostgreSQL database
      POSTGRES_PASSWORD=your_secure_password # Your PostgreSQL password
      DB_PORT=5432                    # PostgreSQL default port (usually 5432)
      BACK_PORT=5000                  # Port for backend (Express)
      FRONT_PORT=5173                 # Port for frontend (Vite)
      NODE_ENV=development            # Set to 'production' for production environments
      SECRET=your_app_secret          # Secret key for session encryption
   ```


3. **Frontend Setup**:
   - Navigate to the `frontend` folder:
   ```bash
      cd ../frontend
    ```
   - Install the required dependencies:
    ```bash
      npm install
     ```
4. **Scripts Setup**:
   In the root directory of the project, you should already have a `package.json` file with the following scripts:
   ```json
   "scripts": {
     "start": "concurrently \"npm run server\" \"npm run client\"",
     "client": "npm --prefix frontend run dev", 
     "server": "npm --prefix backend start"
   }
   ``` 
    These scripts will run both the frontend and backend simultaneously when you run:
    ```bash
         npm install
         npm start
    ```
     This will:
     Start the backend server (Express).
     Start the frontend development server (Vite).

## Database Setup (Non-Docker setup)

To set up the PostgreSQL database schema required for the application, follow these steps:

1. **Run the schema.sql file**  
   Navigate to the root directory and run the following command to set up the database schema:

   ```bash
   psql -U postgres -d wordle_clone -f backend/db/schema.sql
   ```
    Replace `postgres` with your actual PostgreSQL username if it differs. This will create the necessary tables and structures for the application.
2. **Populating**
   To enable the app to populate DB propperly you need to copy the contents of `/backend/src/logic/files` to `/backend/files`:
   ```bash
      cp -r backend/src/logic/files/* backend/files/
   ```

## License

This project is licensed under the **MIT License**, allowing for free use, modification, and distribution. See the [LICENSE](LICENSE) file for full details.

---

## Contributing

We welcome contributions to enhance **my-own-wordle**! To contribute, please follow these steps:

1. Fork the repository to your GitHub account.
2. Create a new feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Make your changes (e.g., bug fixes, new features, or documentation improvements).
4. Commit your changes with a descriptive message:
   ```bash
   git commit -m "Add your concise description here"
   ```
5. Push your changes to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```
6. Open a Pull Request on the main repository, detailing your changes and their purpose.

All contributions are appreciated

---

## Contact

For questions, bug reports, or suggestions, please reach out via the **[GitHub Issues](https://github.com/TomaszSkrzyp/my-own-wordle/issues)** page. I'm here to assist and value your feedback!   

    
