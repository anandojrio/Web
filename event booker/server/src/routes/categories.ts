import { Router, Request, Response } from 'express';
import { Category } from '../models/Category';
import { Event } from '../models/Event';
import { User } from '../models/User';
import { Tag } from '../models/Tag';
import { authenticate, requireEventCreatorOrAdmin } from '../middleware/auth';

const router = Router();

// CREATE a new category (only for event creator or admin)
router.post(
  '/',
  authenticate,
  requireEventCreatorOrAdmin,
  async (req: Request, res: Response) => {
    try {
      const { name, description } = req.body;

      if (!name || !description) {
        return res.status(400).json({ success: false, error: 'Name and description are required.' });
      }

      // Prevent duplicate category names
      const existing = await Category.findOne({ where: { name } });
      if (existing) {
        return res.status(400).json({ success: false, error: 'Category name already exists.' });
      }

      const category = await Category.create({ name, description });
      res.status(201).json({ success: true, data: category });
    } catch (error) {
      console.error('Create category error:', error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  }
);

// GET all categories (public/no auth needed)
router.get('/', async (req: Request, res: Response) => {
  try {
    const categories = await Category.findAll({ order: [['name', 'ASC']] });
    res.json({ success: true, data: categories });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// GET single category by ID (public)
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({ success: false, error: 'Category not found.' });
    }
    res.json({ success: true, data: category });
  } catch (error) {
    console.error('Get category by ID error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// GET all events in a given category (PUBLIC)
router.get('/:categoryId/events', async (req: Request, res: Response) => {
  try {
    const categoryId = parseInt(req.params.categoryId);
    const category = await Category.findByPk(categoryId);
    if (!category) {
      return res.status(404).json({ success: false, error: 'Category not found.' });
    }

    const events = await Event.findAll({
      where: { categoryId },
      include: [
        { model: Tag, as: 'tags', through: { attributes: [] } },
        { model: Category, as: 'category', attributes: ['id', 'name'] },
        { model: User, as: 'author', attributes: ['id', 'email', 'firstName', 'lastName'] }
      ]
    });

    res.json({ success: true, data: events });
  } catch (error) {
    console.error('Get events by categoryId error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// UPDATE a category (only for event creator or admin)
router.put(
  '/:id',
  authenticate,
  requireEventCreatorOrAdmin,
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { name, description } = req.body;
      const category = await Category.findByPk(id);

      if (!category) {
        return res.status(404).json({ success: false, error: 'Category not found.' });
      }

      // Prevent changing name to duplicate another category
      if (name && name !== category.name) {
        const existing = await Category.findOne({ where: { name } });
        if (existing) {
          return res.status(400).json({ success: false, error: 'Category name already exists.' });
        }
      }

      if (name) category.name = name;
      if (description) category.description = description;
      await category.save();

      res.json({ success: true, data: category });
    } catch (error) {
      console.error('Update category error:', error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  }
);

// DELETE a category (only for event creator or admin)
router.delete(
  '/:id',
  authenticate,
  requireEventCreatorOrAdmin,
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const category = await Category.findByPk(id);
      if (!category) {
        return res.status(404).json({ success: false, error: 'Category not found.' });
      }

      // TODO: Prevent deletion if events exist in this category

      await category.destroy();
      res.json({ success: true, message: 'Category deleted' });
    } catch (error) {
      console.error('Delete category error:', error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  }
);

export default router;
