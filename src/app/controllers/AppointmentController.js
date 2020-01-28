import * as Yup from 'yup';
import {
  startOfHour,
  parseISO,
  isBefore,
  format,
  addMinutes,
  subHours,
} from 'date-fns';
import pt from 'date-fns/locale/pt';
import { Op } from 'sequelize';
import Appointment from '../models/Appointment';
import Notification from '../schemas/Notification';
import File from '../models/File';
import User from '../models/User';
import Mail from '../../lib/Mail';

class AppointmentController {
  async index(req, res) {
    const { limit = 20 } = req.query;
    const { page = 1 } = req.query;
    const isProvider = await User.findOne({
      where: {
        id: req.user_id,
        provider: true,
      },
    });
    if (isProvider) {
      return res.status(401).json({
        error: "You are a provider, you haven't appointments notifications",
      });
    }
    const appointments = await Appointment.findAll({
      where: {
        user_id: req.user_id,
        canceled_at: null,
      },
      limit,
      offset: (page - 1) * limit,
      order: ['date'],
      attributes: ['id', 'date'],
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['id', 'name'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['id', 'path', 'url'],
            },
          ],
        },
      ],
    });
    return res.status(200).json(appointments);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      provider_id: Yup.number().required(),
      date: Yup.date().required(),
    });
    if (!schema.isValid(req.body)) {
      return res.status.json({ error: 'Validation fails' });
    }
    const { provider_id, date } = req.body;

    const isProvider = await User.findOne({
      where: {
        id: provider_id,
        provider: true,
      },
    });
    if (!isProvider) {
      return res
        .status(401)
        .json({ error: 'You can only create appointments with providers' });
    }
    const user = await User.findByPk(req.user_id);
    if (user.provider) {
      return res.status(401).json({
        error: 'You can only create appointments if you are not a provider',
      });
    }
    /**
     * Check for past dates
     */
    const hourStart = startOfHour(parseISO(date));
    const dateAfter60min = addMinutes(parseISO(date), 60);
    const dateBefore60min = addMinutes(parseISO(date), -60);
    if (isBefore(hourStart, new Date())) {
      return res.status(400).json({ error: 'Past dates are not allowed' });
    }

    /**
     * check for appointment date availability
     */
    const checkAvailability = await Appointment.findOne({
      where: {
        provider_id,
        canceled_at: null,
        date: {
          [Op.between]: [dateBefore60min, dateAfter60min],
        },
      },
    });
    if (checkAvailability) {
      return res
        .status(400)
        .json({ error: 'Appointment date is note available' });
    }
    const appointment = await Appointment.create({
      user_id: req.user_id,
      provider_id,
      date,
    });

    /**
     * Notify appointment provider
     */

    const formattedDate = format(
      hourStart,
      "'dia' dd 'de' MMMM', às' H:mm'h'",
      { locale: pt }
    );
    await Notification.create({
      content: `Novo agendamento de ${user.name} para ${formattedDate}`,
      user: provider_id,
    });
    return res.status(200).json({ appointment, date: hourStart });
  }

  async delete(req, res) {
    const appointment = await Appointment.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['name', 'email'],
        },
      ],
    });
    if (appointment.user_id !== req.user_id) {
      return res.status(401).json({
        error: "You don't have permission to cancel this appointment",
      });
    }
    const dateWith2HoursLess = subHours(appointment.date, 2);
    if (isBefore(dateWith2HoursLess, new Date())) {
      return res.status(401).json({
        error: 'You can only cancel appointments at least 2 hours in advance',
      });
    }

    appointment.canceled_at = new Date();
    appointment.save();
    Mail.sendMail({
      to: `${appointment.provider.name} <${appointment.provider.email}>`,
      subject: 'Agendamento cancelado',
      text: 'Voce tem um novo cancelamento',
    });
    return res.status(200).json(appointment);
  }
}

export default new AppointmentController();
