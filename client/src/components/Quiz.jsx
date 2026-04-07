import React, { useState, useEffect } from 'react';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import Loader from '../components/Loader.jsx';
import { quizzesAPI } from '../api/api';

const Quiz = ({ courseId, lessonId, onComplete }) => {
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    fetchQuiz();
  }, [courseId, lessonId]);

  const fetchQuiz = async () => {
    try {
      setLoading(true);
      const response = await quizzesAPI.getQuiz(courseId, lessonId);
      setQuiz(response.data.data);
      // Set time left if timeLimit
      if (response.data.data.timeLimit) {
        setTimeLeft(response.data.data.timeLimit * 60);
      }
    } catch (error) {
      console.error('No quiz available');
      onComplete?.(); // No quiz, complete lesson
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && Object.keys(answers).length === quiz?.questions.length) {
      handleSubmit();
    }
  }, [timeLeft, answers, quiz]);

  const handleAnswerChange = (qIndex, optionIdx) => {
    setAnswers(prev => ({
      ...prev,
      [qIndex]: optionIdx
    }));
  };

  const handleSubmit = async () => {
    if (submitting || Object.keys(answers).length !== quiz.questions.length) return;

    setSubmitting(true);
    try {
      const response = await quizzesAPI.submitQuiz(courseId, lessonId, {
        answers: Object.entries(answers).map(([qIdxStr, selected]) => ({
          questionIndex: parseInt(qIdxStr),
          selectedOption: selected
        })),
        timeTaken: 300 - timeLeft // approx
      });
      setResult(response.data.data);
      if (response.data.data.passed) {
        onComplete(true, response.data.data.score);
      }
    } catch (error) {
      console.error('Submit failed', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader />;

  if (!quiz) return null;

  const allAnswered = Object.keys(answers).length === quiz.questions.length;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold">{quiz.title}</h3>
        {timeLeft > 0 && (
          <div className="text-lg font-mono bg-red-100 px-3 py-1 rounded-full">
            {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
          </div>
        )}
      </div>

      <div className="space-y-4 mb-6">
        {quiz.questions.map((q, qIndex) => (
          <div key={qIndex} className="border p-4 rounded-lg">
            <p className="font-medium mb-4">{q.question}</p>
            <div className="space-y-2">
              {q.options.map((option, optIdx) => (
                <label key={optIdx} className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name={`q${qIndex}`}
                    value={optIdx}
                    checked={answers[qIndex] === optIdx}
                    onChange={() => handleAnswerChange(qIndex, optIdx)}
                    className="mr-3 w-4 h-4 text-purple-600"
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        disabled={!allAnswered || submitting}
        className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {submitting ? (
          <>
            <Loader className="animate-spin" />
            Submitting...
          </>
        ) : allAnswered ? (
          'Submit Quiz'
        ) : (
          `Answer all ${quiz.questions.length} questions`
        )}
      </button>

      {result && (
        <div className={`mt-6 p-4 rounded-lg bg-${result.passed ? 'green' : 'red'}-50 border-${result.passed ? 'green' : 'red'}-200`}>
          <div className="flex items-center gap-2 mb-4">
            {result.passed ? <FaCheckCircle className="text-green-500" /> : <FaTimesCircle className="text-red-500" />}
            <h4 className="font-bold">{result.passed ? 'Passed!' : 'Review & Retry'}</h4>
          </div>
          <p className="text-lg mb-2">Score: {result.score}%</p>
          <ul className="space-y-1 text-sm">
            {result.feedback.map((fb, i) => (
              <li key={i}>
                Q{i+1}: {fb.isCorrect ? '✅ Correct' : '❌ ' + fb.explanation}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Quiz;

