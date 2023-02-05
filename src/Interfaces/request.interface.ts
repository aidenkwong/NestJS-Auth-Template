import * as express from 'express';

export interface UserRequest extends express.Request {
  user: any;
}

export interface GoogleUserRequest extends UserRequest {
  provider: 'google';
  providerId: string;
  email: string;
  givenName: string;
  familyName: string;
  picture: string;
}

export interface FacebookUserRequest extends UserRequest {
  provider: 'facebook';
  providerId: string;
  email: string;
  givenName: string;
  familyName: string;
}
