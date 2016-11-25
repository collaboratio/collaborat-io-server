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
				var client = {};
				client[clientId] = clients[clientId];
				arrayClients.push(client);
			}
		}
		return arrayClients;
	}.bind(this);

	/**
   * Get rooms
	 * @return {Array} Array of rooms
   */
	this.socketIo.sockets.rooms = function () {
		return this.socketIo.sockets.adapter.rooms;
	}.bind(this);

	/**
	 * Checks if room exists
	 * @param  {String} room A room namespace
	 * @return {Boolean}      True if room exists else False
	 */
	this.socketIo.sockets.roomExists = function (room) {
		return this.socketIo.sockets.adapter.rooms[room] !== undefined;
	}.bind(this);

	/**
	 * Get the room object if exists
	 * @param  {String} room A room namespace
	 * @return {Boolean}      True if room exists else False
	 */
	this.socketIo.sockets.getRoom = function (roomName) {
		var room = null;
		if(this.socketIo.sockets.roomExists(roomName)){
			room = {
				name: roomName,
				users: this.socketIo.sockets.clients(roomName),
			};
		}
		return room;
	}.bind(this);
}
