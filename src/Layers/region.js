/*
* Copyright (c) 2014 haramanai.
* region
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
function region(sifobj, data) {
	this.sifobj = sifobj;
	this.init(data);
}

var p = region.prototype = new createjs.Shape();
	
	/** 
	 * Initialization method.
	 * @method init
	 * @param {Object} parent The parent of the Layer
	 * @param {Object} data The data for the Layer
	 **/
	p.init = function (data) {

		var _set = sifPlayer.param._set;
		this.initialize()
		
		this.timeline = new createjs.Timeline();
		this.timeline.setPaused(true);
		
		this._getBline(data.bline);
		
		_set(this, 'blend_method', 'integer', this, data.blend_method);
		_set(this, 'amount', 'real', this, data.amount);
		_set(this, 'origin', 'vector', this, data.origin);
		_set(this.bline, 'color', 'color', this, data.color);
		if (data.width) { _set(this.bline, 'width', 'real', this, data.width); }
		
		
		sifPlayer._addToDesc(this, data);

		this.entries = this.collectEntries();
		this.makeShape();
		this.aabb = sifPlayer.aabbFromEntries(this.entries , (this.width)?this.width.getValue():null);


	}



	/**
	 * Gets the bline data
	 * @method _getBline
	 **/		
	p._getBline = function (data) {
		var _set = sifPlayer.param._set;
		this.bline = {};
		this.bline.sifobj = this.sifobj;
		this.bline.timeline = new createjs.Timeline();
		this.bline.timeline.setPaused(true);
		
		this.bline.entry = [];
		var w, tw;

		//LOOP
		this.bline.loop = data.bline._loop;
		
		for (var i = 0, ii = data.bline.entry.length; i < ii; i++) {
			
			var e = {};
			//if (data.bline.entry[i].composite.point.composite) alert('in');
			_set(this.bline, 'composite', 'composite', e, data.bline.entry[i]);
			this.bline.entry.push(e.composite);
			
		}
		//alert(JSON.stringify(this.bline.entry[2]));
	}
	
		/**
	 * Collect the Entries of the bline and sets aabb
	 * @method draw
	 * @param {CanvasRenderingContext2D} } ctx The canvas 2D context object to draw into.
	 **/	
	p.collectEntries = function () {
		var e = [];
		var e1, e2;
		
		e1 = this.bline.entry[0].composite.getPoint();
		e.push([e1.getX(), e1.getY()]);
	
		for (var i = 0, ii = this.bline.entry.length - 1; i !== ii; i++) {
			
			e1 = this.bline.entry[i].composite;
			e2 = this.bline.entry[i + 1].composite;
			

			if (e1.split.getValue()) {
				e.push(this._bezierEntry( e1.getPoint(), e2.getPoint(), e1.getT2(), e2.getT1()));
			} else {
				e.push(this._bezierEntry( e1.getPoint(), e2.getPoint(), e1.getT1(), e2.getT1()));

			}

		}
		if (this.bline.loop) {
			e1 = this.bline.entry[ this.bline.entry.length - 1 ].composite;
			e2 = this.bline.entry[0].composite;
			
			if (e1.split.getValue()) {
				e.push(this._bezierEntry( e1.getPoint(), e2.getPoint(), e1.getT2(), e2.getT1()));
			} else {
				e.push(this._bezierEntry( e1.getPoint(), e2.getPoint(), e1.getT1(), e2.getT1()));
			}
		}

		return e;
	}
	
	p._bezierEntry= function (_p1, _p2, _t1, _t2) {
		
		var _cp1 = {};
		var _cp2 = {};

		_cp1.x = _t1.x + _p1.getX();
		_cp1.y = _t1.y + _p1.getY();

		_cp2.x = -_t2.x + _p2.getX();
		_cp2.y = -_t2.y + _p2.getY();

		//ctx.bezierCurveTo(_cp1.x, _cp1.y, _cp2.x, _cp2.y, _p2.getX(), _p2.getY());
		return [_cp1.x, _cp1.y, _cp2.x, _cp2.y, _p2.getX(), _p2.getY()];
	}

	p.makeShape = function () {
		var e = this.entries;
		var g = this.graphics;
		g.clear();
		g.f( createjs.Graphics.getRGB( Math.round(this.color.r * 256),Math.round(this.color.g * 256),Math.round(this.color.b * 256), this.color.a) );
		
		g.mt( e[0][0], e[0][1] );
		for (var i = 1, ii = e.length; i !== ii; i++) {			
			g.bt(e[i][0], e[i][1], e[i][2], e[i][3], e[i][4], e[i][5]);
			
		}
		g.ef();
		
	}
	
	p.setPosition = function (position, delta) {
		this.timeline.setPosition(position);
		this.bline.timeline.setPosition(position);
		this.animated = false;
		this.updateShape();
		return position;
	}
	
	p.updateShape = function () {
		var e, aabb;
		var scale = Math.abs(sifPlayer.easelSif.getTotalScale(this));
		var width = (this.width) ? this.width.getValue() : null; 
		//this.checkBline(); 
		if (this.bline.animated || !this.cacheID) {
			e = this.collectEntries();
			if (!this.cacheID) {				
				this.entries = e;
				this.aabb = sifPlayer.aabbFromEntries(e, width);
				this.makeShape();
			} else {
				this.uncache();
				this.entries = e;
				this.aabb = sifPlayer.aabbFromEntries(e, width);
				this.makeShape();
				
			}
		}
		 
		 
		e = this.entries;
		aabb = this.aabb;
		
		if (!this.cacheID) {
			this.animated = true;	
			this.scale = scale;

			this.setBounds(aabb[0] , aabb[1], aabb[2] - aabb[0], aabb[3] - aabb[1]);

		}

			
		
	}
	
	p.compareEntries = function (e2) {
		var e1 = this.entries;
		if (this.entries) {
			
			if (e1[0][0] !== e2[0][0]) return false;
			if (e1[0][1] !== e2[0][1]) return false;
			for (var i = 1, ii = e1.length; i < ii; i++) {
				if (e1[i][0] !== e2[i][0]) return false;
				if (e1[i][1] !== e2[i][1]) return false;
				if (e1[i][2] !== e2[i][2]) return false;
				if (e1[i][3] !== e2[i][3]) return false;
				if (e1[i][4] !== e2[i][4]) return false;
				if (e1[i][5] !== e2[i][5]) return false;
			}
		} else {
			return false;
		}
		return true;
	}
	
	p.updateContext = function (ctx) {	
		var that = this;		
		var orx = this.origin.getX();
		var ory = this.origin.getY();
		var mtx = this._matrix.identity().appendTransform(orx, ory, 1, 1, 0, 0,0,0,0);
		ctx.globalAlpha *= that.amount.getValue();
		ctx.globalCompositeOperation = sifPlayer.easelSif._getBlend( that.blend_method.getValue() );
		ctx.transform(mtx.a, mtx.b, mtx.c, mtx.d, mtx.tx, mtx.ty);
	}
	
	p.checkBline = function () {
		this.bline.animated = false;
		var bl = this.bline;
		var tl = bl.timeline;
		var tw = tl._tweens;
		var pos = tl.position;
		var step
		
		if (tw) {	
			/*
			for (var i = 0, ii = tw.length; i < ii; i++) {
				for (var j = 0, jj = tw[i]._steps.length; j < jj; j++) {
					step = tw[i]._steps[j];
					if (pos >= step.t && pos < step.d) {
						this.animated = true;
					}
				}
				
			}
			*/
			this.bline.animated = true;
		}
		//this.bline.animated = true;
		//console.log(t);
	}

	


sifPlayer.easelSif.region = region;
}());
