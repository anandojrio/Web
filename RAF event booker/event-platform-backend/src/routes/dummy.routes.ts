import { Router } from 'express';

const router = Router();

// Handles GET /api/dummy
router.get('/', (req, res) => {
  res.json({ message: 'Dummy route working!' });
});

// Export as default (this is crucial)
export default router;
