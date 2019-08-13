/* JohnApache JSLib */
'use strict';

/* this is a introduction */

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var _ = _interopDefault(require('lodash'));

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

module.exports = UtilFn;

/* this is an another introduction */
/* CopyRight @ 2019*/
