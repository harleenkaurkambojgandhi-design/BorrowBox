import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, Phone, MapPin, AlertCircle } from 'lucide-react';

/**
 * Signup page component
 */
const SignupPage = () => {
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		password: '',
		confirmPassword: '',
		gender: '',
		phoneNumber: '',
		area: '',
	});
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);

	const { signup } = useAuth();

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

	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
		setError(''); // Clear error when user types
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError('');

		// Validate passwords match
		if (formData.password !== formData.confirmPassword) {
			setError('Passwords do not match');
			setLoading(false);
			return;
		}

		// Remove confirmPassword before sending to backend
		const { confirmPassword, ...userData } = formData;

		const result = await signup(userData);

		if (!result.success) {
			setError(result.message);
		}

		setLoading(false);
	};

	return (
		<div className='relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-200 via-indigo-200 to-purple-200 animate-gradient-flow text-white'>
			{/* Floating blobs with minimal, elegant color scheme */}
			<div className='absolute top-0 -left-40 w-96 h-96 bg-blue-400 blob delay1'></div>
			<div className='absolute bottom-0 right-0 w-96 h-96 bg-indigo-400 blob delay2'></div>
			<div className='absolute top-40 left-20 w-96 h-96 bg-purple-400 blob delay3'></div>
			<div className='container'>
				<div className='row justify-content-center'>
					<div className='col-md-8 col-lg-6'>
						<div className='card shadow-sm'>
							<div className='card-body p-4'>
								<div className='text-center mb-4'>
									<h2 className='card-title mb-2'>📦 BorrowBox</h2>
									<p className='text-muted'>Create your account</p>
								</div>

								{error && (
									<div className='alert alert-danger d-flex align-items-center mb-3'>
										<AlertCircle size={18} className='me-2' />
										{error}
									</div>
								)}

								<form onSubmit={handleSubmit}>
									<div className='row mb-3'>
										<div className='col-md-6'>
											<label htmlFor='name' className='form-label'>
												Full Name *
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
													placeholder='Enter your name'
													required
												/>
											</div>
										</div>
										<div className='col-md-6'>
											<label htmlFor='email' className='form-label'>
												Email *
											</label>
											<div className='input-group'>
												<span className='input-group-text'>
													<Mail size={18} />
												</span>
												<input
													type='email'
													className='form-control'
													id='email'
													name='email'
													value={formData.email}
													onChange={handleChange}
													placeholder='Enter your email'
													required
												/>
											</div>
										</div>
									</div>

									<div className='row mb-3'>
										<div className='col-md-6'>
											<label htmlFor='password' className='form-label'>
												Password *
											</label>
											<div className='input-group'>
												<span className='input-group-text'>
													<Lock size={18} />
												</span>
												<input
													type='password'
													className='form-control'
													id='password'
													name='password'
													value={formData.password}
													onChange={handleChange}
													placeholder='Enter password'
													required
													minLength='6'
												/>
											</div>
										</div>
										<div className='col-md-6'>
											<label htmlFor='confirmPassword' className='form-label'>
												Confirm Password *
											</label>
											<div className='input-group'>
												<span className='input-group-text'>
													<Lock size={18} />
												</span>
												<input
													type='password'
													className='form-control'
													id='confirmPassword'
													name='confirmPassword'
													value={formData.confirmPassword}
													onChange={handleChange}
													placeholder='Confirm password'
													required
													minLength='6'
												/>
											</div>
										</div>
									</div>

									<div className='mb-3'>
										<label className='form-label'>Gender *</label>
										<div className='row'>
											<div className='col-6'>
												<div className='form-check'>
													<input
														className='form-check-input'
														type='radio'
														name='gender'
														id='male'
														value='male'
														checked={formData.gender === 'male'}
														onChange={handleChange}
														required
													/>
													<label
														className='form-check-label d-flex align-items-center'
														htmlFor='male'
													>
														👨 Male
													</label>
												</div>
											</div>
											<div className='col-6'>
												<div className='form-check'>
													<input
														className='form-check-input'
														type='radio'
														name='gender'
														id='female'
														value='female'
														checked={formData.gender === 'female'}
														onChange={handleChange}
														required
													/>
													<label
														className='form-check-label d-flex align-items-center'
														htmlFor='female'
													>
														👩 Female
													</label>
												</div>
											</div>
										</div>
									</div>

									<div className='row mb-4'>
										<div className='col-md-6'>
											<label htmlFor='phoneNumber' className='form-label'>
												Phone Number *
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
													placeholder='10-digit phone number'
													pattern='[0-9]{10}'
													required
												/>
											</div>
										</div>
										<div className='col-md-6'>
											<label htmlFor='area' className='form-label'>
												Area *
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
													<option value=''>Select your area</option>
													{areas.map((area) => (
														<option key={area} value={area}>
															{area}
														</option>
													))}
												</select>
											</div>
										</div>
									</div>

									<button
										type='submit'
										className='btn btn-primary w-100 mb-3'
										disabled={loading}
									>
										{loading ? (
											<span>
												<span
													className='spinner-border spinner-border-sm me-2'
													role='status'
												></span>
												Creating account...
											</span>
										) : (
											'Create Account'
										)}
									</button>
								</form>

								<div className='text-center'>
									<span className='text-muted'>Already have an account? </span>
									<Link to='/login' className='text-decoration-none'>
										Sign in
									</Link>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SignupPage;
