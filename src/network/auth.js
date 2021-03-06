// @flow
import request from 'superagent';
import { osmchaSocialTokenUrl } from '../config/constants';
import { API_URL } from '../config';

export function postFinalTokensOSMCha(
  oauth_token: string,
  oauth_token_secret: string,
  oauth_verifier: string
) {
  return request
    .post(osmchaSocialTokenUrl)
    .type('form')
    .send({ oauth_token: oauth_token })
    .send({ oauth_verifier: oauth_verifier })
    .send({ oauth_token_secret: oauth_token_secret })
    .then(r => {
      return r.body;
    })
    .catch(e => {
      console.error(e);
      return Promise.reject(e);
    });
}
export function postTokensOSMCha() {
  return request
    .post(osmchaSocialTokenUrl)
    .type('form')
    .then(r => r.body)
    .catch(e => {
      console.error(e);
      return Promise.reject(e);
    });
}

export function fetchUserDetails(token: string) {
  return fetch(`${API_URL}/users/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? `Token ${token}` : ''
    }
  }).then(res => {
    if (res.status >= 400 && res.status < 600) {
      throw new Error(
        'Bad request. Please make sure you are allowed to add tags to this changeset.'
      );
    }
    return res.json();
  });
}
