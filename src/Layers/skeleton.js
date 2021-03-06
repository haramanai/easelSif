/*
* Copyright (c) 2014 haramanai.
* skeleton
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
* @class skeleton
* @extends Layer
* @constructor
* @param {Object} parent The parent of the Layer
* @param {Object} data The data for the Layer
**/	

 
function skeleton(sifobj , data) {
	this.DisplayObject_constructor();
	this.type = 'skeleton';
	if (data) this.init(sifobj , data);
}

var p = createjs.extend(skeleton, createjs.DisplayObject);

	p.init = function (sifobj, data) {
		this.sifobj = sifobj;
		var _set = easelSif.param._set;

		_set(this, 'amount', 'real', this, data.amount);

		//console.log(JSON.stringify(data));
		this._getBones(data.bones);
		easelSif._addToDesc(this, data);
		//this.setPosition(0);

	}
	
	p._getBones = function (data) {
		//this.bones = {};
		var eout = [];
		var e = data.static_list.entry;
		for (var i = 0, ii = e.length; i < ii; i++) {
			eout[i] = e[i].bone[0]._guid;
		}

		this.bones = eout;
		
	}
	
	
	
	p.setPosition = function (position) {
		//console.log(this.sifobj);
		var guid = this.sifobj.sif.bones.guid;
		var bones = this.bones;
		var check = false;
		for (var i = bones.length - 1, ii = 0; i >= ii; i--) {
			guid[bones[i]].setPosition(position);
			//check = guid[bones[i]].animated = easelSif._checkTimeline(guid[bones[i]].timeline);
		}
		this.animated = true;
		return position;
		
	}
	



easelSif.skeleton = createjs.promote(skeleton , 'DisplayObject');
}());
