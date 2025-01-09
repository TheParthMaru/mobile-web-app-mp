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
		<div className="flex justify-center items-center bg-gray-100">
			<div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8">
				<h2 className="text-2xl font-bold mb-6 text-gray-700 text-center">
					Login
				</h2>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label
							htmlFor="email"
							className="block text-sm font-medium text-gray-600"
						>
							Email
						</label>
						<input
							type="text"
							name="email"
							placeholder="Email"
							value={credentials.email}
							onChange={handleChange}
							required
							className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
						/>
					</div>
					<div>
						<label
							htmlFor="password"
							className="block text-sm font-medium text-gray-600"
						>
							Password
						</label>
						<input
							type="password"
							name="password"
							placeholder="Password"
							value={credentials.password}
							onChange={handleChange}
							required
							className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
						/>
					</div>
					<button
						type="submit"
						className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
					>
						Login
					</button>
				</form>

				{/* Display error message */}
				{errorMessage && (
					<p className="mt-4 text-center text-red-600 font-medium">
						{errorMessage}
					</p>
				)}
			</div>
		</div>
	);
}

export default LoginForm;
