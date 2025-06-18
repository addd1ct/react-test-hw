import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();


export async function initMongoConnection() {

  const uri = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_URL}/${process.env.MONGODB_DB}?retryWrites=true&w=majority`;

  await mongoose.connect(uri);
  console.log('Mongo connection successfully established!');
}
