import express, { Request, Response } from 'express';
import taskRoutes from './routes/taskRoutes';
import userRoutes from './routes/userRoutes';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
dotenv.config();

const app = express();
app.use(express.json());
app.use(morgan('dev')); // Logging middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*', // Allow all origins by default
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
}))

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

app.get('/helloworld', (req: Request, res: Response) => {
  res.send('Hello World!');
});

app.use('/api/tasks', taskRoutes);

app.use('/api/account', userRoutes);
const PORT = process.env.PORT;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

app.use((err: any, req: Request, res: Response, next: any) => {
  console.error(err.stack);

  const statusCode = err.status || 500;

  res.status(statusCode).json({
    message: err.message || 'Internal Server Error',
  });
  
});

export default app;


