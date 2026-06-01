import { createApp } from '../backend/app.js';

let app;

export default async function handler(req, res) {
  app = app || (await createApp());
  return app(req, res);
}
