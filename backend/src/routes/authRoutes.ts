import { Router } from 'express';
import { body } from 'express-validator';
import { register, login } from '../controllers/authController';

const router = Router();

/**
 * Validation rules for registration
 */
const registerValidation = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('role')
    .optional()
    .isIn(['user', 'admin'])
    .withMessage('Role must be either user or admin'),
];

/**
 * Validation rules for login
 */
const loginValidation = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
];

router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);

export default router;

