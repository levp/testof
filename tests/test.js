const {TestRunner} = require('../dist/TestRunner');

const runner = new TestRunner();

runner.suite('MyTest', () => {
	runner.suite('First', () => {
		runner.test('one', async () => {
			// console.log('1 START');
			await delay(1000);
			// console.log('1 END');
		});
		runner.test('two', (cb) => {
			// console.log('2 START');
			// await delay(1000);
			setTimeout(() => {
				cb('oh teh noes!');
				// // console.log('2 END');
			}, 2000);
		});
	});
	runner.suite('Second', () => {
		runner.test('three', () => {
			// console.log('3 START');
			// console.log('3 END');
		});

		runner.test('four', async () => {
			// console.log('4 START');
			await delay(1000);
			// console.log('4 END');
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
