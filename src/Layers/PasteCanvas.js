/*
* Copyright (c) 2012 haramanai.
* PasteCanvas
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
* @class PasteCanvas
* @extends Layer
* @constructor
* @param {Object} parent The parent of the Layer
* @param {Object} data The data for the Layer
**/	 	
function PasteCanvas(sifobj, data) {
	this.sifobj = sifobj;
	this.init(data);
}

var p = PasteCanvas.prototype = new createjs.Container();
	
	/** 
	 * Initialization method.
	 * @method init
	 * @param {Object} parent The parent of the Layer
	 * @param {Object} data The data for the Layer
	 **/
	p.init = function (data) {
		
		var _set = easelSif.param._set;
		this.initialize()
		this.timeline = new createjs.Timeline();
		this.timeline.duration = this.sifobj.timeline.duration;
		this.timeline.setPaused(true);

		_set(this, 'amount', 'real', this, data.amount);
		_set(this, 'blend_method', 'integer', this, data.blend_method);
		_set(this, 'origin', 'vector', this, data.origin);
		_set(this, 'zoom', 'real', this, data.zoom);
		_set(this, 'focus', 'vector', this, data.focus);

		if (data._desc) {
			this.name = data._desc;
			//keep refernce of the layer to the sifobj so we can reach it.
			this.sifobj.desc[this.name] = this;
			
		}
		
		this._getLayers(data.canvas.canvas.layer);
		this.updateValues();
		
	}
	
	p._getLayers = easelSif.SifObject.prototype._getLayers;
	
	p.moveChildrenTo = easelSif.SifObject.prototype.moveChildrenTo;
	
	p.updateValues = function () {
		//NO FOCUS!
		var zoom = Math.exp( this.zoom.getValue() );
		var fx = this.focus.getX();
		var fy = this.focus.getY();
		var ox = this.origin.getX();
		var oy = this.origin.getY();
		
		//var m = this.mat = new createjs.Matrix2D(1, 0, 0, 1, 0, 0);
		//console.log(zoom);
		/*
		m.translate(this.focus.getX(), this.focus.getY());
		m.scale( zoom );
		m.translate(-this.focus.getX(), -this.focus.getY());
		m.translate(this.origin.getX() / zoom, this.origin.getY() / zoom);
		
		this.setTransform(m.tx, m.ty, m.a , m.d, 0, 0, 0, 0	);
		*/
		this.x = fx;
		this.y = fy;
		
		this.scaleX = zoom;
		this.scaleY = zoom;
		
		this.regX = fx - ox / zoom;
		this.regY = fy - oy / zoom;
		
	}


	/**
	 * moves the time line of the layer to the position
	 * @method setPosition
	 * param {Integer}
	 **/		
	p.setPosition = function (position) {	
			
		this.timeline.setPosition(position);
		this.updateValues();
		var new_pos = this.timeline.position;
		for (var i = 0, ii = this.children.length; i < ii; i++) {
			new_pos = this.children[i].setPosition(new_pos);
		}
		
		return position;
	}
	
	


easelSif.PasteCanvas = PasteCanvas;
}());
