// src/hooks/useUserActivity.js
import { useContext, useCallback } from 'react';
import { UserContext } from '../contexts/UserContext';
import API from '../api/api';

const useUserActivity = () => {
  const { user } = useContext(UserContext);

  const trackActivity = useCallback(async (activityType, courseId = null, metadata = {}) => {
    if (!user) return;

    try {
      await API.post('/user-activity', {
        activityType,
        courseId,
        metadata
      });
    } catch (error) {
      console.error('Error tracking activity:', error);
    }
  }, [user]);

  const trackCourseView = useCallback((courseId) => {
    trackActivity('view', courseId);
  }, [trackActivity]);

  const trackEnrollment = useCallback((courseId) => {
    trackActivity('enroll', courseId);
  }, [trackActivity]);

  const trackRating = useCallback((courseId, rating) => {
    trackActivity('rate', courseId, { rating });
  }, [trackActivity]);

  const trackSearch = useCallback((searchTerm) => {
    trackActivity('search', null, { searchTerm });
  }, [trackActivity]);

  const trackFilter = useCallback((filters) => {
    trackActivity('filter', null, { filters });
  }, [trackActivity]);

  return {
    trackActivity,
    trackCourseView,
    trackEnrollment,
    trackRating,
    trackSearch,
    trackFilter
  };
};

export default useUserActivity;