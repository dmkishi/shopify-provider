Shopify Provider
================================================================================
Simple wrapper over the [Shopify GraphQL Admin API](https://shopify.dev/docs/api/admin-graphql) with a handy abstraction for [bulk operations](https://shopify.dev/docs/api/usage/bulk-operations).

Install
--------------------------------------------------------------------------------
```sh
npm install --save @dmkishi/shopify-provider
```

Usage
--------------------------------------------------------------------------------
```ts
import ShopifyProvider from '@dmkishi/shopify-provider';
import 'dotenv/config';

type Product = {
  title: string
  tags: string[]
};

const shopifyProvider = new ShopifyProvider({
  storeDomain: process.env.SHOPIFY_DOMAIN!,
  apiVersion: process.env.SHOPIFY_ADMIN_API_VERSION!,
  accessToken: process.env.SHOPIFY_ADMIN_API_ACCESS_TOKEN!,
});

// Optionally provide a type parameter, or omit for `any[]`.
const products = await shopifyProvider.bulkOperation<Product>(/* graphql */`
  {
    products {
      edges {
        node {
          title
          tags
        }
      }
    }
  }
`);

console.log(products); // [{ title: "Title", tags: ["Tag"] }, ... ]
```

Develop
--------------------------------------------------------------------------------
```sh
# Build and publish
npm run publish
```
