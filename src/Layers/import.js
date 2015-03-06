/*
* Copyright (c) 2014 haramanai.
* import
* version 0.1.3
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
* It's the import layer but it's name Imoprt cause import is reserved word
* @class Import
* @extends Layer
* @constructor
* @param {Object} parent The parent of the Layer
* @param {Object} data The data for the Layer
**/	 
function Import (sifobj , data) {
	this.Bitmap_constructor();
	
	if (data) this.init(sifobj , data);
}

var p = createjs.extend(Import , createjs.Bitmap);

p.getConcatenatedMatrix = easelSif.group.prototype.getConcatenatedMatrix;
	/** 
	 * Initialization method.
	 * @method init
	 * @param {Object} parent The parent of the Layer
	 * @param {Object} data The data for the Layer
	 **/
	p.init = function (sifobj, data) {
		this.sifobj = sifobj;
		var preload = this.sifobj.preload;
		var _set = easelSif.param._set;
		var filename = data.filename.string;
		this.image = preload.getResult(this.sifobj.sifPath + filename);
		
		
		this.timeline = new createjs.Timeline();
		this.timeline.setPaused(true);
		
		_set(this, 'amount', 'real', this, data.amount);
		_set(this, 'blend_method', 'integer', this, data.blend_method);
		_set(this, 'tl', 'vector', this, data.tl);
		_set(this, 'br', 'vector', this, data.br);
		
		easelSif._addToDesc(this, data);
		
	}
	
// public methods:

	p.setPosition = function (position, delta) {
		this.timeline.setPosition(position);
		return position;
	}
	
	p.updateContext = function (ctx) {
		var that = this;
		var mtx = this.getMatrix(this._matrix);
		ctx.transform(mtx.a, mtx.b, mtx.c, mtx.d, mtx.tx, mtx.ty);
		ctx.globalAlpha *= that.amount.getValue();
		ctx.globalCompositeOperation = easelSif._getBlend( that.blend_method.getValue() );

		
	}
	
	p.getMatrix = function (matrix) {
		var that = this;
		var brx = this.br.getX();
		var bry = this.br.getY();
		var tlx = this.tl.getX();
		var tly = this.tl.getY();
		var w,h,sx,sy;
		
		w =  (brx - tlx);
		h = (tly - bry)

		if (w <= 0) {
			sx = -1;
			w *=-1;
		} else {
			sx = 1;
		}
		
		if (h <= 0) {
			sy = 1
			h *=-1;
		} else {
			sy = -1;
		}
		

		sx = sx / this.image.width * w;
		sy = sy / this.image.height * h;
			
			

		matrix = (matrix ? matrix.identity() : new createjs.Matrix2D())
		matrix.appendTransform(tlx, tly, sx, sy, 0, 0,0,0,0);

		return matrix;		
	}

	
easelSif.Import = createjs.promote(Import, 'Bitmap');
}());
