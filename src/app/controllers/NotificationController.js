import Notification from '../schemas/Notification';
import User from '../models/User';

class NotificationController {
  async index(req, res) {
    const isProvider = await User.findOne({
      where: {
        id: req.user_id,
        provider: true,
      },
    });
    if (!isProvider) {
      return res
        .status(401)
        .json({ error: 'Only providers can load notifications' });
    }
    const { limit = 20 } = req.query;
    const notifications = await Notification.find({
      user: req.user_id,
    })
      .sort('createdAt')
      .limit(limit);
    return res.json(notifications);
  }
}

export default new NotificationController();
