import { Inject, Service } from "typedi";
import { UserRepository } from "../repositories/user.repository";
import { UserCreateDto, UserDto } from "../dtos/user.dto";

@Service()
export class UserService {
  private userRepository: UserRepository;

  constructor(@Inject() userRepo: UserRepository) {
    this.userRepository = userRepo;
  }
  /*
    For a moment it might make sense to make this method generic (like getAll) and receive multiple parameters
    for the find, sort, limit queries but that would mean exposing the Mongoose query language to the higher level modules.
    We want to be using this service no matter what the current database is.
    I'd rather add new methods or higher level parameters for specific queries (like boolean for finding users with admin 
    privilages) and convert them to queries in the repository level when needed.
  */
  async getAllSorted(ascending: boolean): Promise<UserDto[]> {
    return this.userRepository.getAllSorted(ascending)
  }

  async create(user: UserCreateDto): Promise<UserDto> {
    return this.userRepository.create(user)
  }
}