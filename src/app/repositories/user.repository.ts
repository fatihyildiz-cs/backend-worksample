import { Service } from "typedi";
import User, { toUserDto } from "../models/user.model";
import { UserCreateDto, UserDto } from "../dtos/user.dto";
import { BadRequestError } from "../exceptions/app-error";
import { logger } from "../../utils/logger";

@Service()
export class UserRepository {

  async getAllSorted(ascending: boolean): Promise<UserDto[]> {
    let sort = {};
    sort = { createdAt: ascending ? 1 : -1 };
    const users = await User.find({}).sort(sort);
    return users.map(toUserDto);
  };

  async create(user: UserCreateDto): Promise<UserDto> {
    const newUser = new User(user);
    try {
      const createdUser = await newUser.save();
      return toUserDto(createdUser);
    } catch (error) {
      if (error.code === 11000) { // duplicate field error
        throw new BadRequestError('Unique constraint failed while creating the user.', error.keyValue);
      } else {
        throw error;
      }
    }
  }
}