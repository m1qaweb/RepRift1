const { TextEncoder, TextDecoder } = require("util");
const { TransformStream } = require("web-streams-polyfill");

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
global.TransformStream = TransformStream;
