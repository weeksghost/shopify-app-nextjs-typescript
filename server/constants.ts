const PORT = process.env.PORT || 3000;
const SHOPIFY_API_KEY = process.env.SHOPIFY_API_KEY || "";

const SHOPIFY_API_SECRET_KEY = process.env.SHOPIFY_API_SECRET || "";

const SHOPIFY_SCOPES = process.env.SCOPES || "";
const SHOPIFY_HOST = process.env.HOST || "";

export {
  SHOPIFY_API_KEY,
  SHOPIFY_API_SECRET_KEY,
  SHOPIFY_SCOPES,
  SHOPIFY_HOST,
  PORT,
};
