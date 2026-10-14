const env = {
  port: Number(process.env.PORT || 5000),
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio-cms',
  jwtSecret: process.env.JWT_SECRET,
  adminEmail: process.env.ADMIN_EMAIL,
  frontendOrigin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173',
  keepAliveEnabled: String(process.env.KEEP_ALIVE_ENABLED || 'false').toLowerCase() === 'true',
  resendApiKey: process.env.RESEND_API_KEY,
};

module.exports = env;
