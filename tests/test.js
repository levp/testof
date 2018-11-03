console.log('**********************************');
console.log('**    OH GOD TESTING A TESTER   **');
console.log('**          GOOD LUCK           **');
console.log('**********************************');

const assert = require('assert');
const {TestRunner} = require('../dist/TestRunner');

const runner = new TestRunner();

let count = 0;

runner.suite('MyTest', () => {
	assert.strictEqual(++count, 1);

	runner.suite('First', () => {
		assert.strictEqual(++count, 2);

		runner.test('one', async () => {
			assert.strictEqual(++count, 3);
			await delay(1000);
		});

		runner.test('two', (cb) => {
			assert.strictEqual(++count, 4);
			setTimeout(() => {
				cb('oh teh noes!');
			}, 2000);
		});
	});

	runner.suite('Second', () => {
		assert.strictEqual(++count, 5);

		runner.test('three', () => {
			assert.strictEqual(++count, 6);
		});

		runner.test('four', async () => {
			assert.strictEqual(++count, 7);
			await delay(1000);
		});

		runner.test('four', () => {
			assert.strictEqual(++count, 8);
		});
	});
});

function delay(timeMillis) {
	return new Promise(resolve => {
		setTimeout(resolve, timeMillis);
	});
}

// const {suite, test} = require('../dist/index');
//
// suite('Array', () => {
// 	suite('indexOf', () => {
// 		test('success', () => {
// 			// console.log('Inside a success test!');
// 		});
// 		test('failure', () => {
// 			throw new Error('Assertion failure.');
// 		});
// 	});
// });
