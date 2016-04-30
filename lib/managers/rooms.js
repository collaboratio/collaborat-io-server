'use strict';

module.exports = RoomsManager;

/**
 * RoomsManager constructor
 */
function RoomsManager (){
	if(!(this instanceof RoomsManager)) return new RoomsManager();

	this.prefix = 'room';
}

/**
 * Events registration
 * @param  {Socket.io} socket Socket.io Socket
 */
RoomsManager.prototype.registerEvents = function (socket) {
	/**
	* Create a room
	* @param  {String} room         A room name
	*/
	var createRoom  = function (room) {
		if(socket.server.sockets.roomExists(room)){
			socket.emit(this.prefix + ':exists');
			return 0;
		}

		socket.join(room);
		socket.emit(this.prefix + ':created');
	}.bind(this);

	/**
	 * List rooms
	 * @return {Array} Array of rooms
	 */
	var listRooms = function () {
		socket.emit(this.prefix + ':listed', socket.server.sockets.rooms() );
	}.bind(this);

	/**
	 * Join room
	 * @param  {String} room         A room name
	 */
	var joinRoom = function (room) {
		if(!socket.server.sockets.roomExists(room)){
			socket.emit(this.prefix + ':notexists');
			return 0;
		}

		socket.join(room);
		socket.emit(this.prefix + ':joined');
	}.bind(this);

	var events = {
		'create' : createRoom,
		'list' : listRooms,
		'join' : joinRoom,
	}

	for (var eventName in events) {
		if (events.hasOwnProperty(eventName) && socket._events[this.prefix + ':' +  eventName] == undefined) {
			socket.on(this.prefix + ':' +  eventName, events[eventName])
		}
	}

};
