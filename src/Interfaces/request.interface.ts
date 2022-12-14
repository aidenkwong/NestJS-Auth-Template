import * as express from 'express';

export interface UserRequest extends express.Request {
  user: any;
}
