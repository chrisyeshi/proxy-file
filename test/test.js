const proxyStore = require(__dirname + '/../index.js');
const assert = require('assert');

describe('serialize', function() {
	it('should serialize only once after frequent modifications',
			function(done) {
		let nSerialize = 0;
		const timeout = 50;
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
		}, timeout + 10);
	});
});