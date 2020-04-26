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
			if(typeof _battlefield[i][j] == 'string')
				_battlefield[i][j] = _battlefield[i][j].replace(oldLetter, newLetter);
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
		returnMessage = "Ship damaged!!!";
		_battlefield[x][y] = 'D';
	}
	else if(_battlefield[x][y] == 'D') {
		returnMessage = "Fire on the same damaged ship position";
	}

	return returnMessage;
}