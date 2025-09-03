// TODO: adjust query and field names according to Upwork's GraphQL API
import { GraphQLClient, gql } from 'graphql-request';
import config from '../config';
import { withRetry } from '../lib/http';

export interface FetchParams {
  keywords?: string[];
  categories?: string[];
  contractTypes?: string[];
  minBudget?: number;
  maxBudget?: number;
  countries?: string[];
  paymentVerified?: boolean;
  minClientSpend?: number;
  postedFrom?: string; // ISO8601
}

export interface UpworkJob {
  id: string;
  title: string;
  description: string;
  createdAt: string; // TODO: verify field name
  jobType: string; // hourly/fixed
  budget?: number;
  hourly?: number;
  client: {
    country?: string;
    totalSpend?: number;
    paymentVerificationStatus?: string;
  };
  url: string;
}

const query = gql`
  query SearchJobs($input: JobSearchInput!, $after: String) {
    jobs(search: $input, after: $after) {
      edges {
        node {
          id
          title
          description
          createdAt
          jobType
          budget
          hourly
          client {
            country
            totalSpend
            paymentVerificationStatus
          }
          url
        }
        cursor
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export async function fetchJobs(params: FetchParams): Promise<UpworkJob[]> {
  const client = new GraphQLClient(config.env.UPWORK_API_URL, {
    headers: {
      Authorization: `Bearer ${config.env.UPWORK_ACCESS_TOKEN}`,
    },
  });

  const items: UpworkJob[] = [];
  let after: string | undefined;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const variables = {
      input: { ...params, postedFrom: params.postedFrom },
      after,
    };

    const res = await withRetry(() => client.request<{ jobs: any }>(query, variables));
    const edges = res.jobs.edges as { node: UpworkJob; cursor: string }[];
    for (const edge of edges) {
      items.push(edge.node);
    }
    if (res.jobs.pageInfo.hasNextPage) {
      after = res.jobs.pageInfo.endCursor;
    } else {
      break;
    }
  }

  return items;
}
