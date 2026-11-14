import { Router } from 'express';
import { generateMaterial } from '../controllers/studyController.js';

const router = Router();

// POST /api/generate-study-material
router.post('/generate-study-material', generateMaterial);

export default router;
