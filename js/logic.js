function renderBattlefield() {
	for(let i=0; i<NUM_ROWS; i++) {
		for(let j=0; j<NUM_COLS; j++) {
			let cell = $('.' + i + '_' + j);
			let value = _battlefield[i][j];
			if(value == 'x') { // Torpedo in water
				cell.text('x');
			}
			else if(value == 'S') { // Is ship
				cell.css('background-color', '#aaa');
			}
			else if(value == 'D') { // Is damaged
				cell.css('background-color', 'red');
			}
			else if(value == 'R'){ // Ship sunk
				cell.css('background-color', 'brown');
			}
		}
	}
}

function random(min, max) {
	return Math.floor(Math.random()*(max-min+1)) + min;
}

function placeShip(length) {
	let orientation = random(0,1);
	let posi,posj;
	let x, y;
	let numSteps = 0;
	
	while(true) {
		if(orientation == 0) {
			posi = random(0, NUM_ROWS - 1);
			posj = random(0, NUM_COLS - length);
		}
		else {
			posi = random(0, NUM_ROWS - length);
			posj = random(0, NUM_COLS - 1);
		}
		if(checkShipInPlace(posi, posj)) {
			numSteps++;
			if(numSteps == 1000) {
				throw Error("Too many ships in field");
			}
			continue;
		}
		
	
		x=posi;
		y=posj;
		let continueWhile = false;
		if(orientation == 0) {
			
			for(i=posj; i<posj+length; i++) {
				if(checkShipInPlace(posi, i)) {
					numSteps++;
					if(numSteps == 1000) {
						throw Error("Too many ships in field");
					}
					continueWhile = true;
					console.warn("Produced a collision in field");
					break;
				}
				_battlefield[posi][i] = 'S1';
				
			}
			if(continueWhile) {
				replaceLettersInField('S1', 0);
				continue; //while
			}
			break;
		}
		else {
			
			for(i=posi; i<posi+length; i++) {
				if(checkShipInPlace(i, posj)) {
					numSteps++;
					if(numSteps == 1000) {
						throw Error("Too many ships in field");
					}
					continueWhile = true;
					console.warn("Produced a collision in field");
					break;
				}
					
				_battlefield[i][posj] = 'S1';
			}
			if(continueWhile) {
				replaceLettersInField('S1', 0);
				continue; //while
			}
			break;
		}//else
	}//while()
	replaceLettersInField('S1', 'S');
	console.log("Draw a ship of " + length + " from cell " + x + "," + y);
}

function checkShipInPlace(x, y) {
	for(let i=x-1; i<=x+1; i++) {
		for(let j=y-1; j<=y+1; j++) {
			if(i>=0 && i<=NUM_ROWS-1 && j>=0 && j<=NUM_COLS-1) {
				if(isShip(_battlefield[i][j]))
					return true;
			}
		}
	}
	return false;
}

function isShip(valueCell) {
	return (valueCell == 'S' || valueCell == 'D' || valueCell == 'R');
}

function replaceLettersInField(oldLetter, newLetter) {
	for(let i=0; i<NUM_ROWS; i++) {
		for(let j=0; j<NUM_COLS; j++) {
			if(typeof _battlefield[i][j] == 'string') {
				_battlefield[i][j] = _battlefield[i][j].replace(oldLetter, newLetter);
				if(!isNaN(_battlefield[i][j]))
				_battlefield[i][j] = parseInt(_battlefield[i][j]);
			}
		}
	}
}

function fire(x, y) {
	let returnMessage = '';
	if(_battlefield[x][y] == 0) {
		_battlefield[x][y] = 'x';
		returnMessage = "Water!";
	}
	else if(_battlefield[x][y] == 'x') {
		returnMessage = "Fire on the same place on water";
	}
	else if(_battlefield[x][y] == 'S') {
		
		_battlefield[x][y] = 'D';
		if(detectSinking(x, y)) {
			returnMessage = "Ship sunk!!!";
		}
		else
			returnMessage = "Ship damaged!!!";

	}
	else if(_battlefield[x][y] == 'D') {
		returnMessage = "Fire on the same damaged ship position";
	}

	return returnMessage;
}

//TODO: Finish this function
/**
 * Detect a ship sunk by a collision cell
 * @param {int} x The x coordinate
 * @param {int} y The y coordinate
 * @return {int} 0 if current ship is not sunk, >0 if the current position contains a ship sunk, return the ship length
 */
function detectSinking(x, y) {
	let sunk = false;
	let shipLength = 0;
	let i,j;
	if(_battlefield[x][y] != 'S' && _battlefield[x][y] != 'D') {
		console.log("detectSinking: No ship damaged in position");
		return false;
	}
	let possiblePositions = detectBorders(x, y);
	
	let orientation = shipPosition(x, y);
	if(orientation === false) {
		return true;
	}
	if(orientation == 'V') {
		
		let firstYCoord = -1;
		let lastYCoord = -1;
		for(j=x; j>0; j--) {
			if(_battlefield[j][y] == 'D' || _battlefield[j][y] == 'S') {
				firstYCoord = j;
			}
			if(_battlefield[j][y] == 'x' || _battlefield[j][y] == 0) {
				break;
			}
		}
		possiblePositions = detectBorders(j-1, y);
		if(j == 0 && firstYCoord == -1 && !possiblePositions[0])
			firstYCoord = 0;

		for(j=x; j<NUM_ROWS; j++) {
			if(_battlefield[j][y] == 'D' || _battlefield[j][y] == 'S') {
				lastYCoord = j;
			}
			if(_battlefield[j][y] == 'x' || _battlefield[j][y] == 0) {
				break;
			}
		}
		possiblePositions = detectBorders(j-1, y);
		if(j == NUM_ROWS && lastYCoord == -1 && !possiblePositions[2])
			lastYCoord = NUM_ROWS-1;
			
		let allDamaged = true;
		console.log(`Dectected Y coords ${firstYCoord}->${lastYCoord}`);
		for(j=firstYCoord; j<=lastYCoord; j++) {
			if(_battlefield[j][y] != 'D') {
				allDamaged = false;
				break;
			}
		}
		if(allDamaged) {
			for(j=firstYCoord; j<=lastYCoord; j++) {
				_battlefield[j][y] = 'R';
				shipLength++;
			}
			sunk = true;
		}
	}

	if(orientation == 'H') {
		
		let firstXCoord = -1;
		let lastXCoord = -1;
		for(i=y; i>0; i--) {
			if(_battlefield[x][i] == 'D' || _battlefield[x][i] == 'S') {
				firstXCoord = i;
			}
			if(_battlefield[x][i] == 'x' || _battlefield[x][i] == 0) {
				break;
			}
		}
		possiblePositions = detectBorders(x, i);
		if(i == 0 && firstXCoord == -1 && !possiblePositions[3])
			firstXCoord = 0;

		for(i=y; i<NUM_COLS; i++) {
			if(_battlefield[x][i] == 'D' || _battlefield[x][i] == 'S') {
				lastXCoord = i;
			}
			if(_battlefield[x][i] == 'x' || _battlefield[x][i] == 0) {
				break;
			}
		}
		possiblePositions = detectBorders(x, i);
		if(i == NUM_COLS && lastXCoord == -1 && !possiblePositions[1])
			lastYCoord = NUM_COLS-1;
			
		console.log(`Dectected X coords ${firstXCoord}->${lastXCoord}`);
		let allDamaged = true;
		for(i=firstXCoord; i<=lastXCoord; i++) {
			if(_battlefield[x][i] != 'D') {
				allDamaged = false;
				break;
			}
		}
		if(allDamaged) {
			for(i=firstXCoord; i<=lastXCoord; i++) {
				_battlefield[x][i] = 'R';
				shipLength++;
			}
			sunk = true;
		}
	}
	if(sunk) {
		_ships.splice(_ships.indexOf(shipLength), 1);
		return true;
	}
	return false;
}

/**
 * Detect a ship position and orientation from a given coordinate
 * @param {int} x-coord
 * @param {int} y-coord
 * @return {char|false} 'V' for vertical orientation, 'H' for horizontal, false when no ship cell found
 */
function shipPosition(x, y) {
	let possiblePositions = detectBorders(x, y);
	if(possiblePositions[0] && (_battlefield[x-1][y] == 'D' || _battlefield[x-1][y] == 'S')) {
		return 'V';
	}
	if(possiblePositions[1] && (_battlefield[x][y+1] == 'D' || _battlefield[x][y+1] == 'S')) {
		return 'H';
	}
	if(possiblePositions[2] && (_battlefield[x+1][y] == 'D' || _battlefield[x+1][y] == 'S')) {
		return 'V';
	}
	if(possiblePositions[3] && (_battlefield[x][y-1] == 'D' || _battlefield[x][y-1] == 'S')) {
		return 'H';
	}
	return false;
}

function detectBorders(x, y) {
	let possiblePositions = [true, true, true, true]; // Up, right, down, left

	if(x == 0) {
		possiblePositions[0] = false;
	}
	if(x == NUM_ROWS - 1) {
		possiblePositions[2] = false;
	}
	if(y == 0) {
		possiblePositions[3] = false;
	}
	if(y == NUM_COLS -1) {
		possiblePositions[1] = false;
	}
	return possiblePositions;
}