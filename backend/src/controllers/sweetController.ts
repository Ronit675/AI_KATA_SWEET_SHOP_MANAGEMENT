import { Response } from 'express';
import Sweet, { ISweet } from '../models/Sweet';
import { AuthRequest } from '../middleware/auth';
import { validationResult } from 'express-validator';

/**
 * Add a new sweet
 * POST /api/sweets
 */
export const createSweet = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { name, category, price, quantity } = req.body;

    // Check if sweet with same name already exists
    const existingSweet = await Sweet.findOne({ name });
    if (existingSweet) {
      res.status(400).json({ message: 'Sweet with this name already exists' });
      return;
    }

    const sweet = new Sweet({
      name,
      category,
      price,
      quantity: quantity || 0,
    });

    await sweet.save();

    res.status(201).json({
      message: 'Sweet created successfully',
      sweet,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

/**
 * Get all sweets
 * GET /api/sweets
 */
export const getAllSweets = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const sweets = await Sweet.find().sort({ createdAt: -1 });
    res.json({ sweets });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

/**
 * Search sweets by name, category, or price range
 * GET /api/sweets/search
 */
export const searchSweets = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, category, minPrice, maxPrice } = req.query;

    const query: any = {};

    if (name) {
      query.name = { $regex: name as string, $options: 'i' };
    }

    if (category) {
      query.category = { $regex: category as string, $options: 'i' };
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) {
        query.price.$gte = Number(minPrice);
      }
      if (maxPrice) {
        query.price.$lte = Number(maxPrice);
      }
    }

    const sweets = await Sweet.find(query).sort({ createdAt: -1 });

    res.json({ sweets });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

/**
 * Update a sweet
 * PUT /api/sweets/:id
 */
export const updateSweet = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { id } = req.params;
    const { name, category, price, quantity } = req.body;

    const sweet = await Sweet.findById(id);
    if (!sweet) {
      res.status(404).json({ message: 'Sweet not found' });
      return;
    }

    // Check if name is being changed and if it conflicts with existing sweet
    if (name && name !== sweet.name) {
      const existingSweet = await Sweet.findOne({ name });
      if (existingSweet) {
        res.status(400).json({ message: 'Sweet with this name already exists' });
        return;
      }
    }

    if (name) sweet.name = name;
    if (category) sweet.category = category;
    if (price !== undefined) sweet.price = price;
    if (quantity !== undefined) sweet.quantity = quantity;

    await sweet.save();

    res.json({
      message: 'Sweet updated successfully',
      sweet,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

/**
 * Delete a sweet
 * DELETE /api/sweets/:id
 */
export const deleteSweet = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const sweet = await Sweet.findByIdAndDelete(id);
    if (!sweet) {
      res.status(404).json({ message: 'Sweet not found' });
      return;
    }

    res.json({ message: 'Sweet deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

/**
 * Purchase a sweet (decrease quantity)
 * POST /api/sweets/:id/purchase
 */
export const purchaseSweet = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { quantity: purchaseQuantity = 1 } = req.body;

    const sweet = await Sweet.findById(id);
    if (!sweet) {
      res.status(404).json({ message: 'Sweet not found' });
      return;
    }

    if (sweet.quantity < purchaseQuantity) {
      res.status(400).json({
        message: `Insufficient stock. Available: ${sweet.quantity}, Requested: ${purchaseQuantity}`,
      });
      return;
    }

    sweet.quantity -= purchaseQuantity;
    await sweet.save();

    res.json({
      message: 'Purchase successful',
      sweet,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

/**
 * Restock a sweet (increase quantity) - Admin only
 * POST /api/sweets/:id/restock
 */
export const restockSweet = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { id } = req.params;
    const { quantity: restockQuantity } = req.body;

    const sweet = await Sweet.findById(id);
    if (!sweet) {
      res.status(404).json({ message: 'Sweet not found' });
      return;
    }

    sweet.quantity += restockQuantity;
    await sweet.save();

    res.json({
      message: 'Restock successful',
      sweet,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

