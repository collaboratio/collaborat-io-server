'use strict';

/**
 * BaseManager constructor
 */
class BaseManager {

	/**
	 * Emit error
	 * @param  {int} status  status code
	 * @param  {String} code    Event code
	 * @param  {String} message
	 * @param  {Object} data    data
	 */
	abort (status, code, message, data){
		if(this.hasOwnProperty('socket')){
			this.socket.emit(`${code}:${status}`, {message, data});
		}
	}
}

module.exports = BaseManager;
