import { Router } from 'express';

import {  isAdmin, isLoggedIn } from '@server/middleware/auth';
import adminsRouter from './admins.router';
import authRouter from './auth/router';

import uploadRouter from './files/router';
import healthCheckRouter from './healthCheck/router';

import profileRouter from './profile/router';

import supportsRouter from './support.router';
import { CheckAuth } from '@server/handlers/auth';

const v1Router = Router();
// Routes
v1Router.use('/health-check', healthCheckRouter);
v1Router.use('/auth', authRouter);
v1Router.use('/upload', uploadRouter);
v1Router.use('/profile', profileRouter);
v1Router.use(CheckAuth, isLoggedIn,isAdmin);
v1Router.use('/supports', supportsRouter);
v1Router.use('/admins', adminsRouter);

export default v1Router;
