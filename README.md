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

type Product = {
  title: string
  tags: string[]
};

const shopifyProvider = new ShopifyProvider({
  storeDomain: 'example.myshopify.com',
  apiVersion: '2025-10',
  accessToken: 'shpat_EXAMPLE',
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
