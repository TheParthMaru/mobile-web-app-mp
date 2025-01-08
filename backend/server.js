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
		console.log("Current User: ", user);
		console.log("Current user email: ", user.petitioner_email);

		// Compare plain text password
		if (password !== user.password_hash) {
			return res.status(400).json({ error: "Invalid password" });
		}

		// If credentials are valid, generate a JWT token
		const token = jwt.sign(
			{ userId: user.id, email: user.petitioner_email },
			JWT_SECRET_KEY,
			{ expiresIn: "1h" }
		);

		res.json({
			message: "Login successfull",
			token: token,
			fullName: user.fullname,
			email: user.petitioner_email,
			password: user.password_hash,
		});
	});
});

/**
 * Petitions flow
 */

// Create a new petition
app.post("/api/petitions", (req, res) => {
	const { petitioner_email, title, content } = req.body;

	if (!petitioner_email || !title || !content) {
		return res.status(400).json({ error: "All fields are required" });
	}

	const query =
		"INSERT INTO petitions (petitioner_email, title, content) VALUES (?, ?, ?)";
	db.query(query, [petitioner_email, title, content], (err, result) => {
		if (err) {
			console.error(err);
			return res
				.status(500)
				.json({ error: "Database error while creating petition" });
		}
		res.json({
			message: "Petition created successfully",
			petitionId: result.insertId,
		});
	});
});

// Read all petitions for a specific user
app.get("/api/petitions", (req, res) => {
	const { email } = req.query;

	if (!email) {
		return res.status(400).json({ error: "Email is required" });
	}

	const query = "SELECT * FROM petitions WHERE petitioner_email = ?";
	db.query(query, [email], (err, results) => {
		if (err) {
			console.error(err);
			return res
				.status(500)
				.json({ error: "Database error while fetching petitions" });
		}
		res.json(results);
	});
});

// Update a petition
app.put("/api/petitions/:id", (req, res) => {
	const { id } = req.params;
	const { title, content, status, response } = req.body;

	const query =
		"UPDATE petitions SET title = ?, content = ?, status = ?, response = ? WHERE petition_id = ?";
	db.query(query, [title, content, status, response, id], (err, result) => {
		if (err) {
			console.error(err);
			return res
				.status(500)
				.json({ error: "Database error while updating petition" });
		}

		if (result.affectedRows === 0) {
			return res.status(404).json({ error: "Petition not found" });
		}

		res.json({ message: "Petition updated successfully" });
	});
});

// Delete a petition
app.delete("/api/petitions/:id", (req, res) => {
	const { id } = req.params;

	const query = "DELETE FROM petitions WHERE petition_id = ?";
	db.query(query, [id], (err, result) => {
		if (err) {
			console.error(err);
			return res
				.status(500)
				.json({ error: "Database error while deleting petition" });
		}

		if (result.affectedRows === 0) {
			return res.status(404).json({ error: "Petition not found" });
		}

		res.json({ message: "Petition deleted successfully" });
	});
});

// Read all petitions with petitioner details
app.get("/api/allPetitions", (req, res) => {
	const query = `
    SELECT 
      p.petition_id, 
      p.title, 
      p.content, 
      p.status, 
      p.response, 
      p.signature_count, 
      pt.fullname AS petitioner_name
    FROM 
      petitions p
    JOIN 
      petitioners pt 
    ON 
      p.petitioner_email = pt.petitioner_email
  `;

	db.query(query, (err, results) => {
		if (err) {
			console.error(err);
			return res
				.status(500)
				.json({ error: "Database error while fetching petitions" });
		}
		res.json({ petitions: results });
	});
});

// Update petition status
app.put("/api/petitions/:id/status", (req, res) => {
	const { id } = req.params;
	const { status } = req.body;

	if (!status) {
		return res.status(400).json({ error: "Status is required" });
	}

	const query = "UPDATE petitions SET status = ? WHERE petition_id = ?";
	db.query(query, [status, id], (err, result) => {
		if (err) {
			console.error(err);
			return res
				.status(500)
				.json({ error: "Database error while updating status" });
		}

		if (result.affectedRows === 0) {
			return res.status(404).json({ error: "Petition not found" });
		}

		res.json({ message: "Status updated successfully" });
	});
});

// Save feedback for a petition
app.put("/api/petitions/:id/feedback", (req, res) => {
	const { id } = req.params;
	const { feedback } = req.body;

	if (!feedback) {
		return res.status(400).json({ error: "Feedback is required" });
	}

	const query = "UPDATE petitions SET response = ? WHERE petition_id = ?";
	db.query(query, [feedback, id], (err, result) => {
		if (err) {
			console.error(err);
			return res
				.status(500)
				.json({ error: "Database error while saving feedback" });
		}

		if (result.affectedRows === 0) {
			return res.status(404).json({ error: "Petition not found" });
		}

		res.json({ message: "Feedback saved successfully" });
	});
});

// Start the server
app.listen(5000, () => {
	console.log("Server is running on port 5000");
});
