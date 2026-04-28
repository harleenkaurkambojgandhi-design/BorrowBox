import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createRequest } from '../services/api';
import Navbar from '../components/Navbar';
import { Package, BookOpen, Clock, Hash } from 'lucide-react';

/**
 * Add Request page component
 */
const AddRequestPage = () => {
  const [requestType, setRequestType] = useState('item');
  const [formData, setFormData] = useState({
    // Item fields
    itemName: '',
    quantity: 1,
    requestedTime: '',
    // Guidance fields
    topic: '',
    timeNeeded: '',
    // Common fields
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleTypeChange = (type) => {
    setRequestType(type);
    // Clear form data when switching types
    setFormData({
      itemName: '',
      quantity: 1,
      requestedTime: '',
      topic: '',
      timeNeeded: '',
      description: ''
    });
    setError('');
  };

  const handleChange = (e) => {
    const value = e.target.type === 'number' ? parseInt(e.target.value) : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const requestData = {
        type: requestType,
        description: formData.description,
        ...formData
      };

      const response = await createRequest(requestData);
      
      if (response.success) {
        // Success - redirect to main page
        navigate('/main', { 
          replace: true,
          state: { message: 'Request created successfully!' }
        });
      } else {
        setError(response.message);
      }
    } catch (error) {
      console.error('Create request error:', error);
      setError(error.response?.data?.message || 'Failed to create request');
    } finally {
      setLoading(false);
    }
  };

  // Get minimum date for datetime-local input (current date/time)
  const getMinDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };

  return (
    <div>
      <Navbar />
      
      <div className="container mt-4">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card shadow-sm">
              <div className="card-header">
                <h4 className="mb-0">Add New Request</h4>
              </div>
              <div className="card-body">
                {error && (
                  <div className="alert alert-danger mb-4">
                    {error}
                  </div>
                )}

                {/* Request Type Selection */}
                <div className="mb-4">
                  <h6 className="mb-3">Request Type</h6>
                  <div className="row">
                    <div className="col-md-6">
                      <div
                        className={`card h-100 cursor-pointer ${
                          requestType === 'item' ? 'border-primary bg-primary bg-opacity-10' : ''
                        }`}
                        onClick={() => handleTypeChange('item')}
                        style={{ cursor: 'pointer' }}
                      >
                        <div className="card-body text-center">
                          <Package size={32} className="text-primary mb-2" />
                          <h6>Item Request</h6>
                          <p className="card-text small text-muted">
                            Request to borrow physical items like books, tools, etc.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div
                        className={`card h-100 cursor-pointer ${
                          requestType === 'guidance' ? 'border-success bg-success bg-opacity-10' : ''
                        }`}
                        onClick={() => handleTypeChange('guidance')}
                        style={{ cursor: 'pointer' }}
                      >
                        <div className="card-body text-center">
                          <BookOpen size={32} className="text-success mb-2" />
                          <h6>Guidance Request</h6>
                          <p className="card-text small text-muted">
                            Request help, advice, or tutoring on a specific topic.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleSubmit}>
                  {requestType === 'item' ? (
                    // Item Request Form
                    <>
                      <div className="row mb-3">
                        <div className="col-md-8">
                          <label htmlFor="itemName" className="form-label">
                            Item Name *
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="itemName"
                            name="itemName"
                            value={formData.itemName}
                            onChange={handleChange}
                            placeholder="e.g., Calculus Textbook, Drill Machine, Guitar"
                            required
                            maxLength="100"
                          />
                        </div>
                        <div className="col-md-4">
                          <label htmlFor="quantity" className="form-label">
                            <Hash size={16} className="me-1" />
                            Quantity *
                          </label>
                          <input
                            type="number"
                            className="form-control"
                            id="quantity"
                            name="quantity"
                            value={formData.quantity}
                            onChange={handleChange}
                            min="1"
                            max="10"
                            required
                          />
                        </div>
                      </div>

                      <div className="mb-3">
                        <label htmlFor="requestedTime" className="form-label">
                          <Clock size={16} className="me-1" />
                          When do you need it? *
                        </label>
                        <input
                          type="datetime-local"
                          className="form-control"
                          id="requestedTime"
                          name="requestedTime"
                          value={formData.requestedTime}
                          onChange={handleChange}
                          min={getMinDateTime()}
                          required
                        />
                        <div className="form-text">
                          Select the date and time when you need the item
                        </div>
                      </div>
                    </>
                  ) : (
                    // Guidance Request Form
                    <>
                      <div className="mb-3">
                        <label htmlFor="topic" className="form-label">
                          Topic *
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="topic"
                          name="topic"
                          value={formData.topic}
                          onChange={handleChange}
                          placeholder="e.g., Mathematics, Programming, Guitar Lessons"
                          required
                          maxLength="100"
                        />
                      </div>

                      <div className="mb-3">
                        <label htmlFor="timeNeeded" className="form-label">
                          <Clock size={16} className="me-1" />
                          Time Needed *
                        </label>
                        <select
                          className="form-select"
                          id="timeNeeded"
                          name="timeNeeded"
                          value={formData.timeNeeded}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Select duration</option>
                          <option value="30 minutes">30 minutes</option>
                          <option value="1 hour">1 hour</option>
                          <option value="1.5 hours">1.5 hours</option>
                          <option value="2 hours">2 hours</option>
                          <option value="2+ hours">2+ hours</option>
                          <option value="Multiple sessions">Multiple sessions</option>
                        </select>
                      </div>
                    </>
                  )}

                  {/* Common Description Field */}
                  <div className="mb-4">
                    <label htmlFor="description" className="form-label">
                      Description (optional)
                    </label>
                    <textarea
                      className="form-control"
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows="3"
                      placeholder={
                        requestType === 'item'
                          ? "Additional details about the item, condition preferences, etc."
                          : "Specific areas you need help with, your current level, etc."
                      }
                      maxLength="500"
                    />
                    <div className="form-text">
                      {500 - formData.description.length} characters remaining
                    </div>
                  </div>

                  <div className="d-flex gap-2">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => navigate('/main')}
                      disabled={loading}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={loading}
                    >
                      {loading ? (
                        <span>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Creating...
                        </span>
                      ) : (
                        'Create Request'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddRequestPage;