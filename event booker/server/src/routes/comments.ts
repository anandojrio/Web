import { Router, Request, Response } from 'express';
import { Comment } from '../models/Comment';
import { Event } from '../models/Event';
import { User } from '../models/User';
import { authenticate } from '../middleware/auth';
import { requireAdmin } from '../middleware/auth';

const router = Router();

/**
 * POST /api/events/:eventId/comments
 */
router.post('/events/:eventId/comments', async (req: Request, res: Response) => {
  try {
    const eventId = parseInt(req.params.eventId);
    const { text, authorName } = req.body;

    // Check event exists
    const event = await Event.findByPk(eventId);
    if (!event) {
      return res.status(404).json({ success: false, error: 'Event not found.' });
    }

    let name = authorName;

    // If there's a Bearer token, use authenticate and get user's full name
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      try {
        await new Promise((resolve, reject) => authenticate(req, res, (err: any) => err ? reject(err) : resolve(null)));
        if ((req as any).user) {
          const userInDb = await User.findByPk((req as any).user.userId);
          if (userInDb) name = `${userInDb.firstName} ${userInDb.lastName}`;
        }
      } catch {
      }
    }

    if (!name || !text) {
      return res.status(400).json({ success: false, error: 'Author name and text required.' });
    }

    const comment = await Comment.create({
      eventId,
      authorName: name,
      text
    });

    res.status(201).json({ success: true, data: comment });
  } catch (error) {
    console.error('Create comment error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

/**
 * GET /api/events/:eventId/comments
 */
router.get('/events/:eventId/comments', async (req: Request, res: Response) => {
  try {
    const eventId = parseInt(req.params.eventId);
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    const { count, rows } = await Comment.findAndCountAll({
      where: { eventId },
      order: [['createdAt', 'DESC']],
      offset,
      limit,
      distinct:true,
    });

    res.json({
      success: true,
      data: rows,
      page,
      totalPages: Math.ceil(count / limit),
      totalComments: count,
    });
  } catch (error) {
    console.error('List comments error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

/**
 * POST /api/comments/:commentId/like
 * POST /api/comments/:commentId/dislike
 */
const votedComments = new Set<string>(); // For demo ONLY

router.post('/comments/:commentId/like', (req: Request, res: Response) => {
  const commentId = parseInt(req.params.commentId);
  const userKey = ((req as any).user ? `user:${(req as any).user.userId}` : `ip:${req.ip}`) + `:like:${commentId}`;
  if (votedComments.has(userKey)) {
    return res.status(400).json({ success: false, error: 'Already liked this comment.' });
  }
  votedComments.add(userKey);

  Comment.increment('likeCount', { by: 1, where: { id: commentId } })
    .then(() => res.json({ success: true }))
    .catch(err => {
      console.error('Like comment error:', err);
      res.status(500).json({ success: false, error: 'Internal server error' });
    });
});

router.post('/comments/:commentId/dislike', (req: Request, res: Response) => {
  const commentId = parseInt(req.params.commentId);
  const userKey = ((req as any).user ? `user:${(req as any).user.userId}` : `ip:${req.ip}`) + `:dislike:${commentId}`;
  if (votedComments.has(userKey)) {
    return res.status(400).json({ success: false, error: 'Already disliked this comment.' });
  }
  votedComments.add(userKey);

  Comment.increment('dislikeCount', { by: 1, where: { id: commentId } })
    .then(() => res.json({ success: true }))
    .catch(err => {
      console.error('Dislike comment error:', err);
      res.status(500).json({ success: false, error: 'Internal server error' });
    });
});

/**
 * DELETE /api/comments/:commentId
 */
router.delete('/comments/:commentId', authenticate, async (req: Request, res: Response) => {
  try {
    const commentId = parseInt(req.params.commentId);
    const comment = await Comment.findByPk(commentId);
    if (!comment) {
      return res.status(404).json({ success: false, error: 'Comment not found.' });
    }

    // event koji je komentarisan
    const event = await Event.findByPk(comment.eventId);

    // trenutni korisnik
    const userId = (req as any).user?.userId;
    const userRole = (req as any).user?.role;

    let canDelete = false;
    if (userRole === 'admin') {
      canDelete = true;
    } else if (event && event.authorId === userId) {
      canDelete = true;
    } else if (comment && comment.authorName && userRole && userId) {
      // fetch user iz DB da se uporedi
      const user = await User.findByPk(userId);
      if (user) {
        const fullName = `${user.firstName} ${user.lastName}`;
        if (comment.authorName === fullName) canDelete = true;
      }
    }

    if (!canDelete) {
      return res.status(403).json({ success: false, error: 'You do not have permission to delete this comment.' });
    }

    await comment.destroy();
    res.json({ success: true, message: 'Comment deleted.' });
  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

export default router;
