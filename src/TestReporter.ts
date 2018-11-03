import chalk from 'chalk';

export class TestReporter {
	private readonly indentType = chalk.gray(' . ');

	public suite(indent: number, suiteName: string): void {
		const indentStr = (new Array(indent)).fill(this.indentType).join('');
		console.log(indentStr + suiteName);
	}

	public test(indent: number, testName: string, error?: Error | any) {
		let indentStr = (new Array(indent)).fill(this.indentType).join('');
		if (error) {
			console.log(indentStr + chalk.red('[TEST FAILED]'), chalk.gray(testName));

			indentStr += this.indentType;
			if ((error instanceof Error) && error.stack) {
				console.log(indentStr + chalk.red(error.stack));
			} else {
				console.log(indentStr + chalk.yellow('(Tip: throwing anything other than Error objects is discouraged.)'));
				console.log(indentStr + chalk.red('ERROR MESSAGE:'));
				console.log(indentStr + chalk.red(String(error)));
			}
			return;
		}
		console.log(indentStr + chalk.green('[TEST PASSED]'), chalk.gray(testName));
	}
}
