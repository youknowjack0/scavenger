var murmur = require("../lib/murmurhash3/murmurhash3_gc.js");

var out = {};
exports = module.exports = out;

/**
 * sockets connector for sockets.io
 *
 * @param io
 */
var SocketIoConnector = function(io)  {
    this.io = io;
    this.server = null;
    this.yourface = "abc";
};
SocketIoConnector.prototype.setup = function(server) {
    this.server = server;
    this.io.sockets.on('connection', this.onConnection.bind(this));
};
SocketIoConnector.prototype.onConnection = function(socket) {
    // give them a cookie
    var server = this.server;
    socket.on("i'm new here", function() {
        var id = server.generateId();
        socket.emit("have a fresh cookie", id);
        server.addClient(id, socket);
    });
    // eat their cookie
    socket.on("i've been here before", function(data) {
        if(typeof data !== 'string') {
            return Error("You look like you've had enough")
        }
        socket.emit("have a stale cookie", data);
        server.addClient(data, socket);
    });
};

/**
 * control access to a shared method
 *
 * @param {object} object - the object on which the method is located
 * @param {string} methodName - the method to be run
 * @param {Client} source - who is trying to run this
 */
out.ActionVerifier = function(object, methodName, source) {
    return false;
};

out.createServer= function(io) {
    var connector = new SocketIoConnector(io);
    var server = new Server(connector);
};

out.Server = Server;
/**
 * engine server to handle game object sync
 *
 * @param {object} connector
 */
function Server(connector) {
    this.connector = connector;
    this.registry = {};
    this.clients = {};
    this.activeSessions = {};
    this.connector.setup(this);
}

/**
 * called by a client, requesting to run a method on a game object
 *
 * @param {string} methodName
 * @param {string} objectId
 * @param params
 * @param {Client} client
 */
Server.prototype.run = function(methodName, objectId, params, client) {
    var obj = this.getObject(objectId);
    if(out.ActionVerifier(obj, methodName, client) === true) {
        obj[methodName].apply(obj, params);
    }
}


/**
 * get an object from the registry
 * @param {string} objectId
 */
Server.prototype.getObject = function(objectId) {
    return this.registry[objectId];
}

/**
 * add an object to the registry
 * @param {object} obj
 *
 * @return {string} objectId
 */
Server.prototype.addObject = function(obj) {
    var id = this.generateId();
    this.registry[id] = obj;
    return id;
};

/**
 * called by client to check that an object is in the correct state
 * @param {string} objectId
 * @param {number} hash 32 bit murmur hash
 */
Server.prototype.checkObject = function(objectId, hash) {
    if (typeof objectId !== 'string') return new Error("objectId should be a string");
    if (typeof hash !== 'number') return new Error("hash should be a number");
    var obj = this.getObject(objectId);
    if (obj === null || obj === undefined) {
        return false;
    }
    return (murmur(obj) === hash);
};

/**
 * generate an Id string for use with an object
 *
 * TODO: eliminate possibility of collision
 *
 * @return {string} random base 36 string
 * @api private
 */
Server.prototype.generateId = function() {
    return (Math.random()*9007199254740992).toString(36);
};

/**
 * add a client   !
 *
 * @param {string} id
 * @param {Socket} socket
 */
Server.prototype.addClient = function(id, socket) {
    this.clients[id] = socket;
};
/**
 * represents a client
 */
function Client() {

}