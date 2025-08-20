import { Router, Request, Response } from 'express';
import { Event } from '../models/Event';
import { Category } from '../models/Category';
import { User } from '../models/User';
import { authenticate, requireEventCreatorOrAdmin } from '../middleware/auth';
import { Tag } from '../models/Tag';
import { EventTag } from '../models/EventTag';


const router = Router();

/**
 * Create a new event (event creator or admin only)
 */
router.post('/', authenticate, requireEventCreatorOrAdmin, async (req: Request, res: Response) => {
  try {
    const { title, description, eventDate, location, categoryId, maxCapacity } = req.body;
    const authorId = req.user!.userId;

    // Validate required fields
    if (!title || !description || !eventDate || !location || !categoryId) {
      return res.status(400).json({ success: false, error: 'Missing required fields.' });
    }

    // Validate category exists
    const category = await Category.findByPk(categoryId);
    if (!category) {
      return res.status(400).json({ success: false, error: 'Category not found.' });
    }

    const event = await Event.create({
      title,
      description,
      eventDate,
      location,
      authorId,
      categoryId,
      maxCapacity: maxCapacity !== undefined ? maxCapacity : null,
    });

    res.status(201).json({ success: true, data: event });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

/**
 * Get ALL events (public, with pagination)
 * Query: /api/events?page=1&limit=10
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    const { count, rows } = await Event.findAndCountAll({
      order: [['createdAt', 'DESC']],
      offset,
      limit,
      include: [
        { model: Category, as: 'category', attributes: ['id', 'name'] },
        { model: User, as: 'author', attributes: ['id', 'email', 'firstName', 'lastName'] },
      ],
    });

    res.json({
      success: true,
      data: rows,
      page,
      totalPages: Math.ceil(count / limit),
      totalEvents: count,
    });
  } catch (error) {
    console.error('List events error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

/**
 * Get single event by ID, increment view count
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const event = await Event.findByPk(id, {
      include: [
        { model: Category, as: 'category', attributes: ['id', 'name'] },
        { model: User, as: 'author', attributes: ['id', 'email', 'firstName', 'lastName'] },
      ],
    });

    if (!event) {
      return res.status(404).json({ success: false, error: 'Event not found.' });
    }

    // Increment view count (optional: only once per session/user later)
    event.views += 1;
    await event.save();

    res.json({ success: true, data: event });
  } catch (error) {
    console.error('Get event error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

/**
 * Update an event (event creator or admin only)
 */
router.put('/:id', authenticate, requireEventCreatorOrAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, eventDate, location, categoryId, maxCapacity } = req.body;

    const event = await Event.findByPk(id);
    if (!event) {
      return res.status(404).json({ success: false, error: 'Event not found.' });
    }

    // Update only if present
    if (title) event.title = title;
    if (description) event.description = description;
    if (eventDate) event.eventDate = eventDate;
    if (location) event.location = location;
    if (maxCapacity !== undefined) event.maxCapacity = maxCapacity;

    // If updating the category, validate it exists
    if (categoryId && categoryId !== event.categoryId) {
      const category = await Category.findByPk(categoryId);
      if (!category) return res.status(400).json({ success: false, error: 'Category not found.' });
      event.categoryId = categoryId;
    }

    await event.save();
    res.json({ success: true, data: event });
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

/**
 * Delete an event (event creator or admin only)
 */
router.delete('/:id', authenticate, requireEventCreatorOrAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const event = await Event.findByPk(id);

    if (!event) {
      return res.status(404).json({ success: false, error: 'Event not found.' });
    }

    await event.destroy();
    res.json({ success: true, message: 'Event deleted' });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

export default router;
