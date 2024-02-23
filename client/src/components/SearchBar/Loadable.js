/**
 *
 * Asynchronously loads the component for SearchBarJs
 *
 */

import Loadable from 'react-loadable';

export default Loadable({
  loader: () => import('./index'),
  loading: () => null,
});