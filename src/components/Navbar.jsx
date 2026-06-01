import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const NAV_ITEMS = [
	{
		key: "dashboard",
		label: "Dashboard",
		content: (
			<div className="dropdown-section">
				<div className="font-bold text-blue-700 text-base mb-1">Dashboard</div>
				<p className="text-gray-700 text-sm leading-relaxed mb-0">
					Access the main dashboard for an overview of system status, key metrics, and quick navigation to all features.
				</p>
			</div>
		),
	},
	{
		key: "single-line",
		label: "Single-Line",
		content: (
			<div className="dropdown-section">
				<div className="font-bold text-blue-700 text-base mb-1">Single-Line</div>
				<p className="text-gray-700 text-sm leading-relaxed mb-0">
					View and analyze single-line diagrams and telemetry for individual transmission lines.
				</p>
			</div>
		),
	},
	{
		key: "multi-line",
		label: "Multi-Line",
		content: (
			<div className="dropdown-section">
				<div className="font-bold text-blue-700 text-base mb-1">Multi-Line</div>
				<p className="text-gray-700 text-sm leading-relaxed mb-0">
					Compare and monitor multiple lines simultaneously for advanced grid analysis.
				</p>
			</div>
		),
	},
	{
		key: "details",
		label: "Details",
		content: (
			<div className="dropdown-section">
				<div className="font-bold text-blue-700 text-base mb-1">Details</div>
				<p className="text-gray-700 text-sm leading-relaxed mb-0">
					Explore detailed information, historical data, and analytics for the power system.
				</p>
			</div>
		),
	},
];

export default function Navbar({ active, setActive }) {
	const [open, setOpen] = useState("");
	// Track hover state to keep dropdown open when mouse is over button or dropdown
	const [hovered, setHovered] = useState("");
	const navigate = useNavigate();

	const handleDropdown = (key) => {
		setOpen(open === key ? "" : key);
		setActive(key);
		// Navigation for main tabs
		if (key === "dashboard") navigate("/dashboard");
		if (key === "single-line") navigate("/single-line");
		if (key === "multi-line") navigate("/multi-line");
		if (key === "details") navigate("/details");
	};

	const handleMouseEnter = (key) => {
		setHovered(key);
		setOpen(key);
	};

	const handleMouseLeave = (key) => {
		setHovered("");
		setOpen("");
	};

	return (
		<nav className="w-full flex flex-row gap-4 justify-center items-center bg-white/60 dark:bg-gray-900/60 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 px-4 py-2 sticky top-0 z-10 backdrop-blur">
			{NAV_ITEMS.map((item) => (
				<div
					key={item.key}
					className="relative"
					onMouseEnter={() => handleMouseEnter(item.key)}
					onMouseLeave={() => handleMouseLeave(item.key)}
				>
					<button
						className={`text-base md:text-lg font-semibold px-4 py-2 rounded-lg transition focus:outline-none focus:underline hover:underline ${
							active === item.key
								? "bg-blue-100 dark:bg-blue-900/30 text-blue-900 dark:text-blue-200"
								: "text-blue-900 dark:text-blue-200"
						}`}
						onClick={() => handleDropdown(item.key)}
						aria-haspopup="true"
						aria-expanded={open === item.key}
					>
						{item.label}
					</button>
					{open === item.key && (
						<div
							className="absolute left-1/2 -translate-x-1/2 mt-2 min-w-[220px] max-w-xs bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl p-4 z-50 dropdown-content transition-all duration-200 ease-in-out opacity-100 scale-100 animate-fade-in"
							style={{
								pointerEvents: open === item.key ? 'auto' : 'none',
								transition: 'opacity 0.2s, transform 0.2s',
								opacity: open === item.key ? 1 : 0,
								transform: open === item.key ? 'scale(1)' : 'scale(0.95)',
							}}
						>
							{item.content}
						</div>
					)}
				</div>
			))}
		</nav>
	);
}