Shopify Provider (Private NPM Package)
================================================================================
A nicer interface to the [Shopify GraphQL Admin API](https://shopify.dev/docs/api/admin-graphql) with built-in support for [bulk operations](https://shopify.dev/docs/api/usage/bulk-operations).

### Private NPM Package
This is (or ought to be) entirely private:
- Privately hosted on a GitHub repo.
- Privately hosted on an alternate NPM registry at GitHub Packages.
  - A GitHub Personal Access Token is required for access.
  - An `.npmrc` file must be configured providing the registry address and access token.
  - The access token itself should be kept out of version control and instead provided via an environment variable, e.g. `~/.zshenv.local`.

Install
--------------------------------------------------------------------------------
### 1. Configure `.npmrc`
Create or edit `.npmrc` on the project root:

```text
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN_READ_ONLY}
@dmkishi:registry=https://npm.pkg.github.com/
```

Verify it's working with `npm whoami --registry=https://npm.pkg.github.com/`. It should return `dmkishi`.

### 2. Install
```sh
npm install --save @dmkishi/shopify-provider
```

Usage
--------------------------------------------------------------------------------
```ts
import ShopifyProvider from '@dmkishi/shopify-provider';
import 'dotenv/config';

const shopifyProvider = new ShopifyProvider({
  storeDomain: process.env.SHOPIFY_DOMAIN!,
  apiVersion: process.env.SHOPIFY_ADMIN_API_VERSION!,
  accessToken: process.env.SHOPIFY_ADMIN_API_ACCESS_TOKEN!,
});

const products = await shopifyProvider.bulkOperation(/* graphql */`
  {
    products {
      edges {
        node {
          title
          id
        }
      }
    }
  }
`);

console.log(products); // [{ title: "Product Title", id: "123" }, ... ]
```

Develop
--------------------------------------------------------------------------------
```sh
# Build and publish
npm run publish
```
