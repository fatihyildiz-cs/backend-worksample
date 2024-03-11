import { Router } from 'express'
import 'express-async-errors'; // need to import to handle async errors
import Container from 'typedi';
import { UserController } from '../../controllers/user.controller';
import { validateBody } from '../../middlewares/validators';
import { UserCreateDto } from '../../dtos/user.dto';

const router = Router()
const userController = Container.get(UserController);

router.get('/', userController.userList)
/*
  We can choose to validate the request body with inline decorators here but i'd like to 
  avoid repeating field names. So I decided to use class validators instead.
*/
router.post('/', validateBody(UserCreateDto), userController.userCreate)

export default router;