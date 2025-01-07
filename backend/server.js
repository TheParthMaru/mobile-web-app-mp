const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const app = express();

// Allow all origins for CORS (important for local dev)
app.use(cors());
app.use(express.json());

// Database connection
const db = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "parth@123",
	database: "slpp",
});

db.connect((err) => {
	if (err) throw err;
	console.log("Connected to database");
});

// Registration route
app.post("/api/register", (req, res) => {
	const { full_name, email, password, dob, bioID } = req.body;

	// Check if all fields are provided
	if (!full_name || !email || !password || !dob || !bioID) {
		return res.status(400).json({ error: "All fields are required" });
	}

	// Check if the user already exists
	const checkQuery = "SELECT * FROM petitioners WHERE petitioner_email = ?";
	db.query(checkQuery, [email], (err, result) => {
		if (err) {
			return res.status(500).json({ error: "Database query error" });
		}

		if (result.length > 0) {
			return res.status(400).json({ error: "User already exists" });
		}

		// Insert the new user into the database
		const insertQuery =
			"INSERT INTO petitioners (fullname, petitioner_email, password_hash, dob, bioID) VALUES (?, ?, ?, ?, ?)";
		db.query(
			insertQuery,
			[full_name, email, password, dob, bioID],
			(err, result) => {
				if (err) {
					console.log(err);
					return res.status(500).json({ error: "Error registering user" });
				}

				console.log("User registered:", email);
				res.json({ message: "Registration successful" });
			}
		);
	});
});
// Secret key (for testing)
const JWT_SECRET_KEY = "abajaba";

// Login route
app.post("/api/login", (req, res) => {
	const { email, password } = req.body;

	const query = "SELECT * FROM petitioners WHERE petitioner_email = ?";
	db.query(query, [email], (err, result) => {
		if (err) {
			return res.status(500).json({ error: "Database query error" });
		}

		if (result.length === 0) {
			return res.status(400).json({ error: "User not found" });
		}

		const user = result[0];

		// Compare plain text password
		if (password !== user.password_hash) {
			return res.status(400).json({ error: "Invalid password" });
		}

		// If credentials are valid, generate a JWT token
		const token = jwt.sign(
			{ userId: user.id, email: user.email },
			JWT_SECRET_KEY,
			{ expiresIn: "1h" }
		);

		res.json({
			message: "Login successful",
			token: token,
			fullName: user.fullname,
		});
	});
});

// Start the server
app.listen(5000, () => {
	console.log("Server is running on port 5000");
});
