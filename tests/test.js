const {suite, test} = require('../dist/index');

suite('Array', () => {
	suite('indexOf', () => {
		test('success', () => {
			// console.log('Inside a success test!');
		});
		test('failure', () => {
			throw new Error('Assertion failure.');
		});
	});
});
