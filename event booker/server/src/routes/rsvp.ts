import { Router, Request, Response } from 'express';
import { RSVP } from '../models/RSVP';
import { Event } from '../models/Event';
import { User } from '../models/User';
import { authenticate } from '../middleware/auth';

const router = Router();

/**
 * RSVP for an event (auth required)
 */
router.post('/:eventId/rsvp', authenticate, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const eventId = parseInt(req.params.eventId);

    // da li event postoji
    const event = await Event.findByPk(eventId);
    if (!event) {
      return res.status(404).json({ success: false, error: 'Event not found.' });
    }

    // da li je korisnik vec registrovan
    const existing = await RSVP.findOne({ where: { userId, eventId } });
    if (existing) {
      return res.status(400).json({ success: false, error: 'You have already RSVPed to this event.' });
    }

    // Check event capacity (if maxCapacity is set)
    const rsvpCount = await RSVP.count({ where: { eventId } });
    if (event.maxCapacity !== null && rsvpCount >= event.maxCapacity) {
      return res.status(400).json({ success: false, error: 'Event is at max capacity.' });
    }

    const rsvp = await RSVP.create({ userId, eventId });
    res.status(201).json({ success: true, message: 'RSVP successful!', data: rsvp });
  } catch (error) {
    console.error('RSVP error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

/**
 * Cancel RSVP (auth required)
 */
router.delete('/:eventId/rsvp', authenticate, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const eventId = parseInt(req.params.eventId);

    const rsvp = await RSVP.findOne({ where: { userId, eventId } });
    if (!rsvp) {
      return res.status(404).json({ success: false, error: 'You have not RSVPed for this event.' });
    }

    await rsvp.destroy();
    res.json({ success: true, message: 'RSVP canceled.' });
  } catch (error) {
    console.error('Cancel RSVP error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

/**
 * List all RSVPs for an event
 */
router.get('/:eventId/rsvps', async (req: Request, res: Response) => {
  try {
    const eventId = parseInt(req.params.eventId);
    const rsvps = await RSVP.findAll({
      where: { eventId },
      include: [{ model: User, as: 'user', attributes: ['id', 'email', 'firstName', 'lastName'] }],
      order: [['createdAt', 'ASC']]
    });
    res.json({ success: true, data: rsvps });
  } catch (error) {
    console.error('List RSVPs error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

export default router;
