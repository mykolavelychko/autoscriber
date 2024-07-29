import gql from 'graphql-tag';

export const RECORDINGS = gql`
  query Recordings {
    recordings {
      id
      name
      timestamp
    }
  }
`;

export const RECORDING = gql`
  query Recording($id: ID!) {
    recording(id: $id) {
      id
      name
      timestamp
      data
    }
  }
`;

export const CHUNKS = gql`
  query CHUNKS($parentId: ID) {
    chunks(parentId: $parentId) {
      id
      timestamp
      data
    }
  }
`;
