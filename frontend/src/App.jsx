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
		<div>
			<h1 className="flex justify-center text-3xl mt-3 mb-5 font-bold text-black-700 text-center">
				Shangri-La Petition Platform{" "}
			</h1>
			<div className="flex justify-center items-center bg-gray-100">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
					<div className="p-4">
						<RegistrationForm />
					</div>
					<div className="p-4">
						<LoginForm />
					</div>
				</div>
			</div>
		</div>
	);
}

export default App;
