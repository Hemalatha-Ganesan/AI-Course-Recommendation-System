const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendEnrollmentEmail = async (userEmail, userName, course) => {
  await transporter.sendMail({
    from: '"CourseAI" <noreply@courseai.com>',
    to: userEmail,
    subject: `Welcome to "${course.title}"! 🎉`,
    html: `
      <div style="font-family: Arial; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #6366f1;">Welcome <strong>${userName}</strong>!</h2>
        <p>You enrolled in:</p>
        <div style="background: #f8fafc; padding: 20px; border-left: 4px solid #6366f1; border-radius: 8px;">
          <h3 style="margin: 0 0 10px 0;">${course.title}</h3>
          <p><strong>Instructor:</strong> ${course.instructor.username}<br>
          <strong>Level:</strong> ${course.level}<br>
          <strong>Duration:</strong> ${course.duration}h</p>
        </div>
        <p><strong>Start learning today!</strong></p>
        <a href="http://localhost:3000/courses/${course._id}" style="background: #6366f1; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">🚀 Begin Course</a>
        <p style="color: #6b7280; margin-top: 30px;">Happy learning!<br>CourseAI Team</p>
      </div>
    `
  });
};

module.exports = { sendEnrollmentEmail };
