import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllRequests, acceptRequest } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import RequestCard from '../components/RequestCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { Filter, Search } from 'lucide-react';

/**
 * Main page component - displays all pending requests
 */
const MainPage = () => {
	const [requests, setRequests] = useState([]);
	const [filteredRequests, setFilteredRequests] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [filters, setFilters] = useState({
		type: '',
		search: '',
		sortBy: 'createdAt',
		sortOrder: 'desc',
	});

	const { user } = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		fetchRequests();
	}, []);

	useEffect(() => {
		applyFilters();
	}, [requests, filters]);

	const fetchRequests = async () => {
		try {
			setLoading(true);
			const response = await getAllRequests({ status: 'pending' });
			if (response.success) {
				// Filter out user's own requests
				const otherRequests = response.data.requests.filter(
					(request) => request.requestor._id !== user.id
				);
				setRequests(otherRequests);
			} else {
				setError(response.message);
			}
		} catch (error) {
			console.error('Fetch requests error:', error);
			setError('Failed to load requests');
		} finally {
			setLoading(false);
		}
	};

	const applyFilters = () => {
		let filtered = [...requests];

		// Filter by type
		if (filters.type) {
			filtered = filtered.filter((request) => request.type === filters.type);
		}

		// Filter by search term
		if (filters.search) {
			const searchTerm = filters.search.toLowerCase();
			filtered = filtered.filter((request) => {
				const itemName = request.itemName?.toLowerCase() || '';
				const topic = request.topic?.toLowerCase() || '';
				const requestorName = request.requestor.name.toLowerCase();
				const area = request.requestor.area.toLowerCase();

				return (
					itemName.includes(searchTerm) ||
					topic.includes(searchTerm) ||
					requestorName.includes(searchTerm) ||
					area.includes(searchTerm)
				);
			});
		}

		// Sort
		filtered.sort((a, b) => {
			let aValue, bValue;

			switch (filters.sortBy) {
				case 'rating':
					aValue = a.requestor.rating;
					bValue = b.requestor.rating;
					break;
				case 'area':
					aValue = a.requestor.area;
					bValue = b.requestor.area;
					break;
				default:
					aValue = new Date(a.createdAt);
					bValue = new Date(b.createdAt);
			}

			if (filters.sortOrder === 'asc') {
				return aValue > bValue ? 1 : -1;
			} else {
				return aValue < bValue ? 1 : -1;
			}
		});

		setFilteredRequests(filtered);
	};

	const handleAcceptRequest = async (requestId) => {
		try {
			const response = await acceptRequest(requestId);
			if (response.success) {
				// Remove the accepted request from the list
				setRequests((prevRequests) =>
					prevRequests.filter((req) => req._id !== requestId)
				);
				alert(
					'Request accepted successfully! You can now view it in "My Requests".'
				);
			} else {
				setError(response.message);
			}
		} catch (error) {
			console.error('Accept request error:', error);
			setError('Failed to accept request');
		}
	};

	const handleFilterChange = (e) => {
		setFilters({
			...filters,
			[e.target.name]: e.target.value,
		});
	};

	if (loading) {
		return <LoadingSpinner />;
	}

	return (
		<div>
			<Navbar />

			<div className='container mt-4'>
				<div className='d-flex justify-content-between align-items-center mb-4'>
					<div>
						<h2>Browse Requests</h2>
						<p className='text-muted'>
							Help others by accepting their requests
						</p>
					</div>
					<button
						className='btn btn-primary'
						onClick={() => navigate('/add-request')}
					>
						Add New Request
					</button>
				</div>

				{/* Filters */}
				<div className='card mb-4'>
					<div className='card-body'>
						<h6 className='card-title d-flex align-items-center mb-3'>
							<Filter size={18} className='me-2' />
							Filters & Search
						</h6>

						<div className='row'>
							<div className='col-md-3'>
								<select
									className='form-select'
									name='type'
									value={filters.type}
									onChange={handleFilterChange}
								>
									<option value=''>All Types</option>
									<option value='item'>Items Only</option>
									<option value='guidance'>Guidance Only</option>
								</select>
							</div>

							<div className='col-md-4'>
								<div className='input-group'>
									<span className='input-group-text'>
										<Search size={18} />
									</span>
									<input
										type='text'
										className='form-control'
										placeholder='Search requests, names, areas...'
										name='search'
										value={filters.search}
										onChange={handleFilterChange}
									/>
								</div>
							</div>

							<div className='col-md-2'>
								<select
									className='form-select'
									name='sortBy'
									value={filters.sortBy}
									onChange={handleFilterChange}
								>
									<option value='createdAt'>Date</option>
									<option value='rating'>Rating</option>
									<option value='area'>Area</option>
								</select>
							</div>

							<div className='col-md-2'>
								<select
									className='form-select'
									name='sortOrder'
									value={filters.sortOrder}
									onChange={handleFilterChange}
								>
									<option value='desc'>Descending</option>
									<option value='asc'>Ascending</option>
								</select>
							</div>
						</div>
					</div>
				</div>

				{error && <div className='alert alert-danger'>{error}</div>}

				{/* Results */}
				<div className='mb-3'>
					<span className='text-muted'>
						Showing {filteredRequests.length} of {requests.length} requests
					</span>
				</div>

				{filteredRequests.length === 0 ? (
					<div className='text-center py-5'>
						<div className='mb-3'>📭</div>
						<h5>No requests found</h5>
						<p className='text-muted'>
							{requests.length === 0
								? 'No pending requests at the moment. Check back later!'
								: 'Try adjusting your filters to see more results.'}
						</p>
					</div>
				) : (
					<div className='row'>
						{filteredRequests.map((request) => (
							<div key={request._id} className='col-md-6 col-lg-4 mb-4'>
								<RequestCard
									request={request}
									showAcceptButton={true}
									onAccept={handleAcceptRequest}
								/>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
};

export default MainPage;
