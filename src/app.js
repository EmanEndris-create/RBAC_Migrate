require ('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const cors = require('cors');
const cookieParser = require('cookie-parser');
const{ runMigration } = require('./migrate');

const authRoutes = require('./routes/authUser.routes');
const protectedRoutes = require('./routes/protected.routes');




app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use('/api/auth', authRoutes);
app.use('/api/protected', protectedRoutes);

app.listen(port, async () => {
  console.log(`Server is running on port ${port}`);

  await runMigration();
});
