const DT_LASTCHANGE = '20200517_1900';
const VERSION = '0.1.08';
const NUM_ROWS = 10;
const NUM_COLS = 10;

let _battlefield = new Array(NUM_ROWS);
let _ships = [5, 4, 3, 3, 2, 2];
let _fires = 0;
let _showShips = false;
/**
 * @var {array} _battlefield: Means the main battle filed, each item contains a value that means: 0:Water, 'x': A torped in water, 'S': Means a ship, 'D': Ship damaged, 'R': Shis id destroyed
 */
function initArray() {

	for(let i=0; i<NUM_ROWS; i++) {
		_battlefield[i] = new Array(NUM_COLS);
		for(let j=0; j<NUM_COLS; j++) {
			_battlefield[i][j] = 0;
		}
	}
	/*_battlefield[0][3] = 'S';
	_battlefield[1][3] = 'S';*/
}

/**
 * Print a message into defined label identified by #error-message
 * @param {string} message The message for display
 */
function errorMessage(message) {
	$('#error-message').show().text(message);
}


/**
 * Print a message into defined label identified by #message
 * @param {string} message The message for display
 */
function okMessage(message) {
	$('#message').show().text(message);
}