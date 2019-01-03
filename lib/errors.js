const sourceMap = require('source-map');
const util = require('util');
const path = require('path');
const fse = require("fs-extra");

const ErrorCodes = {
  UNCAUGHT: 120,
  UNKNOWN: 127,
  INVALID_ARGUMENT: 128,
  RESOURCE_PROBLEM: 129,
  KARMA_FAIL: 130,
  UNHANDLED_REJECTION_FAILURE: 131
};

const mappingSource = async (parsedLine) => {
  if (typeof parsedLine === 'string') {
    return parsedLine;
  }

  const functionName = parsedLine[1];
  const fileName = parsedLine[2];
  const line = +parsedLine[3];
  const column = +parsedLine[4];

  const mapFileName = fileName + ".map";
  if (!fse.pathExistsSync(mapFileName)) {
    return parsedLine.input;
  }

  const mapData = await fse.readJson(mapFileName);
  const consumer = await new sourceMap.SourceMapConsumer(mapData);
  const sourcePos = consumer.originalPositionFor({ line: line, column: column });
  if (sourcePos && sourcePos.source) {
    const source = path.join(path.dirname(fileName), sourcePos.source);
    return util.format("    at %s (%s:%s:%s)", functionName, source, sourcePos.line, sourcePos.column);
  }

  return util.format("    at %s (%s:%s:%s)", functionName, fileName, line, column);
}

const resolveCallStack = async (error) => {
  const stackLines = error.stack.split("\n");
  const parsed = stackLines.map((line) => {
    let match = line.match(/^\s*at ([^(]*) \((.*?):([0-9]+):([0-9]+)\)$/);
    if (match) {
      return match;
    }

    match = line.match(/^\s*at (.*?):([0-9]+):([0-9]+)$/);
    if (match) {
      match.splice(1, 0, "<anonymous>");
      return match;
    }
    return line;
  });

  // https://stackoverflow.com/questions/40140149/use-async-await-with-array-map
  const remapped = await Promise.all(
    parsed.map(async (parsedLine) => {
      return await mappingSource(parsedLine)
    })
  );

  let outputMessage = remapped.join("\n");

  if (outputMessage.indexOf(error.message) === -1) {
    // when fibers throw error in node 0.12.x, the stack does NOT contain the message
    outputMessage = outputMessage.replace(/Error/, "Error: " + error.message);
  }

  return outputMessage;
}

const installUncaughtExceptionListener = (actionOnException) => {
  const handler = async (err) => {
    try {
      let callstack = err.stack;
      if (callstack) {
        try {
          // try to resolve stack to the source file
          callstack = await resolveCallStack(err);
        } catch (err) {
          console.error("Error while resolving callStack:", err);
        }
      }

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