import jwt from 'jsonwebtoken';
import User from '../models/User';

class SessionController {
  async store(req, res) {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      res.status(401).json({ error: 'User not found' });
    }

    if (!user.checkPassword(password)) {
      return res.status(401).json({ error: 'Password does not match' });
    }

    const { id, name } = user;

    return res.status(200).json({
      user: {
        id,
        name,
        email,
        token: jwt.sign({ id }, 'hashmassa', { expiresIn: '7d' }),
      },
    });
  }
}
export default new SessionController();
