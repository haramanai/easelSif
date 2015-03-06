/*
* Copyright (c) 2014 haramanai.
* version 0.1.2
* circle
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
* @class circle
* @extends Layer
* @constructor
* @param {Object} parent The parent of the Layer
* @param {Object} data The data for the Layer
**/	 	
function circle(sifobj, data) {
	this.Shape_constructor();
	this.sifobj = sifobj;
	this.transformMatrix = new createjs.Matrix2D();
	this.init(data);
	this.amount = null;
	this.origin = null;
	this.radius = null;
	this.blend_method = null;
	this.color = null;
	
	if (data) this.init(data);
	
}

var p = createjs.extend(circle , createjs.Shape);

	/** 
	 * Initialization method.
	 * @method init
	 * @param {Object} parent The parent of the Layer
	 * @param {Object} data The data for the Layer
	 **/
	p.init = function (data) {
		var _set = easelSif.param._set;
		this.timeline = new createjs.Timeline();
		this.timeline.setPaused(true);
		this.timeline.duration = this.sifobj.timeline.duration;

		_set(this, 'amount', 'real', this, data.amount);
		_set(this, 'origin', 'vector', this, data.origin);	
		_set(this, 'radius', 'real', this, data.radius);
		_set(this, 'blend_method', 'integer', this, data.blend_method);
		_set(this, 'color', 'color', this, data.color);
		
		easelSif._addToDesc(this, data);
		
		this.makeShape();
		this.setTransformMatrix();
	}

	
	p.makeShape = function () {
		var g = this.graphics;
		this.rad = this.radius.getValue();
		this.r = this.color.r;
		this.g = this.color.g
		this.b = this.color.b
		this.a = this.color.a
		
		g.f( createjs.Graphics.getRGB( Math.round(this.r * 256),Math.round(this.g * 256),Math.round(this.b * 256), this.a) );
		g.dc( 0, 0, this.rad);
		g.ef();
		
	}
	
	p.setPosition = function (position) {
		this.timeline.setPosition(position);
		this.setTransformMatrix();
		return position;
	}
	

	
	p.setTransformMatrix = function () {		
		this.transformMatrix.identity().appendTransform(this.origin.getX(), this.origin.getY(), 1, 1, 0, 0,0,0,0);
	}


easelSif.circle = createjs.promote(circle, "Shape");
}());
