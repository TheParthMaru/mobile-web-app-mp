import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
	const navigate = useNavigate();

	useEffect(() => {
		// Check if the token exists in localStorage
		const token = localStorage.getItem("authToken");

		if (!token) {
			// If no token, redirect to login page
			navigate("/login");
		}
	}, [navigate]);

	return (
		<div>
			<h1>Welcome to the Dashboard</h1>
			{/* Add your dashboard content here */}
		</div>
	);
}

export default Dashboard;
