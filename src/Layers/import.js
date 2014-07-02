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
function Import (sifobj, data) {
	this.sifobj = sifobj;
	this.init(data);
}

var p = Import.prototype = new createjs.Bitmap();

	/** 
	 * Initialization method.
	 * @method init
	 * @param {Object} parent The parent of the Layer
	 * @param {Object} data The data for the Layer
	 **/
	p.init = function (data) {
		var _set = sifPlayer.param._set;
		this.initialize(this.sifobj.sifPath + data.filename.string)
		this.timeline = new createjs.Timeline();
		this.timeline.setPaused(true);
		
		_set(this, 'amount', 'real', this, data.amount);
		_set(this, 'blend_method', 'integer', this, data.blend_method);
		_set(this, 'tl', 'vector', this, data.tl);
		_set(this, 'br', 'vector', this, data.br);
		
		sifPlayer._addToDesc(this, data);
		

		
	}
	
// public methods:

	p.setPosition = function (position, delta) {
		this.timeline.setPosition(position);
		return position;
	}
	
	
	p.updateContext = function (ctx) {
		var that = this;
		var brx = this.br.getX();
		var bry = this.br.getY();
		var tlx = this.tl.getX();
		var tly = this.tl.getY();
		var w,h,sx,sy;
		
		if (brx !== this.brx || bry !== this.bry || tlx !== this.tlx || tly !== this.tly) {
			this.brx = brx; this.bry = bry; this.tlx = tlx; this.tly = tly;
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
			
			this.x = tlx;
			this.y = tly;
			this.scaleX = sx / this.image.width * w;
			this.scaleY = sy / this.image.height * h;
			
			
		}
		
		var mtx = this._matrix.identity().appendTransform(tlx, tly, sx, sy, 0, 0,0,0,0);
		ctx.transform(mtx.a, mtx.b, mtx.c, mtx.d, mtx.tx, mtx.ty);
		ctx.globalAlpha *= that.amount.getValue();
		ctx.globalCompositeOperation = sifPlayer.easelSif._getBlend( that.blend_method.getValue() );

		
	}
	

sifPlayer.easelSif.Import = Import;
}());
