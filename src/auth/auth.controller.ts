import {
  Controller,
  Get,
  Render,
  Post,
  Redirect,
  Body,
  Req,
  Res,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service'; // Import PrismaService
import { User } from '@prisma/client';
import { UsersService } from '../models/users.service';
import { UserValidator } from '../validators/user.validator'; // Import User model from Prisma

@Controller('/auth')
export class AuthController {
  constructor(private readonly usersService: UsersService) {} // Inject PrismaService

  @Get('/register')
  @Render('auth/register')
  register() {
    const viewData: any = {};
    viewData.title = 'User Register - Online Store';
    viewData.subtitle = 'User Register';
    return { viewData };
  }

  @Post('/store')
  @Redirect('/')
  async store(@Body() body: any, @Res() response, @Req() request) {
    const toValidate: string[] = ['name', 'email', 'password'];
    const errors: string[] = UserValidator.validate(body, toValidate);
    if (errors.length > 0) {
      request.session.flashErrors = errors;
      return response.redirect('/auth/register');
    } else {
      await this.usersService.createOrUpdate({
        name: body.name,
        password: body.password,
        email: body.email,
        role: 'client',
        balance: 1000,
      });
      return response.redirect('/auth/login');
    }
  }

  @Get('/login') @Render('auth/login') login() {
    const viewData = [];
    viewData['title'] = 'User Login - Online Store';
    viewData['subtitle'] = 'User Login';
    return {
      viewData: viewData,
    };
  }

  @Post('/connect')
  async connect(@Body() body, @Req() request, @Res() response) {
    const email = body.email;
    const pass = body.password;
    const user = await this.usersService.login(email, pass);

    if (user) {
      request.session.user = {
        id: user.id,
        name: user.name,
        role: user.role,
      };
      return response.redirect('/');
    } else {
      return response.redirect('/auth/login');
    }
  }

  @Get('/logout') @Redirect('/') logout(@Req() request) {
    request.session.user = null;
  }
}
