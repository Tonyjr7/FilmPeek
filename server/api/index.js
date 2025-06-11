import serverless from 'serverless-http';
import app from '../server.js';
import connectDB from '../config/db.config.js';

let isConnected = false;

const handler = async (req, res) => {
  if (!isConnected) {
    await connectDB();
    isConnected = true;
  }

  const expressHandler = serverless(app);
  return expressHandler(req, res);
};

export default handler;
