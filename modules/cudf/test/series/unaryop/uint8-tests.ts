// Copyright (c) 2021, NVIDIA CORPORATION.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import {setDefaultAllocator} from '@nvidia/cuda';
import {DeviceBuffer} from '@nvidia/rmm';
import * as arrow from 'apache-arrow';

import {makeTestNumbers, makeTestSeries, MathematicalUnaryOp} from '../utils';

setDefaultAllocator((byteLength: number) => new DeviceBuffer(byteLength));

const makeTestData = (values?: (number|null)[]) =>
  makeTestSeries(new arrow.Uint8, makeTestNumbers(values));

describe('Series unaryops (Uint8)', () => {
  const runMathOp = (op: MathematicalUnaryOp) => [...makeTestData([-3, 0, 3]).lhs[op]()];
  test('Series.sin', () => { expect(runMathOp('sin')).toEqual([0, 0, 0]); });
  test('Series.cos', () => { expect(runMathOp('cos')).toEqual([0, 1, 0]); });
  test('Series.tan', () => { expect(runMathOp('tan')).toEqual([0, 0, 0]); });
  test('Series.asin', () => { expect(runMathOp('asin')).toEqual([0, 0, 0]); });
  test('Series.acos', () => { expect(runMathOp('acos')).toEqual([0, 1, 0]); });
  test('Series.atan', () => { expect(runMathOp('atan')).toEqual([1, 0, 1]); });
  test('Series.sinh', () => { expect(runMathOp('sinh')).toEqual([255, 0, 10]); });
  test('Series.cosh', () => { expect(runMathOp('cosh')).toEqual([255, 1, 10]); });
  test('Series.tanh', () => { expect(runMathOp('tanh')).toEqual([1, 0, 0]); });
  test('Series.asinh', () => { expect(runMathOp('asinh')).toEqual([6, 0, 1]); });
  test('Series.acosh', () => { expect(runMathOp('acosh')).toEqual([6, 0, 1]); });
  test('Series.atanh', () => { expect(runMathOp('atanh')).toEqual([0, 0, 0]); });
  test('Series.exp', () => { expect(runMathOp('exp')).toEqual([255, 1, 20]); });
  test('Series.log', () => { expect(runMathOp('log')).toEqual([5, 0, 1]); });
  test('Series.sqrt', () => { expect(runMathOp('sqrt')).toEqual([15, 0, 1]); });
  test('Series.cbrt', () => { expect(runMathOp('cbrt')).toEqual([6, 0, 1]); });
  test('Series.ceil', () => { expect(runMathOp('ceil')).toEqual([253, 0, 3]); });
  test('Series.floor', () => { expect(runMathOp('floor')).toEqual([253, 0, 3]); });
  test('Series.abs', () => { expect(runMathOp('abs')).toEqual([253, 0, 3]); });
  test('Series.not', () => {
    const {lhs} = makeTestData([-3, 0, 3]);
    expect([...lhs.not()]).toEqual([-3, 0, 3].map((x) => !x));
  });
  test('Series.isNull', () => {
    const {lhs} = makeTestData([null, 3, 6]);
    expect([...lhs.isNull()]).toEqual([true, false, false]);
  });
  test('Series.isValid', () => {
    const {lhs} = makeTestData([null, 3, 6]);
    expect([...lhs.isValid()]).toEqual([false, true, true]);
  });
  test('Series.bit_invert', () => {
    const {lhs} = makeTestData([null, 0, 3, 6]);
    expect([...lhs.bit_invert()]).toEqual([null, 255, 252, 249]);
  });
});
