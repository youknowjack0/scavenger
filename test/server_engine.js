var engine = require('../server/scavenger.js');

function StubConnector()  {
    this.setup = function() {

    };
    this.onConnection = function() {

    };

}

exports.syncObjects = {
    setUp : function(callback) {
        //get a new server object
        this.server = new engine.Server(new StubConnector());
        //stub out the ActionVerifier
        engine.ActionVerifier = new function() {return true};
        callback()
    },
    testObjectSync : function(test) {
        test.expect(1);
        var obj = { test: "object" };
        var id = this.server.addObject(obj);
        test.ok(obj, this.server.getObject(id));
        test.done();
    },
    tearDown : function(callback) {
        callback();
    }
}