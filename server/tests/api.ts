import { treaty } from '@elysiajs/eden';
import { app, type App } from '../src/server';


export const api = treaty<App>(app);
