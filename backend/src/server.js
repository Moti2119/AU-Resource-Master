import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import net from 'net';
import { connectDatabase } from './config/database.js';
import authRoutes from './routes/auth.js';
import resourceRoutes from './routes/resources.js';
import maintenanceRoutes from './routes/maintenance.js';
import dashboardRoutes from './routes/dashboard.js';
import userRoutes from './routes/users.js';

dotenv.config();

const app = express();
// Use port from env or try 8000, 8001, 8002, etc. if port is in use
const DEFAULT_PORT = parseInt(process.env.PORT) || 8000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL 
    ? [process.env.FRONTEND_URL, 'http://localhost:3000']
    : '*',
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/users', userRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'ResourceMaster API is running' });
});

// Function to find available port
const findAvailablePort = (startPort, maxAttempts = 10) => {
  return new Promise((resolve, reject) => {
    let currentPort = startPort;
    let attempts = 0;

    const tryPort = (port) => {
      const server = net.createServer();
      
      server.listen(port, () => {
        server.once('close', () => {
          resolve(port);
        });
        server.close();
      });

      server.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
          attempts++;
          if (attempts >= maxAttempts) {
            reject(new Error(`Could not find available port after ${maxAttempts} attempts`));
          } else {
            currentPort++;
            tryPort(currentPort);
          }
        } else {
          reject(err);
        }
      });
    };

    tryPort(currentPort);
  });
};

// Connect to database and start server
connectDatabase()
  .then(async () => {
    try {
      const port = await findAvailablePort(DEFAULT_PORT);
      
      const server = app.listen(port, () => {
        console.log(`✅ Server running on http://localhost:${port}`);
        if (port !== DEFAULT_PORT) {
          console.log(`   (Port ${DEFAULT_PORT} was in use, using ${port} instead)`);
        }
      });

      server.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
          console.error(`\n❌ Port ${port} is already in use!`);
          console.log(`\nTry one of these solutions:`);
          console.log(`1. Kill the process using port ${port}:`);
          console.log(`   netstat -ano | findstr :${port}`);
          console.log(`   taskkill /PID <PID> /F`);
          console.log(`\n2. Use a different port by setting PORT in .env file`);
          process.exit(1);
        } else {
          console.error('Server error:', err);
          process.exit(1);
        }
      });
    } catch (error) {
      console.error('Failed to find available port:', error);
      process.exit(1);
    }
  })
  .catch(err => {
    console.error('Failed to start server:', err);
    process.exit(1);
  });
