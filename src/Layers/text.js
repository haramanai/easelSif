/*
* Copyright (c) 2012 haramanai.
* version 0.1.
* text
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
function text(sifobj, data) {
	this.sifobj = sifobj;
	this.init(data);
}

var p = text.prototype = new createjs.Text();

	/** 
	 * Initialization method.
	 * @method init
	 * @param {Object} parent The parent of the Layer
	 * @param {Object} data The data for the Layer
	 **/
	p.init = function (data) {
		var _set = sifPlayer.param._set;
		
		this.timeline = new createjs.Timeline();
		this.timeline.setPaused(true);

		_set(this, 'amount', 'real', this, data.amount);
		_set(this, 'blend_method', 'integer', this, data.blend_method);
		_set(this, 'text', 'string', this, data.text);	
		_set(this, 'color', 'color', this, data.color);
		_set(this, 'family', 'string', this, data.family);
		_set(this, 'style', 'integer', this, data.style);
		_set(this, 'weight', 'integer', this, data.weight);
		_set(this, 'compress', 'real', this, data.compress);
		_set(this, 'vcompress', 'real', this, data.vcompress);
		_set(this, 'size', 'vector', this, data.size);
		_set(this, 'orient', 'vector', this, data.orient);
		_set(this, 'origin', 'vector', this, data.origin);
		
		sifPlayer._addToDesc(this, data);
		
		var s = easelSif.getTotalScale(this);
		this.initialize(this.text.string, '10px ' + this.family.string, "#ff7700");
		this.textAlign = 'center';
		this.textBaseline = 'middle';
		//float sizex=1.75*fabs(size[0])*fabs(wsx);
		//float sizey=1.75*fabs(size[1])*fabs(wsy);
		//float vscale=sizey/sizex;
		this.scaleX = 1.75 * Math.abs(this.size.getX()) * this.scaleX /  10;
		this.scaleY = -1.75 * Math.abs(this.size.getY()) * this.scaleY /  10;
		this.x = this.origin.getX();
		this.y = this.origin.getY();
		this.regX = -this.orient.getX() * this.scaleX * 10;
		this.regY = this.orient.getY() * this.scaleY * 10;
		//this.scaleX = this.size.getX();
		//this.scaleY = -this.size.getY();
		this.updateValues();
		
	}

	
	p.getAlling = function () {
		// New expanded workdesc values
		var obj = this.sifobj;
		var ww = this.sifobj.width;
		var wh = this.get_h();
		var wtlx=workdesc.get_tl()[0];
		var wtly=workdesc.get_tl()[1];
		var wpw=workdesc.get_pw();
		var wph=workdesc.get_ph();
		var wsx=1/wpw;
		var wsy=1/wph;
		var wtx=(-wtlx+origin[0])*wsx;
		var wty=(-wtly+origin[1])*wsy;
				
	}
	
	p.setPosition = function (position) {
		this.timeline.setPosition(position);
		this.updateValues();
		return position;
	}
	
	p.updateValues = function () {
		//this.x = this.origin.getX();
		//this.y = this.origin.getY();
		this.alpha = this.amount.getValue();
		this.compositeOperation = easelSif._getBlend( this.blend_method.getValue() );
		
	}


sifPlayer.easelSif.text = text;
}());
