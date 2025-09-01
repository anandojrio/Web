import { Router, Request, Response } from 'express';
import { Tag } from '../models/Tag';
import { Event } from '../models/Event';
import { Category } from '../models/Category';
import { User } from '../models/User';

const router = Router();

/**
 * GET /api/tags
 */
router.get('/tags', async (req: Request, res: Response) => {
  try {
    const tags = await Tag.findAll({ order: [['name', 'ASC']] });
    res.json({ success: true, data: tags });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

/**
 * GET /api/tags/:tagName/events
 * svi eventi sa datim tagom
 */
router.get('/tags/:tagName/events', async (req: Request, res: Response) => {
  try {
    const { tagName } = req.params;
    const tag = await Tag.findOne({ where: { name: tagName } });
    if (!tag) return res.status(404).json({ success: false, error: 'Tag not found.' });

    const events = await (tag as any).getEvents({
      include: [
        { model: Tag, as: 'tags', through: { attributes: [] } },
        { model: Category, as: 'category', attributes: ['id', 'name'] },
        { model: User, as: 'author', attributes: ['id', 'email', 'firstName', 'lastName'] }
      ]
    });

    res.json({ success: true, data: events });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

export default router;
