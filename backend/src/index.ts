import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRouter from './app/api/routers/auth.router';
import taskRouter from './app/api/routers/task.router';
import analyticsRouter from './app/api/routers/analytics.router';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const swaggerDocument = YAML.load(path.resolve(process.cwd(), 'swagger.yaml'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Apply layered architecture routers
app.use('/api/auth', authRouter);
app.use('/api/tasks', taskRouter);
app.use('/api/analytics', analyticsRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
