import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function LoginForm() {
	const [credentials, setCredentials] = useState({ email: "", password: "" });
	const [errorMessage, setErrorMessage] = useState("");
	const navigate = useNavigate();

	// Admin credentials
	const adminEmail = "admin@petition.parliament.sr";
	const adminPassword = "2025%shangrila";

	const handleChange = (e) => {
		const { name, value } = e.target;
		setCredentials((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		// Check if credentials match admin
		if (
			credentials.email === adminEmail &&
			credentials.password === adminPassword
		) {
			// Save admin details in localStorage
			localStorage.setItem("email", adminEmail);
			localStorage.setItem("fullName", "Admin");
			localStorage.setItem("authToken", "adminToken");

			// Navigate to Admin Dashboard
			navigate("/adminDashboard");
			return;
		}

		// If not admin, proceed with the API call for user authentication
		try {
			const response = await fetch("http://localhost:5000/api/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(credentials),
			});

			if (!response.ok) {
				const errorData = await response.json();
				setErrorMessage(errorData.error || "Login failed");
			} else {
				const data = await response.json();

				// Store user details in localStorage
				localStorage.setItem("authToken", data.token);
				localStorage.setItem("email", data.email);
				localStorage.setItem("fullName", data.fullName);

				// Navigate to User Dashboard
				navigate("/dashboard");
			}
		} catch (error) {
			console.error("Error during login:", error);
			setErrorMessage("Error during login, please try again.");
		}
	};

	return (
		<div>
			<h2>Login</h2>
			<form onSubmit={handleSubmit}>
				<input
					type="text"
					name="email"
					placeholder="Email"
					value={credentials.email}
					onChange={handleChange}
					required
				/>
				<input
					type="password"
					name="password"
					placeholder="Password"
					value={credentials.password}
					onChange={handleChange}
					required
				/>
				<button type="submit">Login</button>
			</form>

			{errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
		</div>
	);
}

export default LoginForm;
