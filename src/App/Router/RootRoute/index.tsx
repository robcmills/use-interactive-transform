import React from 'react';

import { routes } from '../routes';

export function RootRoute() {
  const listItems = Object.keys(routes)
    .filter(hash => hash !== '/')
    .map(hash => (
      <li key={hash}>
        <a href={hash}>{hash.substring(1, hash.length)}</a>
      </li>
    ));

  return (
    <ul>{listItems}</ul>
  );
}