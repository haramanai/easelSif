/*
* Copyright (c) 2014 haramanai.
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
	'use strict'
	this.region_constructor(sifobj, data);
	
}

var p = createjs.extend(outline, easelSif.region);


p.makeShape = function () {
	var e = this.entries;
	var g = this.graphics;
	
	var aabb = easelSif.aabbFromEntries(this.entries , this.width.getValue());
	this.setBounds(aabb[0] , aabb[1], aabb[2] - aabb[0], aabb[3] - aabb[1]);
	
	g.clear();
	g.setStrokeStyle( this.width.getValue() , "round" ); //To change
	g.s( createjs.Graphics.getRGB( Math.round(this.color.r * 256),Math.round(this.color.g * 256),Math.round(this.color.b * 256), this.color.a) );
	
	g.mt( e[0][0], e[0][1] );
	for (var i = 1, ii = e.length; i !== ii; i++) {			
		g.bt(e[i][0], e[i][1], e[i][2], e[i][3], e[i][4], e[i][5]);
		
	}
	g.es();
	
}




easelSif.outline = createjs.promote(outline, 'region');
}());
