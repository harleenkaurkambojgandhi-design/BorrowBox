import React, { useState, useEffect } from 'react';
import { getUserRequests, completeRequest, addRating } from '../services/api';
import Navbar from '../components/Navbar';
import RequestCard from '../components/RequestCard';
import RatingModal from '../components/RatingModal';
import LoadingSpinner from '../components/LoadingSpinner';

/**
 * Requests page - shows user's requests (both made and accepted)
 */
const RequestsPage = () => {
  const [requestedItems, setRequestedItems] = useState([]);
  const [providedItems, setProvidedItems] = useState([]);
  const [activeTab, setActiveTab] = useState('requested');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [ratingModal, setRatingModal] = useState({
    show: false,
    request: null
  });

  useEffect(() => {
    fetchUserRequests();
  }, []);

  const fetchUserRequests = async () => {
    try {
      setLoading(true);
      const response = await getUserRequests();
      if (response.success) {
        setRequestedItems(response.data.requested);
        setProvidedItems(response.data.provided);
      } else {
        setError(response.message);
      }
    } catch (error) {
      console.error('Fetch user requests error:', error);
      setError('Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteRequest = async (requestId) => {
    try {
      const response = await completeRequest(requestId);
      if (response.success) {
        // Update the request in provided items
        setProvidedItems(prevItems =>
          prevItems.map(item =>
            item._id === requestId
              ? { ...item, status: 'completed', completedAt: new Date() }
              : item
          )
        );
        alert('Request marked as completed!');
      } else {
        setError(response.message);
      }
    } catch (error) {
      console.error('Complete request error:', error);
      setError('Failed to complete request');
    }
  };

  const handleRateUser = (request) => {
    setRatingModal({
      show: true,
      request: request
    });
  };

  const handleSubmitRating = async (ratingData) => {
    try {
      const response = await addRating(ratingData);
      if (response.success) {
        // Update the request to indicate it has been rated
        setProvidedItems(prevItems =>
          prevItems.map(item =>
            item._id === ratingData.requestId
              ? { ...item, hasRated: true }
              : item
          )
        );
        setRatingModal({ show: false, request: null });
        alert('Rating submitted successfully!');
      } else {
        setError(response.message);
      }
    } catch (error) {
      console.error('Rating error:', error);
      setError('Failed to submit rating');
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <Navbar />
      
      <div className="container mt-4">
        <h2>My Requests</h2>
        <p className="text-muted">Manage your requests and help others</p>

        {error && (
          <div className="alert alert-danger">
            {error}
          </div>
        )}

        {/* Tabs */}
        <ul className="nav nav-tabs mb-4">
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'requested' ? 'active' : ''}`}
              onClick={() => setActiveTab('requested')}
            >
              My Requests ({requestedItems.length})
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'provided' ? 'active' : ''}`}
              onClick={() => setActiveTab('provided')}
            >
              Helping Others ({providedItems.length})
            </button>
          </li>
        </ul>

        {/* Tab Content */}
        {activeTab === 'requested' ? (
          <div>
            <h5 className="mb-3">Requests I've Made</h5>
            {requestedItems.length === 0 ? (
              <div className="text-center py-5">
                <div className="mb-3">📝</div>
                <h6>No requests yet</h6>
                <p className="text-muted">
                  You haven't made any requests. Create your first request to get started!
                </p>
              </div>
            ) : (
              <div className="row">
                {requestedItems.map((request) => (
                  <div key={request._id} className="col-md-6 col-lg-4 mb-4">
                    <RequestCard request={request} />
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div>
            <h5 className="mb-3">Requests I'm Helping With</h5>
            {providedItems.length === 0 ? (
              <div className="text-center py-5">
                <div className="mb-3">🤝</div>
                <h6>Not helping anyone yet</h6>
                <p className="text-muted">
                  Accept requests from the main page to start helping others!
                </p>
              </div>
            ) : (
              <div className="row">
                {providedItems.map((request) => (
                  <div key={request._id} className="col-md-6 col-lg-4 mb-4">
                    <RequestCard
                      request={request}
                      showCompleteButton={request.status === 'accepted'}
                      onComplete={handleCompleteRequest}
                      showRateButton={request.status === 'completed' && !request.hasRated}
                      onRate={handleRateUser}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Rating Modal */}
      <RatingModal
        show={ratingModal.show}
        onClose={() => setRatingModal({ show: false, request: null })}
        onSubmit={handleSubmitRating}
        request={ratingModal.request}
      />
    </div>
  );
};

export default RequestsPage;