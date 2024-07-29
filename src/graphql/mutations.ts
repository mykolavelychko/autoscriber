import gql from 'graphql-tag';

export const CREATE_RECORDING = gql`
  mutation CreateRecording($name: String! = "Untitled Recording") {
    createRecording(name: $name) {
      id
      name
      timestamp
    }
  }
`;

export const UPDATE_RECORDING = gql`
  mutation UpdateRecording($id: ID!, $name: String, $data: String) {
    updateRecording(id: $id, name: $name, data: $data) {
      id
      timestamp
      data
    }
  }
`;

export const CREATE_CHUNK = gql`
  mutation CreateChunk($parentId: ID!, $data: String!) {
    createChunk(parentId: $parentId, data: $data) {
      id
      timestamp
    }
  }
`;
