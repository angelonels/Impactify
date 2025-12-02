require('dotenv').config();
const express = require('express');
const cors = require('cors');
const prisma = require('./config/db');
const passport = require('./config/passport');
const authRoutes = require('./routes/authRoutes');
const datasetRoutes = require('./routes/datasetRoutes');
const authMiddleware = require('./middleware/authMiddleware');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());
app.use(passport.initialize());


app.use('/api/auth', authRoutes);


app.use('/api/dataset', authMiddleware, datasetRoutes);

app.get('/', (req, res) => {
    res.send('Impactify Backend Running');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});