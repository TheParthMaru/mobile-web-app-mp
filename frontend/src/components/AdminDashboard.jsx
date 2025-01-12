import React, { useState, useEffect } from "react";

function AdminDashboard() {
	const [petitions, setPetitions] = useState([]);
	const [responseText, setResponse] = useState("");
	const [selectedPetition, setSelectedPetition] = useState(null);
	const [threshold, setThreshold] = useState(""); // For the signature threshold input
	const [currentThreshold, setCurrentThreshold] = useState(0); // Current threshold from the DB

	// Fetch petitions and threshold data from the backend
	useEffect(() => {
		const fetchData = async () => {
			try {
				// Fetch petitions
				const petitionsResponse = await fetch(
					"http://localhost:5000/slpp/petitions"
				);
				if (!petitionsResponse.ok) {
					throw new Error(`Error: ${petitionsResponse.statusText}`);
				}
				const petitionsData = await petitionsResponse.json();
				setPetitions(petitionsData.petitions || []);

				// Fetch current signature threshold
				const thresholdResponse = await fetch(
					"http://localhost:5000/slpp/threshold"
				);
				if (!thresholdResponse.ok) {
					throw new Error(`Error: ${thresholdResponse.statusText}`);
				}
				const thresholdData = await thresholdResponse.json();
				setCurrentThreshold(thresholdData.currentThreshold || 0);
			} catch (error) {
				console.error("Error fetching data:", error);
			}
		};

		fetchData();
	}, []);

	// Update the signature threshold
	const handleThresholdSubmit = async () => {
		try {
			const response = await fetch("http://localhost:5000/slpp/threshold", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ threshold: parseInt(threshold) }),
			});

			if (!response.ok) {
				throw new Error("Error updating threshold");
			}

			setCurrentThreshold(parseInt(threshold));
			alert("Threshold updated successfully!");
			setThreshold(""); // Clear the input
		} catch (error) {
			console.error("Error updating threshold:", error);
		}
	};

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
					body: JSON.stringify({ feedback: responseText }),
				}
			);

			if (!response.ok) {
				throw new Error("Error saving feedback");
			}

			alert("Feedback submitted successfully!");
			setResponse("");
			setPetitions((prevPetitions) =>
				prevPetitions.map((petition) =>
					petition.petition_id === petitionId
						? { ...petition, response: responseText }
						: petition
				)
			);
		} catch (error) {
			console.error("Error saving feedback:", error);
		}

		handleCloseFeedback();
	};

	// Close feedback section
	const handleCloseFeedback = () => {
		setSelectedPetition(null);
	};

	// Close petition
	const handleClosePetition = async (petitionId) => {
		try {
			const response = await fetch(
				`http://localhost:5000/slpp/user-petition/${petitionId}/status`,
				{
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ status: "closed" }),
				}
			);

			if (!response.ok) {
				throw new Error("Error updating petition status");
			}

			setPetitions((prevPetitions) =>
				prevPetitions.map((petition) =>
					petition.petition_id === petitionId
						? { ...petition, status: "closed" }
						: petition
				)
			);

			alert("Petition status updated to closed!");
		} catch (error) {
			console.error("Error updating petition status:", error);
		}
	};

	// Logout function
	const handleLogout = () => {
		localStorage.removeItem("email");
		localStorage.removeItem("fullName");
		alert("You have logged out successfully.");
		window.location.href = "/";
	};

	return (
		<div className="admin-dashboard p-6 bg-gray-100 min-h-screen">
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-3xl font-semibold">
					Petitions Committee Dashboard
				</h1>
				<button
					onClick={handleLogout}
					className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
				>
					Logout
				</button>
			</div>

			<div className="mb-6">
				<h2 className="text-2xl font-semibold mb-2">
					Current Signature Threshold:{" "}
					<span className="text-blue-600">{currentThreshold}</span>
				</h2>
				<div className="flex items-center space-x-4">
					<input
						type="number"
						value={threshold}
						onChange={(e) => setThreshold(e.target.value)}
						className="p-2 border border-gray-300 rounded-md"
						placeholder="Set signature threshold"
					/>
					<button
						onClick={handleThresholdSubmit}
						className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
					>
						Update Threshold
					</button>
				</div>
			</div>

			<div className="petitions-list">
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
								<tr
									key={petition.petition_id}
									className={
										petition.signature_count >= currentThreshold
											? "text-green-600 font-bold"
											: ""
									}
								>
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
										{petition.signature_count}
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
					<p>
						<strong>Signature Count:</strong> {selectedPetition.signature_count}
					</p>
					<textarea
						value={responseText}
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
