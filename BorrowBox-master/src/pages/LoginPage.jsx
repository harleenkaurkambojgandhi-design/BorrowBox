import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Lock, AlertCircle } from 'lucide-react';

/**
 * Login page component
 */
const LoginPage = () => {
	const [formData, setFormData] = useState({
		email: '',
		password: '',
	});
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);

	const { login } = useAuth();

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

		const result = await login(formData.email, formData.password);

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
					<div className='col-md-6 col-lg-4'>
						<div className='card shadow-sm'>
							<div className='card-body p-4'>
								<div className='text-center mb-4'>
									<h2 className='card-title mb-2'>📦 BorrowBox</h2>
									<p className='text-muted'>Sign in to your account</p>
								</div>

								{error && (
									<div className='alert alert-danger d-flex align-items-center mb-3'>
										<AlertCircle size={18} className='me-2' />
										{error}
									</div>
								)}

								<form onSubmit={handleSubmit}>
									<div className='mb-3'>
										<label htmlFor='email' className='form-label'>
											Email
										</label>
										<div className='input-group'>
											<span className='input-group-text'>
												<User size={18} />
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

									<div className='mb-4'>
										<label htmlFor='password' className='form-label'>
											Password
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
												placeholder='Enter your password'
												required
												minLength='6'
											/>
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
												Signing in...
											</span>
										) : (
											'Sign In'
										)}
									</button>
								</form>

								<div className='text-center'>
									<span className='text-muted'>Don't have an account? </span>
									<Link to='/signup' className='text-decoration-none'>
										Sign up
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

export default LoginPage;
