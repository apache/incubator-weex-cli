const ErrorCodes = {
  UNCAUGHT: 120,
	UNKNOWN: 127,
	INVALID_ARGUMENT: 128,
	RESOURCE_PROBLEM: 129,
	KARMA_FAIL: 130,
	UNHANDLED_REJECTION_FAILURE: 131
};

const installUncaughtExceptionListener = (actionOnException) => {
	const handler = (err) => {
		try {
			let callstack = err.stack;
			console.error(callstack || err.toString());

			if (actionOnException) {
				actionOnException();
			}
		} catch (err) {
			// In case the handler throws error and we do not catch it, we'll go in infinite loop of unhandled rejections.
			// We cannot do anything here as even `console.error` may fail. So just exit the process.
			process.exit(ErrorCodes.UNHANDLED_REJECTION_FAILURE);
		}
	};
  // we want to see real exceptions with backtraces and stuff
  process.removeAllListeners('uncaughtException')
  process.removeAllListeners('unhandledRejection')

	process.on("uncaughtException", handler);
	process.on("unhandledRejection", handler);
}

module.exports = {
  installUncaughtExceptionListener
}