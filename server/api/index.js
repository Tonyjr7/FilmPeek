import serverless from 'serverless-http';
import app from '../server.js';
import connectDB from '../config/db.config.js';

let isConnected = false;
const expressHandler = serverless(app); // moved outside

const handler = async (req, res) => {
  if (!isConnected) {
    await connectDB();
    isConnected = true;
  }

  return expressHandler(req, res);
};

export default handler;
