import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Package, Plus, LogOut } from 'lucide-react';

/**
 * Navigation bar component
 * Displays user menu and navigation options
 */
const Navbar = () => {
	const { user, logout } = useAuth();
	const navigate = useNavigate();
	const [dropdownOpen, setDropdownOpen] = useState(false);

	const handleLogout = () => {
		logout();
		navigate('/login');
	};

	return (
		<nav className='bg-blue-600 px-4 py-2'>
			<div className='container mx-auto flex items-center justify-between'>
				<Link
					className='text-white font-bold text-2xl no-underline flex items-center gap-2'
					to='/main'
				>
					<span>📦</span> BorrowBox
				</Link>
				<ul className='flex items-center gap-6'>
					<li>
						<Link
							to='/main'
							className='flex items-center gap-1 text-white no-underline hover:text-black-800 transition-colors duration-200'
							style={{ textDecoration: 'none' }}
						>
							<Package size={18} />
							<span>Browse Requests</span>
						</Link>
					</li>

					<li>
						<Link
							className='flex items-center gap-1 text-white no-underline hover:underline'
							to='/requests'
						>
							<Package size={18} /> <span>My Requests</span>
						</Link>
					</li>
					<li>
						<Link
							className='flex items-center gap-1 text-white border no-underline border-white rounded px-2 py-1 hover:bg-white hover:text-blue-600 transition'
							to='/add-request'
						>
							<Plus size={18} /> <span>Add Request</span>
						</Link>
					</li>
					<li className='relative'>
						<button
							className='flex items-center gap-1 text-white hover:underline focus:outline-none'
							onClick={() => setDropdownOpen((open) => !open)}
						>
							<User size={18} /> <span>{user?.name}</span>
						</button>
						{dropdownOpen && (
							<div className='absolute right-0 mt-2 w-40 bg-white rounded shadow-lg z-10'>
								<Link
									className='flex items-center gap-2 px-4 py-2 hover:bg-blue-100 text-blue-600'
									to='/profile'
									onClick={() => setDropdownOpen(false)}
								>
									<User size={16} /> Manage Profile
								</Link>
								<hr />
								<button
									className='flex items-center gap-2 px-4 py-2 w-full text-left hover:bg-blue-100 text-blue-600'
									onClick={() => {
										handleLogout();
										setDropdownOpen(false);
									}}
								>
									<LogOut size={16} /> Logout
								</button>
							</div>
						)}
					</li>
				</ul>
			</div>
		</nav>
	);
};

export default Navbar;
