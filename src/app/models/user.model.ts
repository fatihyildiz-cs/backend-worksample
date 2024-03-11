import mongoose, { Document, Schema } from 'mongoose';
import { UserDto } from '../dtos/user.dto';

/*
  We don't want higher level modules to depend on lower level objects like MongoDB documents so that we can
  change the database without affecting the higher level modules. So we convert the MongoDB documents to DTO's.
*/
export const toUserDto = (user: UserDocument): UserDto => {
  return {
    // MongoDB ObjectId should also not be exposed to higher level modules.
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
  };
};

export interface UserDocument extends Document {
  email: string;
  name: string;
  createdAt: Date;
}

const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<UserDocument>('User', UserSchema);
