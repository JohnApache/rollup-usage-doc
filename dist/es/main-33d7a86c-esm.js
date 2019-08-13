/* JohnApache JSLib */
/* this is a introduction */

import $ from 'jquery';
import _ from 'lodash';
import { m as myLib } from './myLib-97c4baed-esm.js';

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
    myLib();
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

export default testFn;

/* this is an another introduction */
/* CopyRight @ 2019*/
