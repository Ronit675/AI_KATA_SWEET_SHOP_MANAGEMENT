import { Router } from 'express';
import { body } from 'express-validator';
import { authenticate, isAdmin } from '../middleware/auth';
import {
  createSweet,
  getAllSweets,
  searchSweets,
  updateSweet,
  deleteSweet,
  purchaseSweet,
  restockSweet,
} from '../controllers/sweetController';

const router = Router();

/**
 * Validation rules for creating/updating sweets
 */
const sweetValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('quantity')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Quantity must be a non-negative integer'),
];

/**
 * Validation for restock
 */
const restockValidation = [
  body('quantity')
    .isInt({ min: 1 })
    .withMessage('Restock quantity must be a positive integer'),
];

// All routes require authentication
router.use(authenticate);

// Public sweet routes (authenticated users)
router.get('/', getAllSweets);
router.get('/search', searchSweets);
router.post('/:id/purchase', purchaseSweet);

// Admin-only routes
router.post('/', isAdmin, sweetValidation, createSweet);
router.put('/:id', isAdmin, sweetValidation, updateSweet);
router.delete('/:id', isAdmin, deleteSweet);
router.post('/:id/restock', isAdmin, restockValidation, restockSweet);

export default router;

