import mongoose from 'mongoose';

const { Schema, model, Types } = mongoose;

const contactSchema = new Schema(
  {
    name: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    email: { type: String },
    isFavourite: { type: Boolean, default: false },
    contactType: {
      type: String,
      enum: ['work', 'home', 'personal'],
      required: true,
    },
    userId: { type: Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

export const Contact = model('Contact', contactSchema);
