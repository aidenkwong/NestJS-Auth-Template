import {
  Controller,
  Get,
  HttpStatus,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UserRequest } from 'src/Interfaces/request.interface';
import { AuthService } from './auth.service';
import { GoogleGuard } from './guards/google.guard';
import { Response } from 'express';
import { FacebookGuard } from './guards/facebook.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

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
    const token = await this.authService.signIn(req.user);
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
    const token = await this.authService.signIn(req.user);
    res.cookie('access_token', token, {
      maxAge: 5184000000,
      sameSite: true,
      secure: false,
    });
    return token;
  }
}
