'use strict';

var autoload = require('auto-load');

module.exports = Collaboratio;

/**
 * Collaboratio server constructor
 * @param {Socket.io} socket 	Socket.io socket
 * @param {http} 			server 	Http server
 * @param {String} 		port 		Port server
 */
function Collaboratio (socket, server, port) {
	if (!(this instanceof Collaboratio)) return new Collaboratio(socket, server, port);

	this.socketio = socket;
	this.server = server;
	this.port = port || '2013';
	this.managers = [];
}

/**
 * Load the events managers from /lib/managers folder
 */
Collaboratio.prototype.loadEventManagers = function () {
	var requires = autoload(__dirname + '/lib/managers');
	for (var managerName in requires) {
		if (requires.hasOwnProperty(managerName)) {
			this.managers.push(requires[managerName]());
		}
	}

};

/**
 * Register events for each manager
 * @param  Socket.io socket
 */
Collaboratio.prototype.registerEvents = function (socket) {
	this.managers.forEach(function (manager) {
		manager.registerEvents(socket);
	})
};

/**
 * Initialize the Collaboratio Server
 */
Collaboratio.prototype.init = function () {
	this.server.listen(this.port);

	// Execute adapter
	var cioAdapter = require('./lib/adapter')(this.socketio);
	cioAdapter.init();

	this.socketio.on('connection', function (socket) {
		this.loadEventManagers();			// Loading event managers
		this.registerEvents(socket);	// Register all events from managers
	}).bind(this);
};
