import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import RegistrationForm from "./components/RegistrationForm";
import LoginForm from "./components/LoginForm";
import Dashboard from "./components/Dashboard";
import AdminDashboard from "./components/AdminDashboard";
import "./App.css";
import "./styles.css";

function App() {
	return (
		<Router>
			<div className="App">
				<Routes>
					<Route path="/" element={<HomePage />} />
					<Route path="/login" element={<LoginForm />} />
					<Route path="/adminDashboard" element={<AdminDashboard />} />
					<Route path="/dashboard" element={<Dashboard />} />
				</Routes>
			</div>
		</Router>
	);
}

function HomePage() {
	return (
		<div className="home-page">
			<div className="card-container">
				<div className="card">
					<h2>Register</h2>
					<RegistrationForm />
				</div>
				<div className="card">
					<h2>Login</h2>
					<LoginForm />
				</div>
			</div>
		</div>
	);
}

export default App;
