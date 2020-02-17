import React, { ReactNode } from 'react';

import { BasicExampleRoute } from './BasicExampleRoute';
import { RootRoute } from './RootRoute';

interface Routes {
  [hash: string]: ReactNode;
}

export const routes: Routes = {
  '/': <RootRoute />,
  '#basic': <BasicExampleRoute />,
};