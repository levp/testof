import {TestAction, TestActionAsyncCallback, TestActionAsyncPromise, TestActionSync} from './TestRunner';

export type TaskDone = (error?: Error | string) => void;

type TaskEntry = {
	test: TestAction;
	done: TaskDone;
}

export class TaskQueue {
	private readonly list: TaskEntry[] = [];
	private waiting: boolean = false;

	public enqueue(test: TestAction, done?: TaskDone): void {
		this.list.push({
			test: test,
			done: error => {
				if (typeof done === 'function') {
					try {
						done(error);
					} catch (ex) {
						console.error('Test done function should not throw an error!');
						console.error(ex);
					}
				}
				this.waiting = false;
				this.executeNext();
			}
		});

		if (this.waiting) {
			return;
		}

		this.executeNext();
	}

	private executeNext(): void {
		if (this.list.length === 0) {
			return;
		}

		this.waiting = true;
		const {test, done} = this.list.shift()!;

		if (isSyncOrPromiseTest(test)) {
			this.handleSyncOrPromiseTest(test, done);
		} else {
			this.handleCallbackTest(test, done);
		}
	}

	private handleSyncOrPromiseTest(test: TestActionSync | TestActionAsyncPromise, done: TaskDone): void {
		let promise: void | Promise<void>;
		try {
			promise = (test as TestActionSync | TestActionAsyncPromise)();
		} catch (error) {
			done(error || new Error(error));
		}

		if (isPromise(promise)) {
			promise
					.then(() => {
						done();
					})
					.catch(error => {
						done(error || new Error('Unknown error in promise returned from test.'));
					});
		} else {
			done();
		}
	}

	private handleCallbackTest(test: TestActionAsyncCallback, done: TaskDone): void {
		try {
			const promise: void | Promise<void> = (test as TestActionAsyncCallback)((er?: Error | string) => {
				done(er);
			});
			if (isPromise(promise)) {
				console.warn('WARNING: A test expecting a callback should not return a promise! The promise will be ignored ' +
						'by the test runner, and if it fails it might cause the entire process to crash.');
			}
		} catch (er) {
			done(er || new Error(er));
		}
	}
}

function isSyncOrPromiseTest(test: TestAction): test is TestActionSync | TestActionAsyncPromise {
	return test.length === 0;
}

function isPromise(candidate: any): candidate is Promise<any> {
	return candidate && typeof candidate.then === 'function';
}
