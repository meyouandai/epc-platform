import React from 'react';

interface Assessor {
  id: string;
  name: string;
  company: string;
  rating: number;
  reviewCount: number;
  distance: number;
  price: string;
  phone: string;
  email: string;
}

interface AssessorListProps {
  assessors: Assessor[];
  isLoading: boolean;
}

const AssessorCard: React.FC<{ assessor: Assessor; onContact: (assessor: Assessor) => void }> = ({
  assessor,
  onContact
}) => {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < rating ? 'star filled' : 'star'}>
        ★
      </span>
    ));
  };

  return (
    <div className="assessor-card">
      <div className="assessor-header">
        <h3>{assessor.name}</h3>
        <div className="rating">
          {renderStars(assessor.rating)}
          <span className="review-count">({assessor.reviewCount} reviews)</span>
        </div>
      </div>

      <div className="assessor-details">
        <p className="company">{assessor.company}</p>
        <p className="distance">{assessor.distance} miles away</p>
        <p className="price">From {assessor.price}</p>
      </div>

      <div className="assessor-actions">
        <button
          className="contact-button primary"
          onClick={() => onContact(assessor)}
        >
          Get Quote
        </button>
        <div className="contact-info">
          <span className="phone">{assessor.phone}</span>
        </div>
      </div>
    </div>
  );
};

const AssessorList: React.FC<AssessorListProps> = ({ assessors, isLoading }) => {
  const handleContact = (assessor: Assessor) => {
    // This will trigger a lead creation API call
    fetch('/api/leads', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        assessorId: assessor.id,
        customerAction: 'contact_request'
      }),
    }).catch(console.error);

    // Open contact method (could be modal, direct call, etc.)
    window.open(`tel:${assessor.phone}`);
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Finding EPC assessors in your area...</p>
      </div>
    );
  }

  if (assessors.length === 0) {
    return (
      <div className="no-results">
        <p>No EPC assessors found in your area. Please try a different postcode.</p>
      </div>
    );
  }

  return (
    <div className="assessor-list">
      <div className="results-count">
        <p>Found {assessors.length} EPC assessor{assessors.length !== 1 ? 's' : ''} in your area</p>
      </div>

      <div className="assessor-grid">
        {assessors.map((assessor) => (
          <AssessorCard
            key={assessor.id}
            assessor={assessor}
            onContact={handleContact}
          />
        ))}
      </div>
    </div>
  );
};

export default AssessorList;