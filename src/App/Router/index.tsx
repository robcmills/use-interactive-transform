import React, { useEffect, useState } from 'react';

import { routes } from './routes';

export function Router() {
  const [hash, setHash] = useState('/');

  const handleHashChange = () => {
    setHash(window.location.hash || '/');
  };

  useEffect(() => {
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
  	<>
  		{routes[hash] || 'That route does not exist'}
		</>
	);
}