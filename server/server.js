import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import rateLimit from 'express-rate-limit';
import studyRoutes from './routes/studyRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientDistPath = path.join(__dirname, '../client/dist');

// Load environment variables (supports root and server directory)
dotenv.config();
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// Dynamic CORS configuration (supports local dev and deployed frontend URLs like Vercel)
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, or same-origin deployment)
    if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV === 'production' || !process.env.CLIENT_URL) {
      return callback(null, true);
    }
    callback(null, true); // Fallback allow to avoid unexpected deployment blocks
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '1mb' }));

// Rate limiter: 100 requests per 15 minutes window
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many requests from this IP. Please try again after 15 minutes.'
  }
});
app.use('/api/', limiter);

// Request Logger
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'Recallify AI Study Assistant Backend',
    hasApiKey: Boolean(process.env.GROQ_API_KEY || process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString()
  });
});

// Mount study API routes
app.use('/api', studyRoutes);

// Serve static frontend files if client is built
app.use(express.static(clientDistPath));

// For SPA routing, any non-API route returns index.html
app.get('*', (req, res, next) => {
  if (req.url.startsWith('/api')) return next();
  res.sendFile(path.join(clientDistPath, 'index.html'), (err) => {
    if (err) next();
  });
});

// 404 Handler for unhandled API routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Endpoint not found: ${req.method} ${req.url}`
  });
});

// Centralized Error Handler
app.use((err, req, res, next) => {
  console.error('[Server Error]:', err);
  const status = err.status || 500;
  res.status(status).json({
    success: false,
    error: err.message || 'An internal server error occurred.'
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(`🚀 Recallify Server running on port ${PORT}`);
  console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`   AI Key: ${process.env.GROQ_API_KEY ? 'Groq Configured ✅' : process.env.GEMINI_API_KEY ? 'Gemini Configured ✅' : 'Demo Fallback ⚠️'}`);
  console.log(`=========================================`);
});
