exports.testSomething = function(test){
    test.expect(1);
    test.ok(true, "this assertion should pass");
    test.done();
};

exports.testSomethingElse = function(test){
    test.expect(1);
    test.ok(true, "this assertion should also pass");
    test.done();
};