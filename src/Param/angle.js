/*
* Copyright (c) 2012 haramanai.
* angle
* version 0.2.
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
this.easelSif.param = this.easelSif.param||{};
 (function() { 

var angle =  {};


angle._setConvert = function (layer, param, wanted_type, is_type) {
	var type = easelSif.param.angle;
	
	if (wanted_type === is_type) {
		param.getValue = type.getValue;
		param.setValue = type.setValue;
	}
	else if (type[is_type]){
		param.getValue = type[is_type];
	}
	else {
		alert('no convert for angle to ' + is_type);
	}
	
	
}
	
angle.setValue = function (v) {
	this.value = v;
}


angle.getValue = function () {
	return this.value;
}

angle.add = function () {
	return ( this.add.lhs.getValue() + this.add.rhs.getValue() ) * this.add.scalar.getValue();
}

angle.subtract = function () {
	return ( this.subtract.lhs.getValue() - this.subtract.rhs.getValue() ) * this.subtract.scalar.getValue();
}


angle.scale = function () {
	return this.scale.link.getValue() * this.scale.scalar.getValue();
}

angle.atan2 = function () {
	return Math.atan2(this.atan2.y.getValue(), this.atan2.x.getValue()) / Math.PI * 180.0;
}
	
angle.dotproduct = function () {
	var x1,y1,x2,y2, l;
	x1 = this.dotproduct.lhs.getX();
	y1 = this.dotproduct.lhs.getY();
	x2 = this.dotproduct.rhs.getX();
	y2 = this.dotproduct.rhs.getY();

	return Math.acos( (x1*x2 + y1*y2) / (Math.sqrt(x1*x1 + y1*y1) * Math.sqrt(x2*x2 + y2*y2))) / Math.PI * 180.0;
}

angle.vectorangle = function () {
	return Math.atan2(this.vectorangle.vector.getY(), this.vectorangle.vector.getX()) / Math.PI * 180.0;
}




easelSif.param.angle = angle;
}());
