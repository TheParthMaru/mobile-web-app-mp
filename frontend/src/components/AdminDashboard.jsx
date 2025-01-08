import React, { useState, useEffect } from "react";

function AdminDashboard() {
	const [petitions, setPetitions] = useState([]);
	const [responseText, setResponse] = useState(""); // Renamed to responseText to avoid conflict
	const [selectedPetition, setSelectedPetition] = useState(null); // For reading a petition

	// Fetch petitions data from the backend
	useEffect(() => {
		const fetchPetitions = async () => {
			try {
				const response = await fetch("http://localhost:5000/api/allPetitions");
				if (!response.ok) {
					throw new Error(`Error: ${response.statusText}`);
				}
				const data = await response.json();
				setPetitions(data.petitions || []);
			} catch (error) {
				console.error("Error fetching petitions:", error);
			}
		};

		fetchPetitions();
	}, []);

	// Handle feedback submission
	const handleSubmitFeedback = async (petitionId) => {
		try {
			const response = await fetch(
				`http://localhost:5000/api/petitions/${petitionId}/feedback`,
				{
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ feedback: responseText }), // Using responseText here
				}
			);

			if (!response.ok) {
				throw new Error("Error saving feedback");
			}

			alert("Feedback submitted successfully!");
			setResponse(""); // Clear the feedback text area

			// Update the petition's response in the state
			setPetitions((prevPetitions) =>
				prevPetitions.map((petition) =>
					petition.petition_id === petitionId
						? { ...petition, response: responseText } // Update with the feedback value
						: petition
				)
			);
		} catch (error) {
			console.error("Error saving feedback:", error);
		}
	};

	// Logout function to clear local storage
	const handleLogout = () => {
		localStorage.removeItem("email");
		localStorage.removeItem("fullName");
		alert("You have logged out successfully.");
		// Optionally, you can redirect the user to the login page or home page
		window.location.href = "/"; // Redirect to the login page
	};

	return (
		<div className="admin-dashboard">
			<h1>Petitions Committee Dashboard</h1>

			{/* Logout Button */}
			<button onClick={handleLogout}>Logout</button>

			{/* Petitions List */}
			<div className="petitions-list">
				<h2>Petitions List</h2>
				{petitions.length === 0 ? (
					<p>No petitions available.</p>
				) : (
					<table border={1}>
						<thead>
							<tr>
								<th>Title</th>
								<th>User Name</th>
								<th>Status</th>
								<th>Signatures</th>
								<th>Response</th>
								<th>Action</th>
							</tr>
						</thead>
						<tbody>
							{petitions.map((petition) => (
								<tr key={petition.petition_id}>
									<td>{petition.title}</td>
									<td>{petition.petitioner_name}</td>
									<td>{petition.status}</td>
									<td>{petition.signatures}</td>
									<td>{petition.response || "No response provided"}</td>
									<td>
										<button onClick={() => setSelectedPetition(petition)}>
											Read Petition
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				)}
			</div>

			{/* Selected Petition Details */}
			{selectedPetition && (
				<div className="petition-details">
					<h3>Petition Details</h3>
					<p>
						<strong>Title:</strong> {selectedPetition.title}
					</p>
					<p>
						<strong>Content:</strong> {selectedPetition.content}
					</p>
					<p>
						<strong>User Name:</strong> {selectedPetition.petitioner_name}
					</p>
					<textarea
						value={responseText} // Changed to responseText
						onChange={(e) => setResponse(e.target.value)}
						placeholder="Write feedback"
					/>
					<button
						onClick={() => handleSubmitFeedback(selectedPetition.petition_id)}
					>
						Submit Feedback
					</button>
					<button onClick={() => setSelectedPetition(null)}>Close</button>
				</div>
			)}
		</div>
	);
}

export default AdminDashboard;
