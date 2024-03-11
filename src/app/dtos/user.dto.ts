import { Expose } from "class-transformer";
import { IsEmail, IsNotEmpty, Length } from "class-validator";

export class UserCreateDto {
  /*
    The '@Expose()' decorator is used to tell the class-transformer to include the property in the 
    plainToInstance() method, which we use during sanitization. We can choose to omit this decorator 
    (or better yet use '@Exclude()') to tell the class-transformer to ignore some sensitive data like passwords.
  */
  @Expose()
  @IsNotEmpty({ message: 'Email is required.' })
  @IsEmail({}, { message: 'Email must be a valid email address.' })
  email: string;

  @Expose()
  @IsNotEmpty({ message: 'Name is required.' })
  @Length(2, 30, { message: 'Name must be between 2 and 30 characters long.' })
  name: string;
}

export class UserDto {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
}