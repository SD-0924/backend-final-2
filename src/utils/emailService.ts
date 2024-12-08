import nodemailer from 'nodemailer';

// Create reusable transporter object using Gmail SMTP and the App Password
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,  
    pass: process.env.EMAIL_PASS  
  }
});

export const sendPasswordChangeEmail = async (to: string, userName: string) => {
  const mailOptions = {
    from: `"E-Commerce System" <${process.env.EMAIL_USER}>`,
    to: to,
    subject: 'Your Password Has Been Changed',
    text: `Hello ${userName},\n\nThis is a notification that your password has been successfully changed.\n\nIf you did not request this change, please contact support immediately.\n\nBest regards,\nE-Commerce System`
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Password change notification email sent to ${to}`);
  } catch (error) {
    console.error(`Error sending email: ${error}`);
  }
};
