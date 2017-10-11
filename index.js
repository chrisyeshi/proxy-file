const fs = require('fs');

// const proxyStore = require('proxy-file');
// const store = proxyStore.createStore('filename.json');

const defaultFilePath = __dirname + 'proxyfile.json';
const defaultTimeout = 0;

const serialize = (content, filePath) => {
	fs.writeFile(filePath, JSON.stringify(content, null, 2), err => {
		if (err) throw err;
	});
};

const createOnChangeSerializer = (inFilePath, inTimeout, inSerializeFunc) => {
	const filePath = inFilePath ? inFilePath : defaultFilePath;
	const timeout = inTimeout !== undefined ? inTimeout : defaultTimeout;
	const serializeFunc = inSerializeFunc ? inSerializeFunc : serialize;
	let timer = null;
	const resetTimeout = (timeout, callback) => {
		if (timer) {
			clearTimeout(timer);
		}
		timer = setTimeout(callback, timeout);
	}

	return {
		set: (target, prop, value, receiver) => {
			target[prop] = value;
			resetTimeout(timeout, () => {
				serializeFunc(target, filePath);
			});
			return true;
		}
	};
};

const proxyStore = {};
proxyStore.createStore = (filePath, timeout, serializeFunc) => {
	let content = {};
	if (fs.existsSync(filePath)) {
		content = JSON.parse(fs.readFileSync(filePath));
	}
	const onChangeSerialize =
			createOnChangeSerializer(filePath, timeout, serializeFunc);
	return new Proxy(content, onChangeSerialize);
};

module.exports = proxyStore;