/* JohnApache JSLib */
'use strict';

/* this is a introduction */

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var $ = _interopDefault(require('jquery'));
var _ = _interopDefault(require('lodash'));
var myLib = require('./myLib-b591b04b-cjs.js');

const testA = () => {
    console.log('testA');
};

const testB = () => {
    console.log('testB');
};

const testC = () => {
    console.log('testC');
};

const testD1 = () => {
    console.log('testD1');
};

const testFn = () => {
    console.log('testFn');
    testA();
    testB();
    testC();
    myLib.myLib();
    testD1();
    const b = {
        test: 1
    };
    const a = {
        ...b,
        test2: 3
    };

    console.log(a);
    $(() => {
        _.chunk([[3, [3, 4]], [2, 1]], 3);
    });
};

module.exports = testFn;

/* this is an another introduction */
/* CopyRight @ 2019*/
