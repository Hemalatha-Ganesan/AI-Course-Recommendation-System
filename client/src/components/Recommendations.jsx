import React, { useState, useEffect, useContext } from 'react';
import { recommendationAPI } from '../api/api';
import { UserContext } from '../contexts/UserContext';
import CourseCard from './CourseCard';
import Loader from './Loader';


const Recommendations = () => {
  const { user } = useContext(UserContext);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const response = await recommendationAPI.getPersonalizedRecommendations();
        setRecommendations(response.data.recommendations || []);
      } catch (err) {
        console.error('Failed to fetch recommendations:', err);
        setError('Failed to load recommendations. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [user]);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="recommendations-error">
        <p>{error}</p>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <div className="recommendations-empty">
        <h3>No recommendations yet</h3>
        <p>Start exploring courses to get personalized recommendations!</p>
      </div>
    );
  }

  return (
    <div className="recommendations-container">
      <h2 className="recommendations-title">Recommended For You</h2>
      <div className="recommendations-grid">
        {recommendations.map((course) => (
          <CourseCard key={course._id} course={course} />
        ))}
      </div>
    </div>
  );
};

export default Recommendations;