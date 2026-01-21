import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import onboardingRoutes from './routes/onboarding.routes';

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/onboarding', onboardingRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

export default app;
