import React, { useState } from 'react';

interface PostcodeSearchProps {
  onSearch: (postcode: string) => void;
  isLoading: boolean;
}

const PostcodeSearch: React.FC<PostcodeSearchProps> = ({ onSearch, isLoading }) => {
  const [postcode, setPostcode] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (postcode.trim()) {
      onSearch(postcode.trim().toUpperCase());
    }
  };

  const validatePostcode = (input: string) => {
    const ukPostcodeRegex = /^[A-Z]{1,2}[0-9]{1,2}[A-Z]?\s?[0-9][A-Z]{2}$/i;
    return ukPostcodeRegex.test(input.replace(/\s/g, ''));
  };

  return (
    <div className="postcode-search">
      <form onSubmit={handleSubmit} className="search-form">
        <div className="search-input-group">
          <input
            type="text"
            value={postcode}
            onChange={(e) => setPostcode(e.target.value)}
            placeholder="Enter your postcode (e.g. SW1A 1AA)"
            className="postcode-input"
            maxLength={8}
            disabled={isLoading}
          />
          <button
            type="submit"
            className="search-button"
            disabled={isLoading || !validatePostcode(postcode)}
          >
            {isLoading ? 'Searching...' : 'Find Assessors'}
          </button>
        </div>
      </form>

      <div className="search-info">
        <p>We'll show you up to 4 certified EPC assessors in your area</p>
      </div>
    </div>
  );
};

export default PostcodeSearch;