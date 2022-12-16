import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UserRequest } from 'src/Interfaces/request.interface';
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

  @Get('facebook')
  @UseGuards(FacebookGuard)
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async facebookAuth() {}

  @Get('facebook/callback')
  @UseGuards(FacebookGuard)
  async facebookAuthCallback(
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
}
