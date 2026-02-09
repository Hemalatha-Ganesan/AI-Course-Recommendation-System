import { useState, useEffect, useContext } from 'react';
import { UserContext } from '../contexts/UserContext';
import { userAPI } from '../api/api';

const useUserActivity = (courseId, activityType = 'view') => {
  const { user } = useContext(UserContext);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    if (!user || !courseId) return;

    // Track activity when component mounts
    const trackActivity = async () => {
      try {
        await userAPI.trackActivity({
          courseId,
          activityType,
          timestamp: new Date()
        });
      } catch (error) {
        console.error('Failed to track activity:', error);
      }
    };

    trackActivity();

    // Track time spent when component unmounts
    return () => {
      const timeSpent = Math.floor((Date.now() - startTime) / 1000); // in seconds
      
      if (timeSpent > 5) { // Only track if spent more than 5 seconds
        userAPI.trackActivity({
          courseId,
          activityType: 'time_spent',
          duration: timeSpent,
          timestamp: new Date()
        }).catch(error => {
          console.error('Failed to track time spent:', error);
        });
      }
    };
  }, [user, courseId, activityType, startTime]);

  return null;
};

export default useUserActivity;