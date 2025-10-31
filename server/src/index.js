const express = require('express');
const cors = require('cors');
const { loadEnv } = require('./config/env');
const { logger } = require('./config/logger');

loadEnv();

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/datasets', require('./routes/dataset.routes'));
app.use('/api/ai', require('./routes/ai.routes'));
app.use('/api/admin', require('./routes/admin.routes'));

const port = process.env.PORT || 4000;
app.listen(port, () => logger.info(`Server running on :${port}`));


