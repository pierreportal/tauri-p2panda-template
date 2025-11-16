const request = async (query: string) => {
    return fetch(window.GRAPHQL_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            query: query,
            variables: {},
        }),
    })
        .then((res) => res.json())
        .then((result) => {
            return result;
        });
};

interface QueryOptions {
    schema: string;
    first?: number;
    after?: string;
    orderBy?: string;
    orderDirection?: string;
    filter?: string;
    fields: string;
    meta?: string;
}

export const paginatedQuery = async (options: QueryOptions) => {
    const {
        schema,
        first,
        after,
        orderBy,
        orderDirection,
        filter,
        fields,
        meta,
    } = options;

    const queryName = `all_${schema}`;
    const query = `
    query {
      ${queryName}(
        ${first ? `first: ${first},` : ''} 
        ${after ? `after: "${after}",` : ''} 
        ${orderBy ? `orderBy: ${orderBy},` : ''} 
        ${orderDirection ? `orderDirection: ${orderDirection},` : ''} 
        ${filter ? `filter: ${filter},` : ''} 
        ${meta ? `meta: ${meta},` : ''} 
      ) {
        totalCount
        hasNextPage
        endCursor
        documents ${fields}
      }
    }
  `;

    const result = await request(query);
    if (result.errors) {
        console.error('GraphQL errors: ', result.errors);
        return;
    }
    return result.data[queryName];
};