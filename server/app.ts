import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import invitationRoutes from './routes/invitationRoutes';
import wishRoutes from './routes/wishRoutes';

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/invitation', invitationRoutes);
app.use('/api/wishes', wishRoutes);

export default app;
