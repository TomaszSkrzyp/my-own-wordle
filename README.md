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

## Installation

### Prerequisites

- Node.js (v16.x or higher)
- PostgreSQL
- Git

### Setup

1. **Clone the repository**:
 ```bash
 git clone https://github.com/TomaszSkrzyp/my-own-wordle.git  
 bcd my-own-wordle
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
   - Create a `.env` file in the root of the `backend` directory with the following content:
   ```bash
    DB_USER='YourDbUser'            # Your PostgreSQL username (e.g., 'postgres')
    DB_HOST='YourDbHost'            # Your PostgreSQL host (e.g., 'localhost')
    DB_NAME='YourDbName'            # The name of your database (e.g., 'wordle_clone')
    DB_PASSWORD='YourDbPassword'    # Your PostgreSQL password
    DB_PORT=5432                    # The port where PostgreSQL is running (default: 5432)
    BACK_PORT=5000                  # The port for your backend server (default: 5000)
    FRONT_PORT=5173                 # The port for your frontend (default: 5173 for Vite)
    NODE_ENV=development            # Set to 'production' for production environments
    SECRET='YourSecretCode'         # Secret key for session encryption (change to something secure)
    # Note: Customize these values based on your own setup and environment.
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
         npm start
    ```
     This will:
     Start the backend server (Express).
     Start the frontend development server (Vite).

## Database Setup

To set up the PostgreSQL database schema required for the application, follow these steps:

1. **Create the database**  
   Open a terminal or PostgreSQL client and run the following command to create the `wordle_clone` database:

   ```bash
   createdb wordle_clone
   ```

   > If `createdb` isn't available, you can also create the database from a PostgreSQL shell with the following SQL command:
   ```bash
   CREATE DATABASE wordle_clone;
   ```

2. **Run the schema.sql file**  
   Navigate to the `backend/db` directory and run the following command to set up the database schema:

   ```bash
   psql -U postgres -d wordle_clone -f backend/db/schema.sql
   ```

   Replace `postgres` with your actual PostgreSQL username if it differs. This will create the necessary tables and structures for the application.

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

    
