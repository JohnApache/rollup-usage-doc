import testA from './dependA';
import testB from './dependB';
import testC from './dependC';
import $ from 'jquery';
import _ from 'lodash';
import myLib from '../myLib/index';
import {testD1} from './dependD';
import axios from 'axios';
const testFn = () => {
    console.log('testFn');
    testA();
    testB();
    testC();
    myLib();
    testD1();
    const b = {
        test: 1
    }
    const a = {
        ...b,
        test2: 3
    }

    console.log(a);
    console.log([1].includes(1));
    $(() => {
        _.chunk([[3, [3, 4]], [2, 1]], 3);
    })

    console.log(axios.request);
}


export default testFn;