import { type AdminApiClient, createAdminApiClient } from '@shopify/admin-api-client';

export default class ShopifyProvider {
  client: AdminApiClient;

  constructor(apiCredential: { storeDomain: string; apiVersion: string; accessToken: string }) {
    this.client = createAdminApiClient(apiCredential);
  }

  /**
   * Executes a Shopify bulk operation and returns parsed results.
   *
   * @param query - GraphQL query fragment to run as a bulk operation.
   * @param pollFrequencyMs - Polling interval in milliseconds (default: 2500).
   * @returns Promise resolving to an array of result objects.
   */
  async bulkOperation(query: string, pollFrequencyMs = 2_500): Promise<object[]> {
    const {data, errors} = await this.client.request(/* graphql */`
      mutation {
        bulkOperationRunQuery(
          query: """
            ${query}
          """
        ) {
          bulkOperation { id, status }
          userErrors { field, message }
        }
      }
    `);

    if (errors) {
      throw Error('Bulk Operation Error:', { cause: errors });
    }
    if (data.bulkOperationRunQuery.userErrors.length) {
      throw Error('Bulk Operation User Error:', data.bulkOperationRunQuery.userErrors);
    }

    // Poll request status.
    let isRunning = true;
    let jsonlUrl;
    while(isRunning) {
      await new Promise(r => setTimeout(r, pollFrequencyMs));
      const statusResponse = await this.client.request(/* graphql */`
        query BulkOperationStatus {
          currentBulkOperation {
            id, status, errorCode, createdAt, completedAt, objectCount, fileSize, url, partialDataUrl,
          }
        }
      `);

      const status = statusResponse.data.currentBulkOperation.status;
      switch(status) {
        case 'RUNNING':
          break;
        case 'COMPLETED':
          isRunning = false;
          jsonlUrl = statusResponse.data.currentBulkOperation.url;
          break;
        case 'FAILED':
          const errorCode = statusResponse.data.currentBulkOperation.errorCode;
          const note = (errorCode === 'ACCESS_DENIED')
            ? 'Ensure the Shopify Admin API access scope is properly configured for the given API access token. Otherwise execute the query as a normal non-bulk GraphQL request to see more details.'
            : '';
          throw Error(`Bulk Operation Error: "${status}": "${errorCode} (${note})"`);
        default:
          throw Error(`Bulk Operation Error: "${status}"`);
      }
    }

    // Download JSONL, parse it into an array of JSON objects, and return it.
    return (await (await fetch(jsonlUrl)).text()).trim().split('\n').map(line => JSON.parse(line));
  }
}
