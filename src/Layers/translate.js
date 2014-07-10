/*
* Copyright (c) 2014 haramanai.
* translate
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
function translate(sifobj, data) {
	this.sifobj = sifobj;
	this.init(data);
}

var p = translate.prototype = new createjs.Container();

	/** 
	 * Initialization method.
	 * @method init
	 * @param {Object} parent The parent of the Layer
	 * @param {Object} data The data for the Layer
	 **/
	p.init = function (data) {
		var _set = sifPlayer.param._set;
		this.initialize();
		this.timeline = new createjs.Timeline();
		this.timeline.duration = this.sifobj.timeline.duration;
		this.timeline.setPaused(true);

		
		_set(this, 'origin', 'vector', this, data.origin);
		
		sifPlayer._addToDesc(this, data);

	}

	
	p.setPosition = sifPlayer.easelSif.group.prototype.setPosition;

	
	p.updateContext = function (ctx) {
		var mtx = this.getMatrix(this._matrix);
		ctx.transform(mtx.a, mtx.b, mtx.c, mtx.d, mtx.tx, mtx.ty);

	}
	
	p.getMatrix = sifPlayer.easelSif.region.prototype.getMatrix;

sifPlayer.easelSif.translate = translate;
}());
