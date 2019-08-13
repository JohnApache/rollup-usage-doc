import UtilDependA from './util-dependA';
import UtilDependB from './util-dependB';
import _ from 'lodash';
const UtilFn = () => {
    UtilDependA();
    UtilDependB();
    console.log('UtilFn');
    _.chunk([[3, [3, 4]], [2, 1]], 3);
}

export default UtilFn;