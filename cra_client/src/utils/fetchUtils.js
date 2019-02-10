import { getAuthToken, setAuthToken } from './authentication';

const baseFetch = ({ method, endpoint, body }) => {
  return fetch(endpoint, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: getAuthToken(),
    },
    body: JSON.stringify(body),
  }).then(response => {
    if (response.ok) {
      const authToken = response.headers.get('Authorization');
      if (authToken) {
        setAuthToken(authToken);
      }

      return response.json();
    } else {
      return response.json().then(Promise.reject.bind(Promise));
    }
  });
};

export const get = ({ endpoint }) => {
  return baseFetch({ method: 'GET', endpoint });
};

export const post = ({ endpoint, body }) => {
  return baseFetch({ method: 'POST', endpoint, body });
};

export const put = ({ endpoint, body }) => {
  return baseFetch({ method: 'PUT', endpoint, body });
};
