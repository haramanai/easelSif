/*
* Copyright (c) 2014 haramanai.
* rotate
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
function rotate() {
	this.type = 'rotate';
}

var p = rotate.prototype = new createjs.Container();
p.getConcatenatedMatrix = easelSif.group.prototype.getConcatenatedMatrix;
p.updateContext = easelSif.group.prototype.updateContext;
	/** 
	 * Initialization method.
	 * @method init
	 * @param {Object} parent The parent of the Layer
	 * @param {Object} data The data for the Layer
	 **/
	p.init = function (sifobj, data) {
		this.sifobj = sifobj;
		var _set = easelSif.param._set;
		this.initialize();
		this.timeline = new createjs.Timeline();
		this.timeline.setPaused(true);
		this.timeline.duration = this.sifobj.timeline.duration;

		this._setParams(data);
		easelSif._addToDesc(this, data);
		
		this.getMatrix();

	}
	
	p._setParams = function (data) {
		var _set = easelSif.param._set;
		_set(this, 'origin', 'vector', this, data.origin);
		_set(this, 'amount', 'angle', this, data.amount);		
	}
	
	p.setPosition = easelSif.group.prototype.setPosition;


	p.updateContext = function (ctx) {
		var mtx = this.getMatrix();		

		ctx.transform(mtx.a, mtx.b, mtx.c, mtx.d, mtx.tx, mtx.ty);
	}
	
	p.getMatrix = function (matrix) {
		var orx = this.origin.getX();
		var ory = this.origin.getY();
		var angle = this.amount.getValue();
		matrix = (matrix ? matrix.identity() : new createjs.Matrix2D())
		matrix.appendTransform(orx, ory, 1, 1, angle, 0,0,orx,orx);
		
		return matrix;
	}

easelSif.rotate = rotate;
}());
