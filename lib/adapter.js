'use strict';

class Adapter {

	constructor(io) {
		this.socketIo = io;
	}

	init() {
		/**
		 * Get clients in rooms
		 * @param  {String} room 	A room nam
		 * @return {Array} 				Array of clients
		 */
		this.socketIo.sockets.clients = (room) => {
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
		}

		/**
	   * Get rooms
		 * @return {Array} Array of rooms
	   */
		this.socketIo.sockets.rooms = () => this.socketIo.sockets.adapter.rooms;

		/**
		 * Checks if room exists
		 * @param  {String} room A room namespace
		 * @return {Boolean}      True if room exists else False
		 */
		this.socketIo.sockets.roomExists = (room) => this.socketIo.sockets.adapter.rooms[room] !== undefined;

		/**
		 * Get the room object if exists
		 * @param  {String} room A room namespace
		 * @return {Boolean}      True if room exists else False
		 */
		this.socketIo.sockets.getRoom = (roomName) => {
			var room = null;
			if(this.socketIo.sockets.roomExists(roomName)){
				room = {
					name: roomName,
					users: this.socketIo.sockets.clients(roomName),
				};
			}
			return room;
		}
	}
}

module.exports = Adapter;
