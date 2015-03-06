/*
* Copyright (c) 2014 haramanai.
* stretch
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
* @class rotate
* @extends Layer
* @constructor
* @param {Object} parent The parent of the Layer
* @param {Object} data The data for the Layer
**/	 	
function stretch(sifobj, data) {
	this.type = 'stretch';
	this.rotate_constructor(sifobj , data);

}

var p = createjs.extend(stretch, easelSif.rotate);

	
	p._setParams = function (data) {
		var _set = easelSif.param._set;
		_set(this, 'amount', 'vector', this, data.amount);
		_set(this, 'center', 'vector', this, data.center);
		
		
	}
	
	
	p.getMatrix = function (matrix) {
		var that = this;		
		var orx = this.center.getX();
		var ory = this.center.getY();
		var sx = this.scaleX = this.amount.getX();
		var sy = this.amount.getY();
		matrix = (matrix ? matrix.identity() : new createjs.Matrix2D())
		matrix.appendTransform(orx, ory, sx, sy, 0, 0,0,orx,orx);

		return matrix;
	}
		

easelSif.stretch = createjs.promote(stretch, 'rotate');
}());
