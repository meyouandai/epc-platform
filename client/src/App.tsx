import React, { useState } from 'react';
import './App.css';
import PostcodeSearch from './components/PostcodeSearch';
import AssessorList from './components/AssessorList';
import AssessorApp from './components/assessor/AssessorApp';
import AdminApp from './components/admin/AdminApp';

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

type ViewMode = 'customer' | 'assessor' | 'admin';

function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('customer');
  const [assessors, setAssessors] = useState<Assessor[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchedPostcode, setSearchedPostcode] = useState('');

  const handlePostcodeSearch = async (postcode: string) => {
    setIsLoading(true);
    setSearchedPostcode(postcode);

    try {
      const response = await fetch(`/api/assessors/search?postcode=${postcode}`);
      const data = await response.json();
      setAssessors(data.assessors || []);
    } catch (error) {
      console.error('Error searching assessors:', error);
      setAssessors([]);
    } finally {
      setIsLoading(false);
    }
  };

  if (viewMode === 'assessor') {
    return (
      <div className="App">
        <AssessorApp />
      </div>
    );
  }

  if (viewMode === 'admin') {
    return (
      <div className="App">
        <AdminApp />
      </div>
    );
  }

  return (
    <div className="App">
      <nav className="app-nav">
        <div className="nav-buttons">
          <button
            onClick={() => setViewMode('admin')}
            className="nav-button admin-login"
          >
            Admin Panel
          </button>
          <button
            onClick={() => setViewMode('assessor')}
            className="nav-button assessor-login"
          >
            Assessor Login
          </button>
        </div>
      </nav>

      <header className="app-header">
        <h1>Find EPC Assessors Near You</h1>
        <p>Get quotes from certified Energy Performance Certificate assessors in your area</p>
      </header>

      <main className="main-content">
        <PostcodeSearch onSearch={handlePostcodeSearch} isLoading={isLoading} />

        {searchedPostcode && (
          <div className="results-section">
            <h2>EPC Assessors near {searchedPostcode}</h2>
            <AssessorList assessors={assessors} isLoading={isLoading} />
          </div>
        )}
      </main>

      <footer className="app-footer">
        <div className="footer-content">
          <p>Are you an EPC assessor?
            <button
              onClick={() => setViewMode('assessor')}
              className="footer-link"
            >
              Join our platform
            </button>
            and start receiving qualified leads for just £5 each.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
