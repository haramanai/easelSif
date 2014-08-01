/*
* Copyright (c) 2014 haramanai.
* fakeswitch
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
* @extends Shape
* @constructor
**/	
function FakeSwitch(group, frame_rate) {
	this.type = 'fakeswitch';
	this.init(group, frame_rate);
}

var p = FakeSwitch.prototype = new createjs.Bitmap();
p.getConcatenatedMatrix = easelSif.group.prototype.getConcatenatedMatrix;
//p.getConcatenatedMatrix = easelSif.group.prototype.getConcatenatedMatrix;
	
	/** 
	 * Initialization method.
	 * @method init
	 * @param {Object} parent The parent of the Layer
	 * @param {Object} data The data for the Layer
	 **/
	p.init = function (group, frame_rate) {
		frame_rate = (frame_rate)? frame_rate:30;
		this.timeline = new createjs.Timeline();
		this.timeline.duration = group.timeline.duration;
		var secs = 1000 / frame_rate;
		this.animated = true;
		this.frame_rate = frame_rate;
		this.frames = [];
		group.setPosition(0);
		for (var i = 0, ii = group.timeline.duration; i < ii; i = i + secs) {
			var f = {};
			var canvas = f.cacheCanvas = document.createElement('canvas');
			var ctx = canvas.getContext('2d');
			group.setPosition(i);
			if (group.animated) {
				var ab = group.getBounds();
				var scale = Math.abs(easelSif.getTotalScale(group));
				group.cache(ab.x , ab.y, ab.width, ab.height, scale);
				
				this._setFrameData(ab.x, ab.y, ab.width, ab.height, scale, f);
				var cacheCanvas = group.cacheCanvas;
				
				canvas.height = cacheCanvas.height;
				canvas.width = cacheCanvas.width;
				ctx.drawImage(cacheCanvas, 0, 0);
				this.frames.push(f);
			} else {
				this.frames.push(this.frames[this.frames.length - 1]);
			}
			
		}
		this.frame = this.frames[0];
		this.image = this.frame.cacheCanvas;
		
		
		//this._setCacheData(this.frames[0]);

		
		console.log(this);
	}
	
	p.setPosition = function (position) {
		this.timeline.setPosition(position);
		var npos = this.timeline.position;
		var f = Math.floor(this.frame_rate / 1000 * npos );
		this.frame = this.frames[f]
		this.image = this.frame.cacheCanvas;
		return position;
	}
	
	p._setFrameData = function (x, y, width, height, scale, that) {
		that = (that)?that:this;
		if (isNaN(x)) {
			that.width = x._cacheWidth;
			that.height = x._cacheHeight;
			that.x = x._cacheOffsetX;
			that.y = x._cacheOffsetY;
			that.scale = x._cacheScale;

		} else {
			
			that.width = width;
			that.height = height;
			that.x = x;
			that.y = y;
			that.scale = scale;
		}
	}
	
	p.getMatrix = function (matrix) {
		var that = this;		
		var orx = -this.frame.x;
		var ory = -this.frame.y;
		var scale = 1 / this.frame.scale;
		var width = this.frame.width;
		var height = this.frame.height;
		
		return (matrix ? matrix.identity() : new createjs.Matrix2D()).appendTransform(-orx + this.x, -ory + this.y, scale, scale, 0, 0,0,0,0);	
	}
	
	/*
	 * this is a copy of the method from easeljs.DisplayObject the only dif is the line mtx = o.getMatrix()
	 */
	p.updateContext = function(ctx) {
		var mtx, mask=this.mask, o=this;
		
		if (mask && mask.graphics && !mask.graphics.isEmpty()) {
			mtx = mask.getMatrix(mask._matrix);
			ctx.transform(mtx.a,  mtx.b, mtx.c, mtx.d, mtx.tx, mtx.ty);
			
			mask.graphics.drawAsPath(ctx);
			ctx.clip();
			
			mtx.invert();
			ctx.transform(mtx.a,  mtx.b, mtx.c, mtx.d, mtx.tx, mtx.ty);
		}
		
		mtx = o.getMatrix();
		// TODO: should be a better way to manage this setting. For now, using dynamic access to avoid circular dependencies:
		if (createjs["Stage"]._snapToPixelEnabled && o.snapToPixel) { ctx.transform(mtx.a,  mtx.b, mtx.c, mtx.d, mtx.tx+0.5|0, mtx.ty+0.5|0); }
		else { ctx.transform(mtx.a,  mtx.b, mtx.c, mtx.d, mtx.tx, mtx.ty); }
		ctx.globalAlpha *= o.alpha;
		if (o.compositeOperation) { ctx.globalCompositeOperation = o.compositeOperation; }
		if (o.shadow) { this._applyShadow(ctx, o.shadow); }
	};




	


easelSif.FakeSwitch = FakeSwitch;
}());
