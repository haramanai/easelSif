/*
* Copyright (c) 2012 haramanai.
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
function rotate(sifobj, data) {
	this.sifobj = sifobj;
	this.init(data);
}

var p = rotate.prototype = new createjs.Container();

	/** 
	 * Initialization method.
	 * @method init
	 * @param {Object} parent The parent of the Layer
	 * @param {Object} data The data for the Layer
	 **/
	p.init = function (data) {
		var _set = easelSif.param._set;
		this.initialize();
		this.timeline = new createjs.Timeline();
		this.timeline.duration = this.sifobj.timeline.duration;
		this.timeline.setPaused(true);
		
		_set(this, 'origin', 'vector', this, data.origin);
		_set(this, 'amount', 'angle', this, data.amount);
		
		this.updateValues();
	}

	
	p.setPosition = function (position) {	
			
		this.timeline.setPosition(position);
		this.updateValues();
		var ch = this.children;
		for (var i = 0, ii = ch.length; i < ii; i++) {

			position = ch[i].setPosition(position);
		}
		
		return position;
	}
	
	p.updateValues = function () {
		this.x = this.origin.getX();
		this.y = this.origin.getY();
		this.rotation = this.amount.getValue();
		this.regX = this.origin.getX();
		this.regY = this.origin.getY();


		
		
	}

easelSif.rotate = rotate;
}());
