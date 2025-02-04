const express = require('express');
const path = require('path');
// const bodyParser = require('body-parser')
const registrationRoutes = require('./routes/registrationRoutes');

const app = express();

app.use((req, res, next) => {
  console.log(`[${req.method} ${req.originalUrl}`);
  next();   
});

// app.use(bodyParser.json());
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'image')));
app.use('/uploads', express.static('uploads'));

// Register the routes
app.use('/', registrationRoutes);

// Start the server
app.listen(3000, () => {
  console.log(`Server is running on http://localhost:3000`);
});


// To create a User Registration and Login API using Node.js, MySQL, and the MVC (Model-View-Controller) pattern, we will break down the task into different components and implement the required functionality for both sign-up and sign-in processes.

// ### Steps:
// 1. **Set up the project structure**.
// 2. **Install the necessary dependencies**.
// 3. **Create the MySQL database**.
// 4. **Implement Models, Controllers, and Routes**.
// 5. **Implement User Registration (Sign Up)**.
// 6. **Implement User Login (Sign In)**.
// 7. **Handle Authentication using JWT and Bcrypt**.

// Let's go step by step:

// ---

// ### Step 1: Set up the project structure

// Here’s the basic structure for the MVC pattern:

// ```
// project/
// │
// ├── config/
// │   └── db.js             # MySQL configuration
// │
// ├── controllers/
// │   └── userController.js # Handle registration and login logic
// │
// ├── models/
// │   └── userModel.js      # Define User schema
// │
// ├── routes/
// │   └── userRoutes.js     # API routes
// │
// ├── middleware/
// │   └── authMiddleware.js # For verifying JWT tokens
// │
// ├── .env                  # Store sensitive data (e.g. JWT secret)
// ├── package.json
// └── server.js             # Entry point for the server
// ```

// ---

// ### Step 2: Install the necessary dependencies

// First, initialize the project:

// ```bash
// npm init -y
// ```

// Then, install the necessary dependencies:

// ```bash
// npm install express mysql2 bcryptjs jsonwebtoken dotenv
// ```

// ---

// ### Step 3: Create MySQL Database

// Create a MySQL database and a `users` table with necessary fields.

// ```sql
// CREATE DATABASE user_auth;

// USE user_auth;

// CREATE TABLE users (
//     id INT AUTO_INCREMENT PRIMARY KEY,
//     first_name VARCHAR(255),
//     last_name VARCHAR(255),
//     username VARCHAR(255) UNIQUE NOT NULL,
//     email VARCHAR(255) UNIQUE NOT NULL,
//     password VARCHAR(255) NOT NULL,
//     contact_number VARCHAR(255),
//     address TEXT,
//     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
// );
// ```

// ---

// ### Step 4: Implement MySQL connection (`config/db.js`)

// ```javascript
// const mysql = require('mysql2');
// require('dotenv').config();

// const db = mysql.createConnection({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME
// });

// db.connect((err) => {
//     if (err) {
//         console.error('Database connection error:', err);
//         process.exit(1);
//     }
//     console.log('Connected to the MySQL database');
// });

// module.exports = db;
// ```

// ---

// ### Step 5: Implement User Model (`models/userModel.js`)

// ```javascript
// const db = require('../config/db');
// const bcrypt = require('bcryptjs');

// const User = {
//     // Check if the user exists by username or email
//     findUserByEmailOrUsername: (usernameOrEmail, callback) => {
//         const query = `SELECT * FROM users WHERE username = ? OR email = ?`;
//         db.execute(query, [usernameOrEmail, usernameOrEmail], callback);
//     },

//     // Add a new user to the database
//     createUser: (userDetails, callback) => {
//         const { firstName, lastName, username, email, password, contactNumber, address } = userDetails;
//         const query = `INSERT INTO users (first_name, last_name, username, email, password, contact_number, address) 
//                        VALUES (?, ?, ?, ?, ?, ?, ?)`;
//         db.execute(query, [firstName, lastName, username, email, password, contactNumber, address], callback);
//     },

//     // Get user by ID for JWT
//     getUserById: (id, callback) => {
//         const query = `SELECT * FROM users WHERE id = ?`;
//         db.execute(query, [id], callback);
//     }
// };

// module.exports = User;
// ```

// ---

// ### Step 6: Implement User Controller (`controllers/userController.js`)

// ```javascript
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const User = require('../models/userModel');

// // User Registration (Sign Up)
// const registerUser = (req, res) => {
//     const { firstName, lastName, username, email, password, confirmPassword, contactNumber, address } = req.body;

//     if (password !== confirmPassword) {
//         return res.status(400).json({ message: 'Passwords do not match' });
//     }

//     // Check if username or email already exists
//     User.findUserByEmailOrUsername(username, (err, result) => {
//         if (err) return res.status(500).json({ message: 'Database error' });
//         if (result.length > 0) {
//             return res.status(400).json({ message: 'Username or email already exists' });
//         }

//         // Hash the password
//         bcrypt.hash(password, 10, (err, hashedPassword) => {
//             if (err) return res.status(500).json({ message: 'Error hashing password' });

//             const userDetails = { firstName, lastName, username, email, password: hashedPassword, contactNumber, address };
            
//             // Insert the user into the database
//             User.createUser(userDetails, (err, result) => {
//                 if (err) return res.status(500).json({ message: 'Error creating user' });
//                 res.status(201).json({ message: 'User created successfully. Please log in.' });
//             });
//         });
//     });
// };

// // User Login (Sign In)
// const loginUser = (req, res) => {
//     const { usernameOrEmail, password } = req.body;

//     User.findUserByEmailOrUsername(usernameOrEmail, (err, result) => {
//         if (err) return res.status(500).json({ message: 'Database error' });
//         if (result.length === 0) {
//             return res.status(400).json({ message: 'Incorrect username or email' });
//         }

//         const user = result[0];
        
//         // Check if the password matches
//         bcrypt.compare(password, user.password, (err, isMatch) => {
//             if (err) return res.status(500).json({ message: 'Error comparing passwords' });
//             if (!isMatch) {
//                 return res.status(400).json({ message: 'Incorrect password' });
//             }

//             // Create JWT token
//             const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
//             res.status(200).json({ message: 'Login successful', token });
//         });
//     });
// };

// module.exports = { registerUser, loginUser };
// ```

// ---

// ### Step 7: Implement Routes (`routes/userRoutes.js`)

// ```javascript
// const express = require('express');
// const { registerUser, loginUser } = require('../controllers/userController');

// const router = express.Router();

// // Register route
// router.post('/signup', registerUser);

// // Login route
// router.post('/signin', loginUser);

// module.exports = router;
// ```

// ---

// ### Step 8: Authentication Middleware (`middleware/authMiddleware.js`)

// ```javascript
// const jwt = require('jsonwebtoken');

// const authMiddleware = (req, res, next) => {
//     const token = req.header('Authorization')?.replace('Bearer ', '');
//     if (!token) {
//         return res.status(403).json({ message: 'Access denied. No token provided.' });
//     }

//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         req.user = decoded;
//         next();
//     } catch (err) {
//         res.status(400).json({ message: 'Invalid token.' });
//     }
// };

// module.exports = authMiddleware;
// ```

// ---

// ### Step 9: Server Entry Point (`server.js`)

// ```javascript
// const express = require('express');
// const dotenv = require('dotenv');
// const bodyParser = require('body-parser');
// const userRoutes = require('./routes/userRoutes');

// dotenv.config();

// const app = express();
// app.use(bodyParser.json());

// app.use('/api/users', userRoutes);

// app.listen(process.env.PORT || 3000, () => {
//     console.log(`Server running on port ${process.env.PORT || 3000}`);
// });
// ```

// ---

// ### Step 10: Configure `.env` file

// Create a `.env` file to store sensitive information like the MySQL database and JWT secret.

// ```
// DB_HOST=localhost
// DB_USER=root
// DB_PASSWORD=yourpassword
// DB_NAME=user_auth
// JWT_SECRET=your-jwt-secret
// ```

// ---

// ### Conclusion

// You now have a fully functional User Registration and Login API with JWT authentication, password hashing, and the MVC structure. The user can register, log in, and receive a JWT token on successful login. This token can be used for subsequent authenticated requests.

// Let me know if you need further assistance with this setup!