import React, { useState } from "react";

function RegistrationForm() {
	const [formData, setFormData] = useState({
		email: "",
		fullName: "",
		dob: "",
		password: "",
		bioID: "",
	});

	const [errorMessage, setErrorMessage] = useState("");
	const [successMessage, setSuccessMessage] = useState("");

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prevData) => ({
			...prevData,
			[name]: value,
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setErrorMessage(""); // Clear any previous error messages
		setSuccessMessage(""); // Clear any previous success messages

		try {
			const response = await fetch("http://localhost:5000/api/register", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					email: formData.email,
					full_name: formData.fullName,
					dob: formData.dob,
					password: formData.password,
					bioID: formData.bioID,
				}),
			});

			if (!response.ok) {
				const data = await response.json();
				throw new Error(data.error || "Registration failed");
			}

			const data = await response.json();
			setSuccessMessage(data.message || `Registration successful!`);
		} catch (error) {
			setErrorMessage(error.message);
		}
	};

	return (
		<div className="flex justify-center items-center min-h-screen bg-gray-100">
			<div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8">
				<h1 className="text-2xl font-bold mb-6 text-gray-700 text-center">
					Register
				</h1>
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
							value={formData.email}
							onChange={handleChange}
							required
							className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
						/>
					</div>
					<div>
						<label
							htmlFor="fullName"
							className="block text-sm font-medium text-gray-600"
						>
							Full Name
						</label>
						<input
							type="text"
							name="fullName"
							placeholder="Full Name"
							value={formData.fullName}
							onChange={handleChange}
							required
							className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
						/>
					</div>
					<div>
						<label
							htmlFor="dob"
							className="block text-sm font-medium text-gray-600"
						>
							Date of Birth
						</label>
						<input
							type="date"
							name="dob"
							placeholder="Date of Birth"
							value={formData.dob}
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
							value={formData.password}
							onChange={handleChange}
							required
							className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
						/>
					</div>
					<div>
						<label
							htmlFor="bioID"
							className="block text-sm font-medium text-gray-600"
						>
							Biometric ID
						</label>
						<input
							type="text"
							name="bioID"
							placeholder="Biometric ID"
							value={formData.bioID}
							onChange={handleChange}
							required
							className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
						/>
					</div>
					<button
						type="submit"
						className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
					>
						Register
					</button>
				</form>

				{/* Display success or error messages */}
				{successMessage && (
					<p className="mt-4 text-center text-green-600 font-medium">
						{successMessage}
					</p>
				)}
				{errorMessage && (
					<p className="mt-4 text-center text-red-600 font-medium">
						{errorMessage}
					</p>
				)}
			</div>
		</div>
	);
}

export default RegistrationForm;
