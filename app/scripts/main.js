'use strict';

var DIVISIONES = 36;
var aciertos = 0;
var arrayAciertos = [];
var arrayColocaciones = [];
var arrayOcupados = [];
var intentos = 0;
var imagenSeleccionada;
var initTime;
var endTime;

window.addEventListener('resize', calcularTamanio);

document.getElementById('empezarBtn').addEventListener('click', function(){
	elegirDificultad();
    return false;
});

var _seleccionImagen = document.getElementsByClassName('dificultadBtn');
for(var i = 0; i < _seleccionImagen.length; i++){

	_seleccionImagen[i].addEventListener('click', function(){
	    
	    var _img = this.getAttribute('data-img');

	    imagenSeleccionada = [];
	    for(var j = 0; j < DIVISIONES; j++){
	    	imagenSeleccionada.push(_img + '_' + (j + 1));
	    }

	    document.getElementById('juego').style.display = 'block';
	    document.getElementById('cuerpo').style.display = 'none';
	    iniciarJuego();

	    return false;
	});
}

document.getElementById('home').addEventListener('click', function(){
	document.getElementById('logo').style.display = 'block';
    document.getElementById('header').style.display = 'none';
    document.getElementById('nivel').style.display = 'none';
    return false;
});

document.getElementById('salir-modal').addEventListener('click', function(){
	mostrarModal();
	reset();
	document.getElementById('logo').style.display = 'block';
    document.getElementById('header').style.display = 'none';
    document.getElementById('nivel').style.display = 'none';
});

document.getElementById('dificultad-modal').addEventListener('click', function(){
	mostrarModal();
	reset();
	elegirDificultad();
});

document.getElementById('reintentar-modal').addEventListener('click', function(){
	mostrarModal();
	reset();
//	iniciarJuego();
});

function elegirDificultad(){
	document.getElementById('logo').style.display = 'none';
    document.getElementById('header').style.display = 'block';
    document.getElementById('nivel').style.display = 'block';
    document.getElementById('cuerpo').style.display = 'inline-block';
    document.getElementById('juego').style.display = 'none';
}

function mostrarModal(){
	var _modal = document.getElementById('modal');
	_modal.style.visibility = (_modal.style.visibility === 'visible') ? 'hidden' : 'visible';
}

function reset(){
	intentos = 0;
	aciertos = 0;
}

function calcularTamanio(){
	var puzzle = document.getElementById('puzzle');

	if(!!puzzle){
		var casillas = puzzle.getElementsByClassName('pieza');
		var piezas = document.getElementById('piezas').getElementsByTagName('img');

		for(var i = 0; i < piezas.length; i++){

			var _randomLeft = Math.floor(Math.random()*(90 - 10 + 1) + 10);
			var _randomTop  = Math.floor(Math.random()*(475 + 1));

			piezas[i].style.width = (puzzle.offsetWidth/6) + 'px';
			piezas[i].style.height = '95px';
			piezas[i].style.top = _randomTop + 'px';
			piezas[i].style.left = _randomLeft + 'px';

			casillas[i].style.width = (puzzle.offsetWidth/6) + 'px';
			casillas[i].style.height = 95 + 'px';

		}
		document.getElementById('piezas').style.height = puzzle.offsetHeight + 'px';
	}
}

function finalizar(){
	var _modal = document.getElementById('modal');
	document.getElementById('intentos').innerHTML = intentos;
	document.getElementById('aciertos').innerHTML = aciertos;
	document.getElementById('porcentaje-aciertos').innerHTML = parseInt((aciertos / intentos)*100) + '%';
	document.getElementById('tiempo').innerHTML = calcularTiempo();
	mostrarModal();
}

function calcularTiempo(){

	function dosCifras(digito) {
		return (digito<10? '0':'') + digito;
	}

	var milisegundos = endTime - initTime;

	var ms = milisegundos % 1000;
	milisegundos = (milisegundos - ms) / 1000;
	var seg = milisegundos % 60;
	milisegundos = (milisegundos - seg) / 60;
	var min = milisegundos % 60;

	return dosCifras(min) + "' " + dosCifras(seg) + "''";
}

function iniciarJuego(){
	
	for(var i = 0; i < DIVISIONES; i++){
		arrayAciertos[i] = false;
		arrayColocaciones[i] = false;
		arrayOcupados[i] = -1;
	}

	initTime = new Date().getTime();
	generarTablero();
}

function generarTablero(){

	var _tablero = '<div id="puzzle" class="col-md-10">';

	for(var i = 0; i < DIVISIONES/6; i++){
		_tablero += '<div class="row">';

		for(var j = 0; j < DIVISIONES/6; j++){
			_tablero += '<div class="pieza" data-casilla="' + (( i* (DIVISIONES/6) + j) + 1) + '" ondrop="drop(event)" ondragover="allowDrop(event)" ondragleave="dragLeave()">' +
						'</div>';
		}
		_tablero += '</div>'; 
	}

	_tablero += '</div><div id="piezas" class="col-md-2 clearfix" ondrop="drop2(event)" ondragover="allowDrop(event)"  ondragleave="dragLeave()">';
	
	var _apariciones = [];

	for(var i = 0; i < DIVISIONES; i++){
		var _random = Math.floor((Math.random() * 10000) % 36);

		while(_apariciones[_random]){
			_random = Math.floor((Math.random() * 10000) %36);
		}

		_tablero += '<img id="' + imagenSeleccionada[i] + '" src="/images/' + imagenSeleccionada[_random] + '.jpeg" data-img="' + (i+1) + '" draggable="true" ondragstart="drag(event)" ondragend="dragEnd(event)">';
		_apariciones[_random] = true;
	}
	_tablero += '</div>'; 
	document.getElementById('juego').innerHTML = _tablero;
	calcularTamanio();
}

function drag(event){
	event.target.style.zIndex = 1000;
	event.dataTransfer.setData('text', event.target.id);
	event.dataTransfer.setData('data', event.target.getAttribute('data-img'));
	event.dataTransfer.setData('color', event.target.parentNode.style.backgroundColor);

	return false;
}

function dragEnd(event){
	event.target.style.zIndex = 0;
}

function drop(event){

	intentos ++;
	event.preventDefault();

	var data = event.dataTransfer.getData('text');
	var d    = event.dataTransfer.getData('data');

	if(event.target){
		event.target.style.backgroundColor = 'white';
		var _casilla = event.target.getAttribute('data-casilla');

		if(!arrayColocaciones[_casilla - 1]){

			if(arrayOcupados[d-1] != -1){
				arrayColocaciones[arrayOcupados[d-1]] = false;
			}

			
			event.target.appendChild(document.getElementById(data));

			if(_casilla === document.getElementById(data).getAttribute('src').split('_')[1].split('.')[0]){

				arrayAciertos[_casilla - 1] = true;
				aciertos ++;

				if(aciertos === DIVISIONES){

					endTime = new Date().getTime();
					finalizar();
				}
			}else{
				if(arrayAciertos[arrayOcupados[d - 1]]){

					arrayAciertos[arrayOcupados[d - 1]] = false;
					aciertos --;
				}
			}
			arrayColocaciones[_casilla -1] = true;
			arrayOcupados[d-1] = _casilla - 1;
		}else{

		}
	}
	return false;
}

function drop2(event){

	event.preventDefault();

	var data = event.dataTransfer.getData('text');
	var d    = event.dataTransfer.getData('data');
	
	if(event.target){
		arrayColocaciones[arrayOcupados[d-1]] = false;
		arrayOcupados[d-1] = -1;
		event.target.style.backgroundColor = 'Lavender';

		arrayOcupados[d-1] = -1;
		var rect = event.target.getBoundingClientRect();
		var coord = {top: rect.top + document.body.scrollTop, left: rect.left + document.body.scrollLeft};
		var elemento = document.getElementById(data);

		event.target.appendChild(elemento);
		elemento.style.left = event.clientX - coord.left;
		elemento.style.top  = event.clientY - coord.top;
	}

	return false;
}

function allowDrop(event){
	event.preventDefault();
	if (event.target.getAttribute('draggable') === 'true'){
        event.dataTransfer.dropEffect = 'none';
        event.target.style.top  = event.clientY;
        event.target.style.left = event.clientX; 
	}
    else{
        event.dataTransfer.dropEffect = 'all';
        event.target.style.backgroundColor = 'rgba(120, 255, 59, 0.3)';
    }

}

function dragLeave(){
	event.preventDefault();
	var _color = event.dataTransfer.getData('color');

	if (event.target.getAttribute('draggable') === 'true'){
        event.dataTransfer.dropEffect = 'none';
	}
    else{
        event.dataTransfer.dropEffect = 'all';
        if(event.target.classList.contains('pieza')){
        	event.target.style.backgroundColor = "white";
        }
        else{
        	event.target.style.backgroundColor = "lavender";
        }
    }
}