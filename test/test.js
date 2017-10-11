const proxyStore = require(__dirname + '/../index.js');
const assert = require('assert');
const fs = require('fs');

const deltaTime = 10;

describe('serialize', function() {
	it('should serialize only once after frequent modifications',
			function(done) {
		let nSerialize = 0;
		const timeout = 0;
		const store =
				proxyStore.createStore(
					undefined /* filePath */, timeout,
					(content, filePath) => {
			++nSerialize;
		});
		store.a = 1;
		store.b = 2;
		setTimeout(() => {
			assert.equal(1, nSerialize);
			done();
		}, timeout + deltaTime);
	});

	it('should write to file on object change', function(done) {
		const timeout = 0;
		const filePath = '/tmp/proxy-file.json';
		const store = proxyStore.createStore(filePath, timeout);
		const number = Math.floor(Math.random() * 1000);
		store.number = number;
		setTimeout(() => {
			assert.equal(number, store.number);
			fs.readFile(filePath, (err, data) => {
				const content = JSON.parse(data);
				assert.equal(number, content.number);
				done();
			});
		}, timeout + deltaTime)
	});
});

describe('deserialize', function() {
	it('should load data from file if file exists', function(done) {
		const store = proxyStore.createStore(__dirname + '/sample.json');
		assert.equal('world', store.hello);
		done();
	});
});