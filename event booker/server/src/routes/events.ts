import { Router, Request, Response } from 'express';
import { Event } from '../models/Event';
import { Category } from '../models/Category';
import { User } from '../models/User';
import { authenticate, requireEventCreatorOrAdmin } from '../middleware/auth';
import { Tag } from '../models/Tag';
import { EventReaction } from '../models/EventReaction';
import { Op } from 'sequelize';


const router = Router();

// Create a new event (event creator or admin only)
router.post('/', authenticate, requireEventCreatorOrAdmin, async (req: Request, res: Response) => {
  try {
    const { title, description, eventDate, location, categoryId, maxCapacity, tags } = req.body;
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

    if (Array.isArray(tags)) {
      await (event as any).setTags([]);
      for (const tagName of tags) {
        const trimmed = tagName.trim();
        if (!trimmed) continue;
        let [tag] = await Tag.findOrCreate({ where: { name: trimmed } });
        await (event as any).addTag(tag);
      }
    }

    // Fetch event with tags for response
    const eventWithTags = await Event.findByPk(event.id, {
      include: [
        { model: Category, as: 'category', attributes: ['id', 'name'] },
        { model: User, as: 'author', attributes: ['id', 'email', 'firstName', 'lastName'] },
        { model: Tag, as: 'tags', through: { attributes: [] } }
      ]
    });

    res.status(201).json({ success: true, data: eventWithTags });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// Get ALL events public
router.get('/', async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    // search query param
    const search = (req.query.q || req.query.search || "").toString().trim();

    const where: any = {};
    if (search.length > 0) {
      where[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
      ];
    }

    const { count, rows } = await Event.findAndCountAll({
      where,
      order: [['createdAt', 'DESC']],
      offset,
      limit,
      distinct: true,
      include: [
        { model: Category, as: 'category', attributes: ['id', 'name'] },
        { model: User, as: 'author', attributes: ['id', 'email', 'firstName', 'lastName'] },
        { model: Tag, as: 'tags', through: { attributes: [] } }
      ],
    });

    // Get like/dislike count
    const eventIds = rows.map(e => e.id);
    const reactions = await EventReaction.findAll({ where: { eventId: eventIds } });

    const counts: { [eventId: number]: { like: number; dislike: number } } = {};
    for (const id of eventIds) counts[id] = { like: 0, dislike: 0 };
    for (const r of reactions)
      counts[r.eventId][r.reaction] = (counts[r.eventId][r.reaction] || 0) + 1;

    // display
    const data = rows.map(e => ({
      ...e.toJSON(),
      likeCount: counts[e.id]?.like || 0,
      dislikeCount: counts[e.id]?.dislike || 0,
    }));

    res.json({
      success: true,
      data,
      page,
      totalPages: Math.ceil(count / limit),
      totalEvents: count,
    });
  } catch (error) {
    console.error('List events error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// GET /api/events/most-viewed
router.get('/most-viewed', async (req: Request, res: Response) => {
  try {
    const events = await Event.findAll({
      order: [['views', 'DESC']],
      limit: 10,
      include: [
        { model: Category, as: 'category', attributes: ['id', 'name'] },
        { model: User, as: 'author', attributes: ['id', 'email', 'firstName', 'lastName'] },
        { model: Tag, as: 'tags', through: { attributes: [] } }
      ]
    });

    res.json({ success: true, data: events });
  } catch (error) {
    console.error('Most viewed events error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// GET /api/events/most-reacted
router.get('/most-reacted', async (req: Request, res: Response) => {
  try {
    // get most reactons
    const reactions = await EventReaction.findAll({
      attributes: [
        'eventId',
        [EventReaction.sequelize!.fn('SUM', EventReaction.sequelize!.literal("CASE WHEN reaction = 'like' THEN 1 ELSE 0 END")), 'likeCount'],
        [EventReaction.sequelize!.fn('SUM', EventReaction.sequelize!.literal("CASE WHEN reaction = 'dislike' THEN 1 ELSE 0 END")), 'dislikeCount'],
        [EventReaction.sequelize!.fn('COUNT', '*'), 'totalReactions']
      ],
      group: ['eventId'],
      order: [[EventReaction.sequelize!.col('totalReactions'), 'DESC']],
      limit: 3
    });

    const eventIds = reactions.map((r: any) => r.eventId);

    // Get full event objects
    const events = await Event.findAll({
      where: { id: eventIds },
      include: [
        { model: Category, as: 'category', attributes: ['id', 'name'] },
        { model: User, as: 'author', attributes: ['id', 'email', 'firstName', 'lastName'] },
        { model: Tag, as: 'tags', through: { attributes: [] } }
      ]
    });

    // Map counts into event objects
    const eventMap: { [id: number]: any } = {};
    for (const reaction of reactions) {
      eventMap[reaction.eventId] = {
        likeCount: Number(reaction.get('likeCount') || 0),
        dislikeCount: Number(reaction.get('dislikeCount') || 0),
        totalReactions: Number(reaction.get('totalReactions') || 0)
      };
    }

    // Merge reactions into events output
    const data = events.map(e => ({
      ...e.toJSON(),
      ...eventMap[e.id]
    }));

    data.sort((a, b) => b.totalReactions - a.totalReactions);

    res.json({ success: true, data });
  } catch (error) {
    console.error('Most reacted events error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// GET /api/events/:eventId/similar po tagovima
router.get('/:eventId/similar', async (req: Request, res: Response) => {
  try {
    const eventId = parseInt(req.params.eventId);

    // Fetch the target event with tags
    const event = await Event.findByPk(eventId, {
      include: [{ model: Tag, as: 'tags', attributes: ['id', 'name'] }]
    });

    if (!event || !(event as any).tags?.length) {
      return res.json({ success: true, data: [] }); // No tags = nema slicnih
    }

    // get tag IDs
    const tagIds = (event as any).tags.map((tag: any) => tag.id);

    // naci druge evente koji dele tagove
    const similarEvents = await Event.findAll({
      where: {
        id: { [Op.ne]: eventId }
      },
      include: [
        { model: Tag, as: 'tags', where: { id: tagIds }, attributes: ['id', 'name'] },
        { model: Category, as: 'category', attributes: ['id', 'name'] },
        { model: User, as: 'author', attributes: ['id', 'email', 'firstName', 'lastName'] }
      ]
    });

    // Count the number of shared tags per event
    const ranked = similarEvents
      .map(e => ({
        ...e.toJSON(),
        sharedTags: (e as any).tags.filter((t: any) => tagIds.includes(t.id)).length
      }))
      .sort((a, b) => b.sharedTags - a.sharedTags) // Most shared tags first
      .slice(0, 3); // Only top 3

    res.json({ success: true, data: ranked });
  } catch (error) {
    console.error('Similar events error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});


// Get single event by ID - poveca view count
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const event = await Event.findByPk(id, {
      include: [
        { model: Category, as: 'category', attributes: ['id', 'name'] },
        { model: User, as: 'author', attributes: ['id', 'email', 'firstName', 'lastName'] },
        { model: Tag, as: 'tags', through: { attributes: [] } }
      ],
    });

    if (!event) {
      return res.status(404).json({ success: false, error: 'Event not found.' });
    }

    event.views += 1;
    await event.save();

    // Like/dislike counts
    const likeCount = await EventReaction.count({ where: { eventId: event.id, reaction: 'like' } });
    const dislikeCount = await EventReaction.count({ where: { eventId: event.id, reaction: 'dislike' } });

    res.json({
      success: true,
      data: {
        ...event.toJSON(),
        likeCount,
        dislikeCount,
      }
    });
  } catch (error) {
    console.error('Get event error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// Update an event
router.put('/:id', authenticate, requireEventCreatorOrAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, eventDate, location, categoryId, maxCapacity, tags } = req.body;

    const event = await Event.findByPk(id);
    if (!event) {
      return res.status(404).json({ success: false, error: 'Event not found.' });
    }

    if (title) event.title = title;
    if (description) event.description = description;
    if (eventDate) event.eventDate = eventDate;
    if (location) event.location = location;
    if (maxCapacity !== undefined) event.maxCapacity = maxCapacity;

    if (categoryId && categoryId !== event.categoryId) {
      const category = await Category.findByPk(categoryId);
      if (!category) return res.status(400).json({ success: false, error: 'Category not found.' });
      event.categoryId = categoryId;
    }

    await event.save();

    if (Array.isArray(tags)) {
      await (event as any).setTags([]);
      for (const tagName of tags) {
        const trimmed = tagName.trim();
        if (!trimmed) continue;
        let [tag] = await Tag.findOrCreate({ where: { name: trimmed } });
        await (event as any).addTag(tag);
      }
    }

    await event.reload({
      include: [
        { model: Category, as: 'category', attributes: ['id', 'name'] },
        { model: User, as: 'author', attributes: ['id', 'email', 'firstName', 'lastName'] },
        { model: Tag, as: 'tags', through: { attributes: [] } }
      ]
    });

    res.json({ success: true, data: event });
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// Delete an event
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

// EVENT LIKE
router.post('/:eventId/like', authenticate, async (req, res) => {
  try {
    const eventId = parseInt(req.params.eventId);
    const userId = req.user ? req.user.userId : null;
    const ip = req.ip;

    // provera da li event postoji
    const event = await Event.findByPk(eventId);
    if (!event) {
      return res.status(404).json({ success: false, error: 'Event not found.' });
    }

    // Prevent multiple reactions
    const prior = await EventReaction.findOne({ where: { eventId, ...(userId ? {userId} : {ip}), } });
    if (prior) {
      if (prior.reaction === 'like') {
        return res.status(400).json({ success: false, error: 'Already liked.' });
      } else {
        prior.reaction = 'like';
        await prior.save();
        return res.json({ success: true, message: 'Changed to like.' });
      }
    }

    await EventReaction.create({ eventId, userId, ip, reaction: 'like' });
    res.status(201).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// EVENT DISLIKE
router.post('/:eventId/dislike', authenticate, async (req, res) => {
  try {
    const eventId = parseInt(req.params.eventId);
    const userId = req.user ? req.user.userId : null;
    const ip = req.ip;

    const event = await Event.findByPk(eventId);
    if (!event) {
      return res.status(404).json({ success: false, error: 'Event not found.' });
    }

    const prior = await EventReaction.findOne({ where: { eventId, ...(userId ? {userId} : {ip}), } });
    if (prior) {
      if (prior.reaction === 'dislike') {
        return res.status(400).json({ success: false, error: 'Already disliked.' });
      } else {
        prior.reaction = 'dislike';
        await prior.save();
        return res.json({ success: true, message: 'Changed to dislike.' });
      }
    }

    await EventReaction.create({ eventId, userId, ip, reaction: 'dislike' });
    res.status(201).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});


export default router;
