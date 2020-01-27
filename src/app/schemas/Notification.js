import { model, Schema } from 'mongoose'

const NotificationSchema = Schema(
  {
    content: {
      type: String,
      required: true
    },
    user: {
      type: Number,
      required: true
    },
    read: {
      type: Number,
      required: true,
      default: false
    }
  },
  {
    timestamps: true
  }
);

export default model('Notification', NotificationSchema);
