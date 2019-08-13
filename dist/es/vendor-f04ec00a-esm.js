/* JohnApache JSLib */
/* this is a introduction */

import _ from 'lodash';

const UtilDependA = () => {
    console.log('UtilDependA');
};

const UtilDependB = () => {
    console.log('UtilDependB');
};

const UtilFn = () => {
    UtilDependA();
    UtilDependB();
    console.log('UtilFn');
    _.chunk([[3, [3, 4]], [2, 1]], 3);
};

export default UtilFn;

/* this is an another introduction */
/* CopyRight @ 2019*/
