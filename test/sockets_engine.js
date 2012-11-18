var io = require('socket.io-client');



exports.socketsGroup = {
    setUp: function(callback) {
        this.socket = io.connect('http://localhost', {'force new connection': true});
        callback();
    },
    testCanConnect: function(test) {
        test.expect(1);
        this.socket.on('connect', function () {
            test.ok(true, "connect event fired");
            test.done();
        });

    },
    testAddClient: function(test) {
        test.expect(3);
        console.log('beggining add client test');
        var supersocket = this.socket;
        supersocket.on('connect', function() {
            supersocket.emit("i'm new here");
            test.ok(true, "sent cookie request");
            console.log('sent cookie request');
            supersocket.on('have a fresh cookie', function(data1) {
                test.ok((typeof data1 != null && typeof data1 != 'undefined'), "got first cookie");
                console.log('got first cookie');
                supersocket.emit("i've been here before", data1);
                supersocket.on('have a stale cookie', function(data2) {
                    console.log('got second cookie');
                    test.equals(data2, data1, "cookies are identical");
                    console.log('cookies are identical');
                    test.done();
                });
            })
        });
    },


    tearDown: function(callback) {
        this.socket.disconnect();
        callback();
    }

};

exports.testSomethingElse = function(test){
    test.expect(1);
    test.ok(true, "this assertion should also pass");
    test.done();

};