import React, { useState, useEffect } from "react";
import axios from "axios";

function Dashboard() {
	const [petitions, setPetitions] = useState([]);
	const [form, setForm] = useState({
		title: "",
		content: "",
	});
	const [editingPetitionId, setEditingPetitionId] = useState(null);

	const email = localStorage.getItem("email");
	const fullName = localStorage.getItem("fullName");

	console.log("Email from local storage: ", email);
	console.log("Fullname from local storage: ", fullName);

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

	return (
		<div>
			<h1>Welcome {fullName}</h1>

			<div>
				<h2>{editingPetitionId ? "Edit Petition" : "Create Petition"}</h2>
				<input
					name="title"
					placeholder="Title"
					value={form.title}
					onChange={handleChange}
				/>
				<textarea
					name="content"
					placeholder="Content"
					value={form.content}
					onChange={handleChange}
				/>
				<button onClick={editingPetitionId ? handleUpdate : handleCreate}>
					{editingPetitionId ? "Update" : "Create"}
				</button>
			</div>

			<div>
				<h2>Your Petitions</h2>
				<ul>
					{petitions.map((p) => (
						<li key={p.petition_id}>
							<h3>{p.title}</h3>
							<p>{p.content}</p>
							<button onClick={() => handleDelete(p.petition_id)}>
								Delete
							</button>
							<button
								onClick={() => {
									setForm({ title: p.title, content: p.content });
									setEditingPetitionId(p.petition_id);
								}}
							>
								Edit
							</button>
						</li>
					))}
				</ul>
			</div>
		</div>
	);
}

export default Dashboard;
