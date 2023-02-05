import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  FacebookUserRequest,
  GoogleUserRequest,
  UserRequest,
} from 'src/Interfaces/request.interface';
import { AuthService } from './auth.service';
import { GoogleGuard } from './guards/google.guard';
import { Response } from 'express';
import { FacebookGuard } from './guards/facebook.guard';
import { RegisterUserDto } from './dto/auth.dto';
import { LocalGuard } from './guards/local.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(
    @Body() body: RegisterUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = await this.authService.registerUser(body);
    res.cookie('access_token', token, {
      maxAge: 5184000000,
      sameSite: true,
      secure: false,
    });
    return token;
  }

  @Post('login')
  @UseGuards(LocalGuard)
  async login(
    @Req() req: UserRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = await this.authService.login(req.user);
    res.cookie('access_token', token, {
      maxAge: 5184000000,
      sameSite: true,
      secure: false,
    });
    return token;
  }

  @Get('google')
  @UseGuards(GoogleGuard)
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async googleAuth() {}

  @Get('google/callback')
  @UseGuards(GoogleGuard)
  async googleAuthCallback(
    @Req() req: GoogleUserRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = await this.authService.login(req.user);
    res.cookie('access_token', token, {
      maxAge: 5184000000,
      sameSite: true,
      secure: false,
    });
    return `
    <h3>Successfully log in with Google</h3>
    <p>Provider: ${req.user.provider}</p>
    <p>Provider ID: ${req.user.providerId}</p>
    <p>Email: ${req.user.email}</p>
    <p>Given Name: ${req.user.givenName}</p>
    <p>Family Name: ${req.user.familyName}</p>
    <p>Jwt Token from Our Server: ${token}</p>
    <a href="/">Go to Home Page</a>
    `;
  }

  @Get('facebook')
  @UseGuards(FacebookGuard)
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async facebookAuth() {}

  @Get('facebook/callback')
  @UseGuards(FacebookGuard)
  async facebookAuthCallback(
    @Req() req: FacebookUserRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = await this.authService.login(req.user);
    res.cookie('access_token', token, {
      maxAge: 5184000000,
      sameSite: true,
      secure: false,
    });
    return `
    <h3>Successfully log in with Facebook</h3>
    <p>Provider: ${req.user.provider}</p>
    <p>Provider ID: ${req.user.providerId}</p>
    <p>Email: ${req.user.email}</p>
    <p>Given Name: ${req.user.givenName}</p>
    <p>Family Name: ${req.user.familyName}</p>
    <p>Jwt Token from Our Server: ${token}</p>
    <a href="/">Go to Home Page</a>
    `;
  }
}
