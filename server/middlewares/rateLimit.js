import rateLimit from 'express-rate-limit';

export const chatLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 requests per minute
  message: 'Too many chat requests, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req, res) => {
    // Don't count successful requests towards limit
    return res.statusCode < 400;
  }
});

// More aggressive limiter for API calls to prevent 429
export const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute  
  max: 5, // 5 requests per minute (very strict)
  message: 'Too many requests. Please wait before sending another message.',
  standardHeaders: true,
  legacyHeaders: false,
  // Custom key generator to limit per user
  keyGenerator: (req, res) => {
    return req.user?._id || req.ip;
  },
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Rate limit exceeded. Please wait 1 minute before trying again.'
    });
  }
});