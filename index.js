const fs = require('fs');

// const proxyStore = require('proxy-file');
// const store = proxyStore.createStore('filename.json');

const defaultFilePath = __dirname + 'proxyfile.json';

const serialize = (content, filePath) => {
	fs.writeFile(filePath, JSON.stringify(content), err => {
		if (err) throw err;
	});
};

const createOnChangeSerializer = (inFilePath, inTimeout, inSerializeFunc) => {
	const filePath = inFilePath ? inFilePath : defaultFilePath;
	const timeout = inTimeout ? inTimeout : 1000;
	const serializeFunc = inSerializeFunc ? inSerializeFunc : serailize;
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
	const content = {};
	const onChangeSerialize =
			createOnChangeSerializer(filePath, timeout, serializeFunc);
	return new Proxy(content, onChangeSerialize);
};

module.exports = proxyStore;