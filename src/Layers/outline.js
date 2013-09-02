/*
* Copyright (c) 2012 haramanai.
* outline
* Permission is hereby granted, free of charge, to any person
* obtaining a copy of this software and associated documentation
* files (the "Software"), to deal in the Software without
* restriction, including without limitation the rights to use,
* copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the
* Software is furnished to do so, subject to the following
* conditions:
* 
* The above copyright notice and this permission notice shall be
* included in all copies or substantial portions of the Software.
* 
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
* EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
* OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
* NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
* HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
* WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
* FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
* OTHER DEALINGS IN THE SOFTWARE.
*/
(function() { 

/**
* @class region
* @extends Layer
* @constructor
* @param {Object} parent The parent of the Layer
* @param {Object} data The data for the Layer
**/	
function outline(sifobj, data) {
	this.sifobj = sifobj;
	this.init(data);
}

var p = outline.prototype = new createjs.Shape();

p.init = easelSif.region.prototype.init;

p._getBline = easelSif.region.prototype._getBline;

p.collectEntries = easelSif.region.prototype.collectEntries;

p.compareEntries = easelSif.region.prototype.compareEntries;

p._bezierEntry = easelSif.region.prototype._bezierEntry;

p.setPosition = easelSif.region.prototype.setPosition;

p.updateShape = easelSif.region.prototype.updateShape;

p.updateValuesRegion = easelSif.region.prototype.updateValues;

p.updateValues = function () {
	this.updateValuesRegion();
}



p.makeShape = function () {
	var e = this.entries;
	var g = this.graphics;
	g.clear();
	g.setStrokeStyle( this.width.getValue() ); //To change
	g.s( createjs.Graphics.getRGB( Math.round(this.color.r * 256),Math.round(this.color.g * 256),Math.round(this.color.b * 256), this.color.a) );
	
	g.mt( e[0][0], e[0][1] );
	for (var i = 1, ii = e.length; i !== ii; i++) {			
		g.bt(e[i][0], e[i][1], e[i][2], e[i][3], e[i][4], e[i][5]);
		
	}
	g.es();
	
}




easelSif.outline = outline;
}());
