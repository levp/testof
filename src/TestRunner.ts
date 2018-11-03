import {TaskQueue} from './TaskQueue';
import {TestReporter} from './TestReporter';

export type TestActionSync = () => void;
export type TestActionAsyncCallback = (cb: (error?: Error | string) => void) => void;
export type TestActionAsyncPromise = () => Promise<void>;
export type TestAction =
		TestActionSync |
		TestActionAsyncCallback |
		TestActionAsyncPromise;

export class TestRunner {
	private readonly tasks = new TaskQueue();
	private readonly suiteStack: string[] = [];
	private readonly reporter = new TestReporter();

	public suite(name: string, action: () => void): void {
		this.suiteStack.push(name);
		const length = this.suiteStack.length;
		this.tasks.enqueue(() => {
			this.reporter.suite(length, name);
		});
		action();
		this.suiteStack.pop();
	}

	public test(name: string, testAction: TestAction): void {
		const indent = this.suiteStack.length + 1;
		this.tasks.enqueue(testAction, (error?: Error | string) => {
			this.reporter.test(indent, name, error);
		});
	}
}
