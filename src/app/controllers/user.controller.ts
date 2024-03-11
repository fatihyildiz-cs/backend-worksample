import { Inject, Service } from 'typedi';
import { Request, Response } from 'express';
import { UserService } from '../services/user.service';

@Service()
export class UserController {
  private userService: UserService;

  constructor(@Inject() userService: UserService) {
    this.userService = userService;
  }

  /*
    We cannot make these methods members of the UserController as that would change the "this" context in inside the method
    and would require explicit binding. This is due to the way the function is attached to the router.
    Still, class structure looks more organized so I kept it.
  */
  userCreate = async (req: Request, res: Response) => {
    const createdUser = await this.userService.create(req.body)
    res.json(createdUser)
  };

  /*
    I didnt feel the need to validate the query parameter 'created' being 'asc' or 'desc'. It made sense to sort the users 
    descending by default since the new users would be on the top. So I don't really care what query parameters
    are available as long as 'created' is not 'asc'. 
    Actually, validation and sending an error message might help the frontend dev in a case where they think they should 
    be sending 'created=ascending' to sort the users, but I'd rather keep the code clean and document the interface well
    to avoid such mistakes as they are not critical.
  */
  userList = async (req: Request, res: Response) => {
    const ascending = req.query.created === 'asc';
    const users = await this.userService.getAllSorted(ascending);
    res.json(users);
  };
}