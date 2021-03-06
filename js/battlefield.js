function init() {
	initArray();
	drawBattleField();
	$('#txtCoorX').prop('pattern', '[1-' + NUM_COLS + ']'); // [1-10]
	$('#txtCoorY').prop('pattern', '[A-' + String.fromCharCode(65+NUM_ROWS-1) + ']'); // [A-J]
	_ships.forEach((shipLong) => {
		placeShip(shipLong);
	});
	renderBattlefield();
	$('.water').click(function(e) {
		let classValue = $(this).attr('class'); //form:  "X_Y water"
		let coordinateValue = classValue.substring(0, classValue.indexOf(' ')); // form: "X_Y"
		let coordinates = coordinateValue.split("_");
		coordinates = coordinates.map((el) => {
			return parseInt(el);
		});
		//console.log(coordinates);
		let result = fire(coordinates[0], coordinates[1]);
		renderBattlefield();
		okMessage(result);
		if(endGame()) {

			okMessage("FINISHED GAME!!! (total torpedos:" + _fires + ")");
			$('.water').off('click');
		}

	});
}


/*
_battlefield[1][2] = 'x'; // x means water fired
_battlefield[1][4] = 'x'; 
_battlefield[0][3] = 'S'; // S means ship space ok
_battlefield[1][3] = 'S';
_battlefield[2][3] = 'S';
_battlefield[3][3] = 'S';
_battlefield[4][3] = 'D'; // D means ship space damaged by torpedo
*/

function drawBattleField() {
	let ocean = $('#ocean');
	//1st header row
	let tr = $('<tr>');
	tr.append($('<td>'));
	for(let i=0; i<NUM_COLS; i++) {
		tr.append($('<td>').text(i+1));
	}
	ocean.append(tr);
	
	//2nd..N rows
	for(let i=0; i<NUM_ROWS; i++) {
		tr = $('<tr>');
		let td = $('<td>').text(String.fromCharCode(65+i));
		tr.append(td);
		for(let j=0; j<NUM_COLS; j++) {
			tr.append($('<td>').addClass([i + "_" + j, "water"])); // This draw a water (ocean) cell
		}
		ocean.append(tr);
	}
}




$('#btnFire').click((e) => {
	$('#error-message').hide();
	let x = $('#txtCoorX').val();
	let y = $('#txtCoorY').val();
	if(!y.length) {
		errorMessage("Wrong coordinate Y");
		return false;
	}
	y = y.toUpperCase();
	y = y.charCodeAt()-64
	if(x<1 || x>NUM_COLS) {
		errorMessage("Wrong coordinate X");
		return false;
	}
	if(y<1 || y>NUM_ROWS || y === NaN) {
		errorMessage("Wrong coordinate Y");
		return false;
	}
	let message = fire(y-1, x-1);
	okMessage(message);
	renderBattlefield();
	if(endGame()) {
		okMessage("FINISHED GAME!!! (total torpedos:" + _fires + ")");
		$(this).off('click');
		$(this).attr('disabled', true);
	}
});

$('#txtCoorY').keyup((e) => {
	e.preventDefault();
	//console.log("la letra es ", e.key.toUpperCase());
	$(this).val(e.key.toUpperCase());

});

