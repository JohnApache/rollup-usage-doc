import testA from './dependA';
import testB from './dependB';
import testC from './dependC';
import $ from 'jquery';
import _ from 'lodash';
import {testD1} from './dependD';
const testFn = (): void => {
    console.log('testFn');
    testA();
    testB();
    testC();
    testD1();
    const b = {
        test: 1
    }
    const a = {
        ...b,
        test2: 3
    };

    console.log([1].includes(1));
    console.log(a);
    $(() => {
        _.chunk([[3, [3, 4]], [2, 1]], 3);
    })
}


export default testFn;