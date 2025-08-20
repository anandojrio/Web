import express from 'express';

// 1. Import the router
import dummyRoutes from './routes/dummy.routes';

const app = express();
const PORT = 5000;

// 2. Mount the router at the url /api/dummy
app.use('/api/dummy', dummyRoutes);

// Optional: sanity check root
app.get('/', (req, res) => {
  res.json({ message: 'Root is working.' });
});

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
