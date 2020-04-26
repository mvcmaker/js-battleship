const DT_LASTCHANGE = '20200426_1900';
const VERSION = '0.1.05';
const NUM_ROWS = 10;
const NUM_COLS = 10;

/**
 * @var {array} _battlefield: Means the main battle filed, each item contains a value that means: 0:Water, 'x': A torped in water, 'S': Means a ship, 'D': Ship damaged, 'R': Shis id destroyed
 */
let _battlefield = new Array(NUM_ROWS);
for(let i=0; i<NUM_ROWS; i++) {
	_battlefield[i] = new Array(NUM_COLS);
	for(let j=0; j<NUM_COLS; j++) {
		_battlefield[i][j] = 0;
	}
}