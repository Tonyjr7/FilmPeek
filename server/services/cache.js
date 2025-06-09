// cache.js
import NodeCache from 'node-cache';
const cache = new NodeCache({ stdTTL: 86400 }); // cache for 24 hours
export default cache;
