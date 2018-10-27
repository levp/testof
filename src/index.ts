import chalk from 'chalk';

export type Action = () => void;

const suiteStack: string[] = [];

export function suite(name: string, cb: Action): void {
	const indent = makeIndent();
	console.log(indent + name);

	suiteStack.push(name);
	{
		cb();
	}
	suiteStack.pop();
}

export function test(name: string, cb: Action): void {
	const indent = makeIndent();
	try {
		cb();
		console.log(indent + chalk.green('[TEST PASSED]'), chalk.gray(name));
	} catch (error) {
		console.log(indent + chalk.red('[TEST FAILED]'), chalk.gray(name));


		const stackLines = error.stack.split(/[\r\n]/g);
		let longestLine = 0;
		for (const line of stackLines) {
			const lineLength = line.length;
			if (lineLength > longestLine) {
				longestLine = lineLength;
			}
		}
		if (longestLine % 2 === 0) {
			longestLine++;
		}

		for (let i = 0; i < stackLines.length; i++) {
			const line = stackLines[i];
			stackLines [i] = line.padEnd(longestLine, ' ');
		}

		const separatorChar = '✱';
		const leftWall = 1;
		const rightWall = 1;

		const padLineLength = longestLine + leftWall + rightWall + 5;
		const padLine = new Array(Math.ceil(padLineLength / 2)).join(separatorChar + ' ');
		console.log(
				padLine,
				'\n' + repeatString(separatorChar, rightWall),
				stackLines.join(' ' + repeatString(separatorChar, leftWall) + '\n' + repeatString(separatorChar, rightWall) + ' '),
				repeatString(separatorChar, leftWall),
				'\n' + padLine,
		);
	}
}

function makeIndent(): string {
	return repeatString('  ', suiteStack.length + 2);
}

function repeatString(str: string, count: number): string {
	return (new Array(count + 1)).join(str);
}
