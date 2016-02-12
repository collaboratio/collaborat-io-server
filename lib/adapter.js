'use strict';

module.exports = Adapter;

function Adapter(io){
	if(!(this instanceof Adapter)) return new Adapter(io);
	this.socketIo = io;
}

/**
 * Initialize the adapter
 */
Adapter.prototype.init = function () {

	/**
	 * Get clients in rooms
	 * @param  {String} room 	A room nam
	 * @return {Array} 				Array of clients
	 */
	this.socketIo.sockets.clients = function (room) {
		var clients = this.socketIo.sockets.adapter.rooms[room];
		var arrayClients = [];
		if (clients !== undefined) {
			for (var clientId in clients) {
				arrayClients.push({clientId: clients[clientId]});
			}
		}
		return arrayClients;
	}.bind(this);

	/**
	 * Checks if room exists
	 * @param  {String} room A room namespace
	 * @return {Boolean}      True if room exists else False
	 */
	this.socketIo.sockets.roomExists = function (room) {
		return this.socketIo.sockets.adapter.rooms[room] !== undefined;
	}.bind(this);
}
