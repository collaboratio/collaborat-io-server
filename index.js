'use strict';

var autoload = require('auto-load');

class Collaboratio {
	/**
	* Collaboratio server constructor
	* @param {Socket.io} socket 	Socket.io socket
	* @param {http} 			server 	Http server
	* @param {String} 		port 		Port server
	*/
	constructor(socket, server, port) {
		this.socketio = socket;
		this.server = server;
		this.port = port || '2013';
		this.managers = [];
	}

	/**
	 * Load the events managers from /lib/managers folder
	 */
	loadEventManagers (socket) {
		var requires = autoload(`${__dirname}/lib/managers`);
		for (manager of requires) {
			this.managers.push(new (manager)(socket));
		}
	};

	/**
	 * Register events for each manager
	 * @param  Socket.io socket
	 */
	registerEvents ( ) {
		this.managers.forEach( (manager) => manager.registerEvents() );
	};

	/**
	 * Initialize the Collaboratio Server
	 */
	init ( ) {
		this.server.listen(this.port);

		// Execute adapter
		var cioAdapter = require('./lib/adapter')(this.socketio);
		cioAdapter.init();
		this.socketio.on('connection', (socket) => {
			this.loadEventManagers(socket);			// Loading event managers
			this.registerEvents();	// Register all events from managers
		});
	};
}

module.exports = Collaboratio;
