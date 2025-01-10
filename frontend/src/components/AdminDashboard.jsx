import React, { useState, useEffect } from "react";

function AdminDashboard() {
	const [petitions, setPetitions] = useState([]);
	const [responseText, setResponse] = useState(""); // Renamed to responseText to avoid conflict
	const [selectedPetition, setSelectedPetition] = useState(null); // For reading a petition

	// Fetch petitions data from the backend
	useEffect(() => {
		const fetchPetitions = async () => {
			try {
				const response = await fetch("http://localhost:5000/slpp/petitions");
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
				`http://localhost:5000/slpp/user-petition/${petitionId}/feedback`,
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

	// Close petition feedback section
	const handleCloseFeedback = () => {
		setSelectedPetition(null); // Close feedback section
	};

	// Close petition (change status to closed)
	const handleClosePetition = async (petitionId) => {
		try {
			const response = await fetch(
				`http://localhost:5000/slpp/user-petition/${petitionId}/status`,
				{
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ status: "closed" }), // Change the petition status to closed
				}
			);

			if (!response.ok) {
				throw new Error("Error updating petition status");
			}

			// Update the status in the state
			setPetitions((prevPetitions) =>
				prevPetitions.map((petition) =>
					petition.petition_id === petitionId
						? { ...petition, status: "closed" } // Change status to closed
						: petition
				)
			);

			alert("Petition status updated to closed!");
		} catch (error) {
			console.error("Error updating petition status:", error);
		}
	};

	return (
		<div className="admin-dashboard p-6 bg-gray-100 min-h-screen">
			<h1 className="text-3xl font-semibold text-center mb-6">
				Petitions Committee Dashboard
			</h1>

			{/* Logout Button */}
			<button
				onClick={handleLogout}
				className="bg-red-500 text-white py-2 px-4 rounded-md mb-6 hover:bg-red-600"
			>
				Logout
			</button>

			{/* Petitions List */}
			<div className="petitions-list mb-6">
				<h2 className="text-2xl font-semibold mb-4">Petitions List</h2>
				{petitions.length === 0 ? (
					<p>No petitions available.</p>
				) : (
					<table className="table-auto w-full border-collapse border border-gray-300">
						<thead>
							<tr>
								<th className="px-4 py-2 border border-gray-300">Title</th>
								<th className="px-4 py-2 border border-gray-300">User Name</th>
								<th className="px-4 py-2 border border-gray-300">Status</th>
								<th className="px-4 py-2 border border-gray-300">Signatures</th>
								<th className="px-4 py-2 border border-gray-300">Response</th>
								<th className="px-4 py-2 border border-gray-300">Action</th>
							</tr>
						</thead>
						<tbody>
							{petitions.map((petition) => (
								<tr key={petition.petition_id}>
									<td className="px-4 py-2 border border-gray-300">
										{petition.title}
									</td>
									<td className="px-4 py-2 border border-gray-300">
										{petition.petitioner_name}
									</td>
									<td className="px-4 py-2 border border-gray-300">
										{petition.status}
									</td>
									<td className="px-4 py-2 border border-gray-300">
										{petition.signatures}
									</td>
									<td className="px-4 py-2 border border-gray-300">
										{petition.response || "No response provided"}
									</td>
									<td className="px-4 py-2 border border-gray-300">
										<button
											className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600 mb-2"
											onClick={() => setSelectedPetition(petition)}
										>
											Read Petition
										</button>
										{petition.status === "open" && (
											<button
												className="bg-gray-500 text-white py-1 px-3 rounded hover:bg-gray-600"
												onClick={() =>
													handleClosePetition(petition.petition_id)
												}
											>
												Close Petition
											</button>
										)}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				)}
			</div>

			{/* Selected Petition Details */}
			{selectedPetition && (
				<div className="petition-details bg-white p-6 border border-gray-300 rounded-md shadow-lg max-w-3xl mx-auto">
					<h3 className="text-xl font-semibold mb-4">Petition Details</h3>
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
						className="w-full p-2 border border-gray-300 rounded-md mb-4"
						placeholder="Write feedback"
					/>
					<div className="flex space-x-4">
						<button
							className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600"
							onClick={() => handleSubmitFeedback(selectedPetition.petition_id)}
						>
							Submit Feedback
						</button>
						<button
							className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600"
							onClick={handleCloseFeedback}
						>
							Close Feedback
						</button>
					</div>
				</div>
			)}
		</div>
	);
}

export default AdminDashboard;
