import React, { useState } from 'react';
import { Star } from 'lucide-react';

/**
 * Rating Modal Component
 * Allows providers to rate requestors after completion
 */
const RatingModal = ({ show, onClose, onSubmit, request }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [hoveredRating, setHoveredRating] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0) {
      alert('Please select a rating');
      return;
    }
    
    onSubmit({
      requestId: request._id,
      rating,
      comment: comment.trim()
    });
    
    // Reset form
    setRating(0);
    setComment('');
  };

  const handleClose = () => {
    setRating(0);
    setComment('');
    onClose();
  };

  if (!show) return null;

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Rate User</h5>
            <button
              type="button"
              className="btn-close"
              onClick={handleClose}
            ></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="text-center mb-4">
                <h6>How was your experience with {request?.requestor?.name}?</h6>
                <p className="text-muted">
                  Request: {request?.type === 'item' ? request?.itemName : request?.topic}
                </p>
              </div>

              <div className="mb-3">
                <label className="form-label">Rating *</label>
                <div className="d-flex justify-content-center mb-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={32}
                      className={`mx-1 cursor-pointer ${
                        star <= (hoveredRating || rating)
                          ? 'text-warning'
                          : 'text-muted'
                      }`}
                      fill={star <= (hoveredRating || rating) ? 'currentColor' : 'none'}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      style={{ cursor: 'pointer' }}
                    />
                  ))}
                </div>
                <div className="text-center">
                  <small className="text-muted">
                    {rating === 0 && 'Select a rating'}
                    {rating === 1 && 'Poor'}
                    {rating === 2 && 'Fair'}
                    {rating === 3 && 'Good'}
                    {rating === 4 && 'Very Good'}
                    {rating === 5 && 'Excellent'}
                  </small>
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="comment" className="form-label">
                  Comment (optional)
                </label>
                <textarea
                  id="comment"
                  className="form-control"
                  rows="3"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your experience..."
                  maxLength="200"
                />
                <div className="form-text">
                  {200 - comment.length} characters remaining
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={rating === 0}
              >
                Submit Rating
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RatingModal;