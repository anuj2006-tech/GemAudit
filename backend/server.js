import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

// Import Routes
import authRoutes from './src/routes/authRoutes.js';
import tenderRoutes from './src/routes/tenderRoutes.js';
import documentRoutes from './src/routes/documentRoutes.js';
import aiRoutes from './src/routes/aiRoutes.js';
import organizationRoutes from './src/routes/organizationRoutes.js';
import billingRoutes from './src/routes/billingRoutes.js';
import platformRoutes from './src/routes/platformRoutes.js';
import tenderRegRoutes from './src/routes/tenderRegRoutes.js';
import companyBrainRoutes from './src/routes/companyBrainRoutes.js';
import gemVerificationRoutes from './src/routes/gemVerificationRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// 1. Security Middlewares
app.use(helmet()); // Secure HTTP headers (XSS, Clickjacking, MIME sniffing protection)
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-tenant-id']
}));

app.use(express.json({ limit: '10mb' })); // Body parser with size limits to prevent payload spikes
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 2. Rate Limiting (Defends against API abuse)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // limit each IP to 200 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: { error: 'Too many requests from this IP. Please try again after 15 minutes.' }
});
app.use('/api/', apiLimiter);

// 3. Mount Modular Routes
app.use('/api/auth', authRoutes);
app.use('/api/tenders', tenderRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/org', organizationRoutes);
app.use('/api/billing', billingRoutes);
app.use('/api/platform', platformRoutes);
app.use('/api/tender-reg', tenderRegRoutes);
app.use('/api/company-brain', companyBrainRoutes);
app.use('/api/gem-verification', gemVerificationRoutes);

// Health Check Endpoint
app.get('/health', (req, res) => {
  return res.json({ status: 'healthy', timestamp: new Date() });
});

// 4. Centralized 404 Route handler
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.url} not found.` });
});

// 5. Centralized Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  
  const statusCode = err.status || 500;
  const message = err.message || 'Internal server error occurred.';
  
  return res.status(statusCode).json({
    error: message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

app.listen(PORT, () => {
  console.log(`[SaaS Server] Running on http://localhost:${PORT}`);
  console.log(`[Security Settings] Rate Limiting and Helmet active.`);
});
