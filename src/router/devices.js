import { Suspense, lazy } from 'react';
import { Navigate } from 'react-router-dom';

import SuspenseLoader from 'src/components/SuspenseLoader';

const Loader = (Component) => (props) =>
  (
    <Suspense fallback={<SuspenseLoader />}>
      <Component {...props} />
    </Suspense>
  );

// Devices
const List = Loader(lazy(()=> import('src/content/devices/List')));
const CreateForm = Loader(lazy(()=> import('src/content/devices/CreateForm')));
const Trash = Loader(lazy(()=> import('src/content/devices/Trash')));
const EditForm = Loader(lazy(()=> import('src/content/devices/EditForm')))

const devicesRoutes = [
  {
    path: '/',
    element: <Navigate to="/devices/list" replace />
  },
  {
    path: '/list',
    element: <List/>
  },
  {
    path: '/create',
    element: <CreateForm/>
  },
  {
    path: '/trash',
    element: <Trash/>
  },
  {
    path: '/:id',
    children: [
      {
        path: '/edit',
        element: <EditForm/>
      }
    ]
  },
];

export default devicesRoutes;
