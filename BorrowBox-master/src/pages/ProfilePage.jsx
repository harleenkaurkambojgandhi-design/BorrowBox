import React, { useState, useEffect } from 'react';
import { updateUserProfile, getUserRatings } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { User, Phone, MapPin, Star, Edit3 } from 'lucide-react';

/**
 * Profile management page
 */
const ProfilePage = () => {
	const { user, updateUser } = useAuth();
	const [isEditing, setIsEditing] = useState(false);
	const [formData, setFormData] = useState({
		name: user?.name || '',
		phoneNumber: user?.phoneNumber || '',
		area: user?.area || '',
	});
	const [ratings, setRatings] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');

	const areas = [
		'Turing',
		'Turing Extension',
		'Edison',
		'Architecture',
		'Rockefeller',
		'Rockefeller Extension',
		'Martin Luther',
		'Darwin',
		'Newton',
		'Tesla',
		'Galileo',
		'Fleming',
	];

	useEffect(() => {
		if (user?.id) {
			setFormData({
				name: user.name,
				phoneNumber: user.phoneNumber,
				area: user.area,
			});
			fetchRatings();
		}
	}, [user]);

	const fetchRatings = async () => {
		try {
			const response = await getUserRatings(user.id);
			if (response.success) {
				setRatings(response.data.ratings);
			}
		} catch (error) {
			console.error('Fetch ratings error:', error);
		}
	};

	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
		setError('');
		setSuccess('');
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError('');
		setSuccess('');

		try {
			const response = await updateUserProfile(formData);
			if (response.success) {
				updateUser(response.data.user);
				setSuccess('Profile updated successfully!');
				setIsEditing(false);
			} else {
				setError(response.message);
			}
		} catch (error) {
			console.error('Update profile error:', error);
			setError(error.response?.data?.message || 'Failed to update profile');
		} finally {
			setLoading(false);
		}
	};

	const handleCancel = () => {
		setFormData({
			name: user.name,
			phoneNumber: user.phoneNumber,
			area: user.area,
		});
		setIsEditing(false);
		setError('');
		setSuccess('');
	};

	const getRatingDisplay = () => {
		if (user.rating === 0) {
			return (
				<div className='d-flex align-items-center'>
					<span className='badge bg-secondary me-2'>New User</span>
					<small className='text-muted'>No ratings yet</small>
				</div>
			);
		}

		return (
			<div className='d-flex align-items-center'>
				<div className='d-flex align-items-center me-3'>
					<Star size={20} className='text-warning me-1' fill='currentColor' />
					<span className='fw-bold fs-5'>{user.rating.toFixed(1)}</span>
				</div>
				<small className='text-muted'>
					Based on {user.totalRatings} rating
					{user.totalRatings !== 1 ? 's' : ''}
				</small>
			</div>
		);
	};

	if (!user) {
		return <div>Loading...</div>;
	}

	return (
		<div>
			<Navbar />

			<div className='container mt-4'>
				<div className='row'>
					<div className='col-md-8'>
						{/* Profile Information */}
						<div className='card mb-4'>
							<div className='card-header d-flex justify-content-between align-items-center'>
								<h5 className='mb-0'>Profile Information</h5>
								{!isEditing && (
									<button
										className='btn btn-outline-primary btn-sm'
										onClick={() => setIsEditing(true)}
									>
										<Edit3 size={16} className='me-1' />
										Edit Profile
									</button>
								)}
							</div>
							<div className='card-body'>
								{error && <div className='alert alert-danger'>{error}</div>}

								{success && (
									<div className='alert alert-success'>{success}</div>
								)}

								{isEditing ? (
									<form onSubmit={handleSubmit}>
										<div className='mb-3'>
											<label htmlFor='name' className='form-label'>
												Full Name
											</label>
											<div className='input-group'>
												<span className='input-group-text'>
													<User size={18} />
												</span>
												<input
													type='text'
													className='form-control'
													id='name'
													name='name'
													value={formData.name}
													onChange={handleChange}
													required
												/>
											</div>
										</div>

										<div className='mb-3'>
											<label htmlFor='phoneNumber' className='form-label'>
												Phone Number
											</label>
											<div className='input-group'>
												<span className='input-group-text'>
													<Phone size={18} />
												</span>
												<input
													type='tel'
													className='form-control'
													id='phoneNumber'
													name='phoneNumber'
													value={formData.phoneNumber}
													onChange={handleChange}
													pattern='[0-9]{10}'
													required
												/>
											</div>
										</div>

										<div className='mb-3'>
											<label htmlFor='area' className='form-label'>
												Area
											</label>
											<div className='input-group'>
												<span className='input-group-text'>
													<MapPin size={18} />
												</span>
												<select
													className='form-select'
													id='area'
													name='area'
													value={formData.area}
													onChange={handleChange}
													required
												>
													{areas.map((area) => (
														<option key={area} value={area}>
															{area}
														</option>
													))}
												</select>
											</div>
										</div>

										<div className='d-flex gap-2'>
											<button
												type='submit'
												className='btn btn-primary'
												disabled={loading}
											>
												{loading ? (
													<span>
														<span
															className='spinner-border spinner-border-sm me-2'
															role='status'
														></span>
														Saving...
													</span>
												) : (
													'Save Changes'
												)}
											</button>
											<button
												type='button'
												className='btn btn-secondary'
												onClick={handleCancel}
												disabled={loading}
											>
												Cancel
											</button>
										</div>
									</form>
								) : (
									<div>
										<div className='row mb-3'>
											<div className='col-sm-3'>
												<strong>Name:</strong>
											</div>
											<div className='col-sm-9'>{user.name}</div>
										</div>

										<div className='row mb-3'>
											<div className='col-sm-3'>
												<strong>Email:</strong>
											</div>
											<div className='col-sm-9'>{user.email}</div>
										</div>

										<div className='row mb-3'>
											<div className='col-sm-3'>
												<strong>Gender:</strong>
											</div>
											<div className='col-sm-9'>
												{user.gender === 'male' ? '👨 Male' : '👩 Female'}
											</div>
										</div>

										<div className='row mb-3'>
											<div className='col-sm-3'>
												<strong>Phone:</strong>
											</div>
											<div className='col-sm-9'>{user.phoneNumber}</div>
										</div>

										<div className='row mb-3'>
											<div className='col-sm-3'>
												<strong>Area:</strong>
											</div>
											<div className='col-sm-9'>{user.area}</div>
										</div>
									</div>
								)}
							</div>
						</div>

						{/* Ratings Section */}
						<div className='card'>
							<div className='card-header'>
								<h5 className='mb-0'>Received Ratings</h5>
							</div>
							<div className='card-body'>
								{ratings.length === 0 ? (
									<div className='text-center py-4'>
										<div className='mb-3'>⭐</div>
										<h6>No ratings yet</h6>
										<p className='text-muted'>
											Complete some requests to receive ratings from others.
										</p>
									</div>
								) : (
									<div>
										{ratings.map((rating) => (
											<div
												key={rating._id}
												className='border-bottom pb-3 mb-3 last:border-0'
											>
												<div className='d-flex justify-content-between align-items-start mb-2'>
													<div>
														<strong>{rating.raterUser.name}</strong>
														<div className='d-flex align-items-center mt-1'>
															{[1, 2, 3, 4, 5].map((star) => (
																<Star
																	key={star}
																	size={16}
																	className={
																		star <= rating.rating
																			? 'text-warning'
																			: 'text-muted'
																	}
																	fill={
																		star <= rating.rating
																			? 'currentColor'
																			: 'none'
																	}
																/>
															))}
															<span className='ms-2 fw-bold'>
																{rating.rating}/5
															</span>
														</div>
													</div>
													<small className='text-muted'>
														{new Date(rating.createdAt).toLocaleDateString()}
													</small>
												</div>
												<div className='text-muted small mb-2'>
													Request:{' '}
													{rating.request.type === 'item'
														? rating.request.itemName
														: rating.request.topic}
												</div>
												{rating.comment && (
													<p className='mb-0'>{rating.comment}</p>
												)}
											</div>
										))}
									</div>
								)}
							</div>
						</div>
					</div>

					<div className='col-md-4'>
						{/* Profile Summary */}
						<div className='card'>
							<div className='card-body text-center'>
								<div className='mb-3'>
									<div
										className='bg-primary rounded-circle d-inline-flex align-items-center justify-content-center'
										style={{ width: '80px', height: '80px' }}
									>
										<User size={40} className='text-white' />
									</div>
								</div>
								<h5 className='card-title'>{user.name}</h5>
								<p className='text-muted'>{user.area}</p>

								<div className='mb-3'>{getRatingDisplay()}</div>

								<div className='text-muted'>
									<small>
										Member since {new Date(user.createdAt).toLocaleDateString()}
									</small>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProfilePage;
