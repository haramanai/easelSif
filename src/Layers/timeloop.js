/*
* Copyright (c) 2014 haramanai.
* timeloop
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
* @class timeloop
* @extends Layer
* @constructor
* @param {Object} parent The parent of the Layer
* @param {Object} data The data for the Layer
**/	 	
function timeloop(sifobj , data) {
	this.DisplayObject_constructor();
	this.type = 'timeloop';
	if (data) this.init(sifobj , data);
}

var p = createjs.extend(timeloop, createjs.DisplayObject);


	/** 
	 * Initialization method.
	 * @method init
	 * @param {Object} parent The parent of the Layer
	 * @param {Object} data The data for the Layer
	 **/
	p.init = function (sifobj, data) {
		this.sifobj = sifobj;
		var _set = easelSif.param._set;	
		this.name = (data._desc)?data._desc:data._type;
		this.timeline = new createjs.Timeline();
		this.timeline.setPaused(true);
		this.timeline.duration = this.sifobj.timeline.duration;
		
		
		_set(this, 'link_time', 'integer', this, data.link_time);
		_set(this, 'local_time', 'integer', this, data.local_time);
		_set(this, 'duration', 'integer', this, data.duration);
		
		easelSif._addToDesc(this, data);
		
	};
	
	
	/**
	 * moves the time line of the layer to the position
	 * @method goto
	 **/		
	p.setPosition = function (position) {
		this.timeline.tick( position - this.timeline.position);
		
		var duration = this.duration.getValue();
		var link_time = this.link_time.getValue();
		var local_time = this.local_time.getValue();
		var new_pos = (position + local_time) % duration;
		if (duration != 0) {
			if (duration > 0) {	
				new_pos += link_time;
			} else {
				new_pos = link_time - new_pos;
			}
		} else {
			new_pos = link_time;
		}

		
		return new_pos;
	}
	
	
	



easelSif.timeloop = createjs.promote(timeloop , 'DisplayObject');
}());

