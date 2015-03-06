/*
* @preserve Copyright (c) 2014 haramanai.
* bone
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
this.easelSif = this.easelSif || {};
(function() { 	
		

	
	function Bone(sifobj, data) {
		this.init(sifobj, data);
	}
	
	var p = Bone.prototype;
	
	p.init = function (sifobj, data) {
	
		var _set = easelSif.param._set;
		
		this.name = data.name.string;
		this.parent = data.parent.bone_valuenode._guid;
		this.sifobj = sifobj;
		this.timeline = new createjs.Timeline();
		this.guid = data._guid;
		
		_set(this, 'origin', 'vector', this, data.origin);
		_set(this, 'angle', 'angle', this, data.angle);
		_set(this, 'scalelx', 'real', this, data.scalelx);
		_set(this, 'width', 'real', this, data.width);
		_set(this, 'scalex', 'real', this, data.scalex);
		_set(this, 'tipwidth', 'real', this, data.tipwidth);
		_set(this, 'length', 'real', this, data.length);
		
		
		
		
		this._m = new createjs.Matrix2D(); 
		this._lm = new createjs.Matrix2D(); //different scale

		
		
		
		//console.log(this.guid);
		
	}
	

	
	p.setMatrix = function () {
		var parent = this.sifobj.sif.bones.guid[this.parent];
		var x = this.origin.getX();
		var y = this.origin.getY();
		var scalelx = this.scalelx.getValue();		
		var scalex = this.scalex.getValue();
		var angle = this.angle.getValue();
		var length = this.length.getValue();

		var sx = 1;

		if (parent) {
			this._m.copy(parent._lm);
			sx = parent.scalelx.getValue();
			a = parent.angle.getValue();
			
		} else {
			this._m.identity();

		}
		
		
		this._lm.copy(this._m);
		this._m.appendTransform(x *sx ,y  , scalelx * scalex , 1 , angle , 0, 0 , 0, 0);


		this._lm.appendTransform( x *sx  , y   , scalex  , 1, angle, 0, 0 , 0, 0);
		
	
		
	}
	
	
	p.setPosition = function (position) {
		var t = this.timeline;
		//console.log(this.name);
		t.setPosition(position);

		
		this.setMatrix();
		return position;
	}




easelSif.Bone = Bone;
}());

