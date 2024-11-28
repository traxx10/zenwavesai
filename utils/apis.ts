const IS_DEV = 0;
const IS_STAGING = 1;

export const BASE_URL = IS_DEV
  ? 'http://127.0.0.1:8000'
  : IS_STAGING
  ? 'https://myndgair3b.loclx.io'
  : 'https://api.prod.app';

export const PURCHASES_API_KEY = 'appl_PitJggrUesUgIZSqrHJAsbaXNTC';
