import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
	const navigate = useNavigate();
	const [fullName, setFullName] = useState("");

	useEffect(() => {
		// Check if the token exists in localStorage
		const token = localStorage.getItem("authToken");

		if (!token) {
			// If no token, redirect to homepage
			navigate("/");
		} else {
			// Fetch the full name from localStorage (or make an API call to fetch it)
			const userFullName = localStorage.getItem("fullName");
			console.log("Full name received on dashboard: ", userFullName);

			setFullName(userFullName);
		}
	}, [navigate]);

	const handleLogout = () => {
		localStorage.removeItem("authToken");
		localStorage.removeItem("fullName");
		navigate("/");
	};

	return (
		<div>
			<h1>Welcome {fullName ? fullName : "to the Dashboard"}</h1>
			<button onClick={handleLogout}>Logout</button>
		</div>
	);
}

export default Dashboard;
