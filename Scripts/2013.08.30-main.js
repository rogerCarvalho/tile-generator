$(document).ready(function(){
	var newGrid = Grid;
	newGrid.init();
	newGrid.visualizarGrid();
	newGrid.construirInterface();
	//generateGrid(newGrid);
//	var teste = new Tile(5,0,'doisum',newGrid);
	$(window).resize(function(){
		newGrid.resize();
	});
});


//workaround para indexOF no ie7 e ie8
if (!Array.prototype.indexOf) {
  Array.prototype.indexOf = function (searchElement /*, fromIndex */ ) {
    'use strict';
    if (this == null) {
      throw new TypeError();
    }
    var n, k, t = Object(this),
        len = t.length >>> 0;

    if (len === 0) {
      return -1;
    }
    n = 0;
    if (arguments.length > 1) {
      n = Number(arguments[1]);
      if (n != n) { // shortcut for verifying if it's NaN
        n = 0;
      } else if (n != 0 && n != Infinity && n != -Infinity) {
        n = (n > 0 || -1) * Math.floor(Math.abs(n));
      }
    }
    if (n >= len) {
      return -1;
    }
    for (k = n >= 0 ? n : Math.max(len - Math.abs(n), 0); k < len; k++) {
      if (k in t && t[k] === searchElement) {
        return k;
      }
    }
    return -1;
  };
}



var Grid = {
	nCol : 4 //varia com a largura, Math.ceil($(window).innerWidth()/wCol) arredondado pra cima,
	,nRow : 4
	,wCol : 150
	,hRow : 150 // varia com a altura if((nRow*hRow)%150 == 0){ nRow += 1;}
	,padding: 2
	,totalTiles: new Array()

	,config: function(o){
		// se precisar que alguma configuração do grid seja definido sem ser baseado na tela
		// provavelmente vai precisar definir a largura máxima da div onde o grid vai estar
	}

	,init: function(){
		this.calculateColRow();
	}

	,calculateColRow: function(){
		var wW = $(window).innerWidth()
			,wH = $(window).innerHeight()
			,rowVSwh
			;
		this.nCol = 100;//Math.ceil(wW/this.wCol);
		this.nRow = Math.floor(wH/150);
		rowVSwh = this.nRow*(150+this.padding);
		this.hRow = rowVSwh == wH ?  150: (wH - rowVSwh)/this.nRow + 150;
	}

	,posHorizontal: function(c){
		return c*(this.wCol+this.padding);
	}

	,posVertical: function(l){
		return l*(this.hRow+this.padding);
	}

	,visualizarGrid: function(){
		var _b = $('body')
			,i
			,j
			;
			_b.empty();
			ocupation = new Array(this.nCol);
			ocupVal = new Array();
		for(i=0; i<this.nCol; i++){
				ocupation[i] = new Array(this.nRow);
			for(j=0; j<this.nRow; j++){
				var d = $('<div>');
				d.css({'width':this.wCol, 'height':this.hRow, 'left':this.posHorizontal(i), 'top':this.posVertical(j)});
				d.text(i+' '+j);
				_b.append(d);
				ocupation[i][j]= false;
				ocupVal.push(parseInt(i+''+j));
			}
		}
	}

	,incommingTiles: function(){
		this.randomTiles(15);
	}

	,randomTiles: function(maxTiles){
		for(var o=0; o<maxTiles; o++){
			var num = Math.ceil(Math.random()*3) -1
				,tipo = leTipo[num]
				,_tile = new Tile(tipo,this)
				,cl = o%5
				;
			_tile.bgColor(pColors[cl]);
			this.totalTiles[o] = _tile;
		}
	}

	,construirInterface: function(){
		var tipo
			,inc
			,title = new Tile('titulo', this)
			;
		
		title.manualAdd(this.titlePos());

		this.incommingTiles();
		this.populate();
		//this.populateRest();
	}

	,populate : function(){
		for( var i in this.totalTiles){
			this.totalTiles[i].findMyPlace(ocupVal);
		}
	}

	,populateRest : function(){
		this.randomTiles(ocupVal.length);
		this.populate();
		for(var i in ocupVal){
			var _tile = new Tile('um',this)
				,cl = i%5
				;
				console.log(cl);
			_tile.bgColor(pColors[cl]);
			_tile.addTile(ocupVal[i]);
		}
	}

	,titlePos: function(){
		var p
			,wh = $(window).innerWidth()
			;
		if(wh>1200) p = 31;
		else if(wh>1045) p = 21;
		else if(wh>895) p =11;
		else p =01;
			
		return p;
	}

	,resize: function(){
		this.calculateColRow();
		this.visualizarGrid();
		this.construirInterface();
	}

}

// Tijolinho
function Tile(wh, grd){
	var dm = geralTranslateType(wh)
		;
	this.gp = grd.padding;
	this.grd = grd;
	this.posX = 0;
	this.posY = 0;
	this.w = calc(dm.w,grd.wCol, this.gp, -1);
	this.h = calc(dm.h,grd.hRow, this.gp, -1);
	// visualizando o tile
	var dt = $('<div>');
	dt.addClass(wh);
	dt.css({'width':this.w, 'height':this.h, 'background':'#a00', 'z-index':1000, 'left':this.posX, 'top':this.posY});
	dt.text(cont);
	this.DT = dt;
	cont++;
	// no Tile vai entrar uma div com uma classe que diz qual tipo ela é, cada tipo tem um w e h definido
	}

Tile.prototype.addTile = function(pos){
	this.setPos(pos);
	$('body').prepend(this.DT);

}

Tile.prototype.setPos = function(pos){
	var posL = calc(parseInt(pos/10),this.grd.wCol, this.gp, 0);
	var posT = calc(parseInt(pos%10),this.grd.hRow, this.gp, 0);
	this.DT.css({'left':posL, 'top':posT});
}

Tile.prototype.findMyPlace = function(ar){
	var type = this.DT.attr('class');
	for(var i in ar){
		var item = ar[i]
			,left = item+10
			,bottom = item+1
			,leftBottom = item+11
			;
			ar.indexOf(left);

		switch(type){
			case 'doisdois':
				if(ar.indexOf(left) != -1 && ar.indexOf(bottom) != -1 && ar.indexOf(leftBottom) != -1){
					this.addTile(item);
					removeFreeSpace([item ,left,bottom,leftBottom]);
					return;
				}
				break;

			case 'doisum':
				if(ar.indexOf(left) != -1){
					this.addTile(item);
					removeFreeSpace([item , left]);
					return;
				}
				break;

			case 'vertical':
				if(ar.indexOf(bottom) != -1){
					this.addTile(item);
					removeFreeSpace([item, bottom]);
					return;
				}
				break;
		}
	}
}

Tile.prototype.manualAdd = function(pos){
	this.addTile(pos);
	removeFreeSpace([pos, pos+10, pos+20, pos+30, pos+40]);
}

Tile.prototype.bgColor = function(c){
	this.DT.css('background', c);
}

//********
// utils
//********

var cont = 0;
var ocupation;
var ocupVal;
var leTipo = ['doisdois', 'doisum','vertical'];
var pColors = ['#e21c22', '#69911c', '#7d539a', '#005990', '#e77120']; // vermelho, verde, roxo, azul, laranja
// verificar se geralTranslateType não for usado fora de Tile, transformar em uma função do Construtor Tile;
function geralTranslateType(t){

	switch(t){
		case 'doisdois':
			return {w:2,h:2};
			break;

		case 'doisum':
			return {w:2,h:1};
			break;

		case 'vertical':
			return {w:1,h:2};
			break;

		case 'um':
			return {w:1, h:1};
			break;

		case 'titulo':
			return {w:5,h:1};
			break;
	}
}

function calc(n, d, p, ad){
	return n*d + (n+ad)*p;
}

function setOcupation(row, col, sizeRow, sizeCol){
	// marcando o ponto de origem como ocupado
	// marcando os slots adjacentes que foram ocupados pela dimensão do Tile
	// precisa disso?
	var c, r, eX, eY;
	for(eX=0; eX < sizeCol; eX++){
		for(eY=0; eY <sizeRow; eY++){
			c = col+eX;
			r = row+eY;
			ocupation[c][r] = true;
		}
	}
}

function removeFreeSpace(a){
	for(var i=0 in a){
		var t = ocupVal.indexOf(a[i]);
		ocupVal.splice(t,1);
	}
}