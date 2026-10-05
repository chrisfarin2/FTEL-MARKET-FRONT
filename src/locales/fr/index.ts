import 'dayjs/locale/fr.js';

import buildInfo from './build-info.json' with { type: 'json' };
import common from './common.json' with { type: 'json' };
import components from './components.json' with { type: 'json' };
import home from './home.json' with { type: 'json' };
import layout from './layout.json' with { type: 'json' };
import product from './product.json' with { type: 'json' };

export default {
  buildInfo,
  common,
  components,
  home,
  layout,
  product,
} as const;
