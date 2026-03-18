import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { contentAPI, courseAPI } from '../api/api';
import { FaPlay, FaCheckCircle, FaLock, FaClock, FaBook, FaLink, FaArrowLeft, FaArrowRight } from 'react-icons/fa';

const CourseContent = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState(null);
  const [content, setContent] = useState(null);
  const [progress, setProgress] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [videoProgress, setVideoProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [updatingProgress, setUpdatingProgress] = useState(false);

  useEffect(() => {
    fetchCourseContent();
  }, [courseId]);

  const fetchCourseContent = async () => {
    try {
      setLoading(true);
      
      // Fetch course details
      const courseRes = await courseAPI.getCourseById(courseId);
      setCourse(courseRes.data.data);
      
      // Fetch course content (lessons)
      const contentRes = await contentAPI.getCourseContent(courseId);
      setContent(contentRes.data.data.content);
      setProgress(contentRes.data.data.progress);
      
      // Set current lesson from progress
      if (contentRes.data.data.progress.currentLesson) {
        const { sectionIndex, lessonIndex } = contentRes.data.data.progress.currentLesson;
        setCurrentSectionIndex(sectionIndex);
        setCurrentLessonIndex(lessonIndex);
      }
    } catch (error) {
      console.error('Error fetching course content:', error);
      // If not enrolled, redirect to course details
      if (error.response?.status === 403) {
        navigate(`/courses/${courseId}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch current lesson when section/lesson changes
  useEffect(() => {
    if (content && content.sections[currentSectionIndex]) {
      const lesson = content.sections[currentSectionIndex].lessons[currentLessonIndex];
      setCurrentLesson(lesson);
    }
  }, [content, currentSectionIndex, currentLessonIndex]);

  const handleVideoProgress = (e) => {
    const duration = e.target.duration;
    const currentTime = e.target.currentTime;
    const progressPercent = (currentTime / duration) * 100;
    setVideoProgress(progressPercent);
  };

  const handleVideoEnded = async () => {
    setIsPlaying(false);
    // Mark lesson as completed
    await updateProgress(true);
  };

  const updateProgress = async (completed = false, watchedDurationOverride = null) => {
    setUpdatingProgress(true);
    try {
      // Use override or calculate from video progress (assume full for manual complete)
      const watchedSeconds = watchedDurationOverride !== null 
        ? watchedDurationOverride 
        : Math.max((videoProgress / 100) * (currentLesson?.videoDuration * 60 || 0), currentLesson?.videoDuration * 30 || 1800); // Min 30min
      
      await contentAPI.updateLessonProgress(
        courseId,
        currentSectionIndex,
        currentLessonIndex,
        {
          watchedDuration: Math.floor(watchedSeconds),
          completed
        }
      );
      
      // Refresh full progress to sync syllabus + overall %
      const progressRes = await contentAPI.getCourseContent(courseId);
      setProgress(progressRes.data.data.progress);
    } catch (error) {
      console.error('Error updating progress:', error);
      alert('Failed to update progress. Please try again.');
    } finally {
      setUpdatingProgress(false);
    }
  };

  const goToLesson = (sectionIndex, lessonIndex) => {
    setCurrentSectionIndex(sectionIndex);
    setCurrentLessonIndex(lessonIndex);
    setVideoProgress(0);
  };

  const goToNextLesson = () => {
    if (!content) return;
    
    const sections = content.sections;
    if (currentLessonIndex < sections[currentSectionIndex].lessons.length - 1) {
      // Next lesson in same section
      goToLesson(currentSectionIndex, currentLessonIndex + 1);
    } else if (currentSectionIndex < sections.length - 1) {
      // First lesson of next section
      goToLesson(currentSectionIndex + 1, 0);
    }
  };

  const goToPrevLesson = () => {
    if (!content) return;
    
    if (currentLessonIndex > 0) {
      // Previous lesson in same section
      goToLesson(currentSectionIndex, currentLessonIndex - 1);
    } else if (currentSectionIndex > 0) {
      // Last lesson of previous section
      const prevSectionIndex = currentSectionIndex - 1;
      const prevSectionLessons = content.sections[prevSectionIndex].lessons.length;
      goToLesson(prevSectionIndex, prevSectionLessons - 1);
    }
  };

  const isLessonCompleted = (sectionIndex, lessonIndex) => {
    if (!progress) return false;
    const lessonId = `${sectionIndex}-${lessonIndex}`;
    const lessonProgress = progress.lessonProgress.find(p => p.lessonId === lessonId);
    return lessonProgress?.completed || false;
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const isYouTubeVideo = (url) => {
    return url && (url.includes('youtube.com/embed') || url.includes('youtu.be'));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading course content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <Link to={`/courses/${courseId}`} className="text-purple-600 hover:underline flex items-center gap-2">
                <FaArrowLeft /> Back to Course
              </Link>
              <h1 className="text-xl font-bold mt-1">{course?.title}</h1>
            </div>
            
            {/* Progress Bar */}
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">
                <span className="font-semibold">{progress?.overallProgress || 0}%</span> Complete
              </div>
              <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-purple-600 transition-all duration-300"
                  style={{ width: `${progress?.overallProgress || 0}%` }}
                ></div>
              </div>
              <div className="text-sm text-gray-500 flex items-center gap-1">
                <FaClock /> {Math.floor((progress?.totalTimeSpent || 0) / 60)} min
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Video Player Section */}
          <div className="lg:col-span-2">
            {/* Video Player */}
            <div className="bg-black rounded-lg overflow-hidden aspect-video relative">
{currentLesson?.videoUrl ? (
                isYouTubeVideo(currentLesson.videoUrl) ? (
                  <iframe
                    key={`${currentSectionIndex}-${currentLessonIndex}`}
                    src={`${currentLesson.videoUrl}?autoplay=0&controls=1&rel=0&modestbranding=1`}
                    title={currentLesson.title}
                    className="w-full h-full"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                ) : (
                  <>
                    <video
                      key={`${currentSectionIndex}-${currentLessonIndex}`}
                      src={currentLesson.videoUrl}
                      className="w-full h-full"
                      controls
                      onTimeUpdate={handleVideoProgress}
                      onEnded={handleVideoEnded}
                      onPlay={() => setIsPlaying(true)}
                      onPause={() => setIsPlaying(false)}
                    >
                      Your browser does not support video playback.
                    </video>
                    
                    {/* Progress overlay */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700">
                      <div 
                        className="h-full bg-purple-500"
                        style={{ width: `${videoProgress}%` }}
                      ></div>
                    </div>
                  </>
                )
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-800 text-white">
                  <div className="text-center">
                    <FaPlay className="text-4xl mx-auto mb-2 opacity-50" />
                    <p>No video available for this lesson</p>
                  </div>
                </div>
              )}
            </div>

            {/* Lesson Info */}
            <div className="bg-white rounded-lg shadow mt-4 p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold">{currentLesson?.title}</h2>
                  <p className="text-gray-600 mt-2">{currentLesson?.description}</p>
                </div>
                
                <button
                  onClick={async () => {
                    const currentlyCompleted = isLessonCompleted(currentSectionIndex, currentLessonIndex);
                    await updateProgress(!currentlyCompleted);
                  }}
                  disabled={updatingProgress}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
                    isLessonCompleted(currentSectionIndex, currentLessonIndex)
                      ? 'bg-green-100 text-green-700 hover:bg-green-200'
                      : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                  } ${updatingProgress ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {updatingProgress ? (
                    <>Updating...</>
                  ) : isLessonCompleted(currentSectionIndex, currentLessonIndex) ? (
                    <> <FaCheckCircle /> Completed </>
                  ) : (
                    'Mark Complete'
                  )}
                </button>
              </div>

              {/* Navigation */}
              <div className="flex justify-between mt-6 pt-4 border-t">
                <button
                  onClick={goToPrevLesson}
                  disabled={currentSectionIndex === 0 && currentLessonIndex === 0}
                  className="px-4 py-2 bg-gray-100 rounded-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaArrowLeft /> Previous
                </button>
                <button
                  onClick={goToNextLesson}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg flex items-center gap-2 hover:bg-purple-700"
                >
                  Next <FaArrowRight />
                </button>
              </div>
            </div>

            {/* Learning Materials */}
            {currentLesson && (currentLesson.content || currentLesson.materials?.length > 0 || currentLesson.referenceLinks?.length > 0) && (
              <div className="bg-white rounded-lg shadow mt-4 p-6">
                <h3 className="text-lg font-semibold mb-4">Learning Materials</h3>
                
                {/* Text Content */}
                {currentLesson.content && (
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <FaBook /> Lesson Notes
                    </h4>
                    <div className="prose max-w-none text-gray-600 whitespace-pre-wrap">
                      {currentLesson.content}
                    </div>
                  </div>
                )}

                {/* Materials */}
                {currentLesson.materials?.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-700 mb-2">Attachments</h4>
                    <div className="space-y-2">
                      {currentLesson.materials.map((material, idx) => (
                        <a
                          key={idx}
                          href={material.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 p-2 bg-gray-50 rounded hover:bg-gray-100"
                        >
                          <FaBook className="text-purple-600" />
                          <span>{material.title}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Reference Links */}
                {currentLesson.referenceLinks?.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Reference Links</h4>
                    <div className="space-y-2">
                      {currentLesson.referenceLinks.map((link, idx) => (
                        <a
                          key={idx}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 p-2 bg-gray-50 rounded hover:bg-gray-100"
                        >
                          <FaLink className="text-blue-600" />
                          <span>{link.title}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Course Syllabus */}
          <div className="bg-white rounded-lg shadow h-fit">
            <div className="p-4 border-b">
              <h3 className="font-semibold">Course Content</h3>
              <p className="text-sm text-gray-500">
                {content?.sections?.length || 0} sections • 
                {content?.sections?.reduce((acc, s) => acc + s.lessons.length, 0) || 0} lessons
              </p>
            </div>
            
            <div className="max-h-[600px] overflow-y-auto">
              {content?.sections?.map((section, sectionIdx) => (
                <div key={sectionIdx} className="border-b">
                  <div className="p-3 bg-gray-50">
                    <h4 className="font-medium text-sm">{section.title}</h4>
                    <p className="text-xs text-gray-500">{section.lessons.length} lessons</p>
                  </div>
                  
                  <div>
                    {section.lessons.map((lesson, lessonIdx) => {
                      const completed = isLessonCompleted(sectionIdx, lessonIdx);
                      const isCurrent = sectionIdx === currentSectionIndex && lessonIdx === currentLessonIndex;
                      
                      return (
                        <button
                          key={lessonIdx}
                          onClick={() => goToLesson(sectionIdx, lessonIdx)}
                          className={`w-full p-3 flex items-center gap-3 text-left hover:bg-gray-50 ${
                            isCurrent ? 'bg-purple-50 border-l-4 border-purple-600' : ''
                          }`}
                        >
                          {completed ? (
                            <FaCheckCircle className="text-green-500" />
                          ) : isCurrent ? (
                            <FaPlay className="text-purple-600" />
                          ) : (
                            <div className="w-5 h-5 rounded-full border-2 border-gray-300"></div>
                          )}
                          
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm truncate ${isCurrent ? 'font-medium text-purple-600' : ''}`}>
                              {lesson.title}
                            </p>
                            <p className="text-xs text-gray-500 flex items-center gap-1">
                              <FaClock /> {lesson.videoDuration || 0} min
                            </p>
                          </div>
                          
                          {lesson.isFree && (
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">Free</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseContent;

