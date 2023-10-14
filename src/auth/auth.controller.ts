import { Body, Controller, Post } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { Auth } from './decorator/auth.decorator';
import { AuthTypeEnum } from './enum/auth-type.enum';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserEntity } from '../user/entity/user.entity';

@Auth(AuthTypeEnum.None)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signin')
  async signIn(@Body() loginDto: LoginDto) {
    return this.authService.signIn(loginDto.email, loginDto.password);
  }

  @Post('/signup')
  async signUp(@Body() createUserDto: CreateUserDto) {
    const user = await this.authService.signUp(createUserDto);
    return new UserEntity(user);
  }
}
