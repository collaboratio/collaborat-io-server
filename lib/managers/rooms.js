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
	var events = {
		'create' : createRoom
	}

	for (var eventName in events) {
		if (events.hasOwnProperty(eventName)) {
			socket.on(this.prefix + ':' +  eventName, events[eventName])
		}
	}

	/**
	 * Create a room
	 * @param  {String} room 	A room name
	 */
	function createRoom (room) {
		if(socket.server.sockets.roomExists(room)){
			socket.emit('room:exists');
			return;
		}

		socket.join(room);
		socket.emit('room:created');
	}
};
