'use strict';


var BaseManager = require('../manager_base');

/**
 * RoomsManager constructor
 */
class RoomsManager extends BaseManager {

	constructor (socket) {
		super();
		this.prefix = 'rooms';
		this.socket = socket;
	}

	/**
	* Create a room
	* @param  {String} room         A room name
	*/
	createRoom (room) {
		if(this.socket.server.sockets.roomExists(room)){
			return this.abort(404, 'create', `The room ${room} already exists`);
		}
		this.socket.join(room);
		this.socket.emit(
			`${this.prefix}:create:200`,
			this.socket.server.sockets.getRoom(room)
		);
	}

	/**
	 * List rooms
	 * @return {Array} Array of rooms
	 */
	listRooms ( ) {
		this.socket.emit(
			`${this.prefix}:list:200`,
			this.socket.server.sockets.rooms()
		);
	}

	/**
	 * Join room
	 * @param  {String} room         A room name
	 */
	joinRoom (room) {
		if(!this.socket.server.sockets.roomExists(room)){
			return this.abort(404, `${this.prefix}:join`, 'The room ' + room + ' doesn\'t exists');
		}

		this.socket.join(room);
		this.socket.emit(
			`${this.prefix}:join:200`,
			this.socket.server.sockets.getRoom(room)
		);
	}

	/**
	 * Leave room
	 * @param  {String} room         A room name
	 */
	leaveRoom (room) {
		if(!this.socket.server.sockets.roomExists(room)){
			return this.abort(404, `${this.prefix}:leave`, 'The room ' + room + ' doesn\'t exists');
		}

		this.socket.leave(room);
		this.socket.emit(`${this.prefix}:leave:200`);
	}

	/**
	 * Destroy room
	 * @param  {String} room         A room name
	 */
	destroyRoom (room) {
		// TODO: DESTROY ROOM
	}

	registerEvents ( ) {
		let events = {
			'create' : this.createRoom.bind(this),
			'list' 	 : this.listRooms.bind(this),
			'join'   : this.joinRoom.bind(this),
			'leave'  : this.leaveRoom.bind(this),
			'destroy': this.destroyRoom.bind(this),
		}

		for (let eventName in events) {
			if (events.hasOwnProperty(eventName) && this.socket._events[`${this.prefix}:${eventName}`] == undefined) {
				this.socket.on(`${this.prefix}:${eventName}`, events[eventName])
			}
		}
	}

	abort (status, eventCode, message = '', data = {}){
		super.abort(status, `${this.prefix}:${eventCode}`, message, data)
	}
}

module.exports = RoomsManager;
