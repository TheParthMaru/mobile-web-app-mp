import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles.css";

function Dashboard() {
	const [petitions, setPetitions] = useState([]);
	const [form, setForm] = useState({
		title: "",
		content: "",
	});
	const [editingPetitionId, setEditingPetitionId] = useState(null);

	const email = localStorage.getItem("email");
	const fullName = localStorage.getItem("fullName");

	useEffect(() => {
		axios
			.get(`http://localhost:5000/api/petitions`, { params: { email } })
			.then((response) => setPetitions(response.data))
			.catch((err) => console.error(err));
	}, [email]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
	};

	const handleCreate = () => {
		axios
			.post(`http://localhost:5000/api/petitions`, {
				...form,
				petitioner_email: email,
			})
			.then((response) => {
				setPetitions((prev) => [
					...prev,
					{ ...form, petition_id: response.data.petitionId },
				]);
				setForm({ title: "", content: "" });
			})
			.catch((err) => console.error(err));
	};

	const handleUpdate = () => {
		axios
			.put(`http://localhost:5000/api/petitions/${editingPetitionId}`, form)
			.then(() => {
				setPetitions((prev) =>
					prev.map((p) =>
						p.petition_id === editingPetitionId ? { ...p, ...form } : p
					)
				);
				setForm({ title: "", content: "" });
				setEditingPetitionId(null);
			})
			.catch((err) => console.error(err));
	};

	const handleDelete = (id) => {
		axios
			.delete(`http://localhost:5000/api/petitions/${id}`)
			.then(() =>
				setPetitions((prev) => prev.filter((p) => p.petition_id !== id))
			)
			.catch((err) => console.error(err));
	};

	const handleLogout = () => {
		localStorage.removeItem("email");
		localStorage.removeItem("fullName");
		alert("You have logged out successfully.");
		window.location.href = "/";
	};

	return (
		<div className="p-6 bg-gray-100 min-h-screen">
			<div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
				<h1 className="text-2xl font-bold text-gray-800 mb-4">
					Welcome, {fullName}
				</h1>

				<button
					onClick={handleLogout}
					className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition mb-6"
				>
					Logout
				</button>

				<div className="mb-6">
					<h2 className="text-xl font-semibold text-gray-700 mb-4">
						{editingPetitionId ? "Edit Petition" : "Create Petition"}
					</h2>
					<input
						name="title"
						placeholder="Title"
						value={form.title}
						onChange={handleChange}
						className="w-full border border-gray-300 rounded-md p-2 mb-4"
					/>
					<textarea
						name="content"
						placeholder="Content"
						value={form.content}
						onChange={handleChange}
						className="w-full border border-gray-300 rounded-md p-2 mb-4"
					/>
					<button
						onClick={editingPetitionId ? handleUpdate : handleCreate}
						className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
					>
						{editingPetitionId ? "Update" : "Create"}
					</button>
				</div>

				<div>
					<h2 className="text-xl font-semibold text-gray-700 mb-4">
						Your Petitions
					</h2>
					<ul>
						{petitions.map((p) => (
							<li
								key={p.petition_id}
								className="bg-gray-100 border border-gray-300 rounded-lg p-4 mb-4"
							>
								<h3 className="text-lg font-bold text-gray-800">{p.title}</h3>
								<p className="text-gray-600 mb-2">{p.content}</p>
								<p className="text-sm text-gray-500">
									<strong>Status:</strong> {p.status}
								</p>
								<p className="text-sm text-gray-500 mb-2">
									<strong>Response:</strong>{" "}
									{p.response || "No response provided"}
								</p>
								<div className="flex space-x-4">
									<button
										onClick={() => handleDelete(p.petition_id)}
										className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition"
									>
										Delete
									</button>
									<button
										onClick={() => {
											setForm({ title: p.title, content: p.content });
											setEditingPetitionId(p.petition_id);
										}}
										className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 transition"
									>
										Edit
									</button>
								</div>
							</li>
						))}
					</ul>
				</div>
			</div>
		</div>
	);
}

export default Dashboard;
