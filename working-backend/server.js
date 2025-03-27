const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const bottleRoutes = require("./routes/bottleRoutes");
const recyclingHistoryRoute = require('./routes/recyclingHistory');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

const userRoutes = require('./routes/userRoutes');
app.use('/api', userRoutes);

app.use("/api", bottleRoutes);
app.use('/api', recyclingHistoryRoute); 

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
