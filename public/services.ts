import { DataPublicPluginStart } from '../../../src/plugins/data/public';
import { createGetterSetter } from '../../../src/plugins/kibana_utils/public';

export const [getData, setData] = createGetterSetter<DataPublicPluginStart>('Data');
