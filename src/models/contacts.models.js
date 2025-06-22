import { Schema, model } from 'mongoose';

const contactSchema = new Schema(
  {
    name: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    email: { type: String },
    isFavourite: { type: Boolean, default: false },
    contactType: { type: String, enum: ['work', 'home', 'personal'], required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    photo: { type: String },
  },
  { versionKey: false, timestamps: true }
);

export const Contact = model('Contact', contactSchema);
