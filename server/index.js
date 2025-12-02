require('dotenv').config();
const express = require('express');
const cors = require('cors');
const prisma = require('./config/db');

const datasetRoutes = require('./routes/datasetRoutes');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// MOCK AUTH MIDDLEWARE (TEMPORARY)
// This ensures we have a valid User ID in the DB until we implement real auth
app.use(async (req, res, next) => {

    const mockEmail = "demo@impactify.com";
    let user = await prisma.user.findUnique({ where: { email: mockEmail } });
    
    if (!user) {
        user = await prisma.user.create({
            data: {
                email: mockEmail,
                name: "Demo User",
                role: "ADMIN"
            }
        });
        console.log("Created Mock User:", user.id);
    }
    
    req.user = { id: user.id };
    next();
});

app.use('/api/dataset', datasetRoutes);

app.get('/', (req, res) => {
    res.send('Impactify Backend Running');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});