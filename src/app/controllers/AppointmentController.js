import Appointment from '../models/Appointment';
import * as Yup from 'yup';
import User from '../models/User';

class AppointmentController{
  async store(req, res){
    const schema = Yup.object().shape({
      provider_id: Yup.number().required(),
      date: Yup.date().required(),
    });
    if(!schema.isValid(req.body)){
      return res.status.json({ error: 'Validation fails'});
    }
    const { provider_id, date } = req.body;

    const isProvider = await User.findOne({
      where:{
        id: provider_id, provider: true
      }
    });
    if(!isProvider){
      return res.status(401).json({error: 'You can only create appointments with providers'})
    }
    const user = await User.findByPk(req.user_id);
    if(user.provider){
      return res.status(401).json({error: 'You can only create appointments if you are not a provider'})
    }
    const appointment = await Appointment.create({
      user_id: req.user_id,
      provider_id,
      date
    })
    return res.status(200).json(appointment)
  }
}

export default new AppointmentController()
