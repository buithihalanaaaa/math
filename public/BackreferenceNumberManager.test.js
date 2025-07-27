const { test, expect } = require('@jest/globals');
const BackreferenceNumberManager = require('./BackreferenceNumberManager');

test('allocate and free numbers sequentially', () => {
    const mgr = BackreferenceNumberManager();
    const a = mgr.allocate();
    const b = mgr.allocate();
    expect(a).toBe(1);
    expect(b).toBe(2);

    mgr.free(a);
    const c = mgr.allocate();
    expect(c).toBe(1); // freed number should be reused

    const d = mgr.allocate();
    expect(d).toBe(3);
});