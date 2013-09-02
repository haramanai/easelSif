/*
* Copyright (c) 2012 haramanai.
* real
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

var real =  {};

real.degsToRad = 0.0174532925;

real._setConvert = function (layer, param, wanted_type, is_type) {
	var type = easelSif.param.real;
	if (wanted_type === is_type) {
		param.getValue = type.getValue;
		param.setValue = type.setValue;
	}
	else if (type[is_type]){
		param.getValue = type[is_type];
	}
	else {
		alert('no convert for real to ' + is_type);
	}
	

}

real.setValue = function (v) {
	this.value = v;
}

real.getValue = function () {
	return this.value;
}

real.add = function () {
	return ( this.add.lhs.getValue() + this.add.rhs.getValue() ) * this.add.scalar.getValue();
}

real.subtract = function () {
	return ( this.subtract.lhs.getValue() - this.subtract.rhs.getValue() ) * this.subtract.scalar.getValue();
}

real.scale = function () {
	return this.scale.link.getValue() * this.scale.scalar.getValue();
}

real.cos = function () {
	return this.cos.amp.getValue() * Math.cos(this.cos.angle.getValue() * real.degsToRad);
}

real.sine = function () {
	return this.sine.amp.getValue() * Math.sin(this.sine.angle.getValue() * real.degsToRad);
}

real.dotproduct = function () {
	var x1,y1,x2,y2;
	x1 = this.dotproduct.lhs.getX();
	y1 = this.dotproduct.lhs.getY();
	x2 = this.dotproduct.rhs.getX();
	y2 = this.dotproduct.rhs.getY();
	return x1*x2 + y1*y2;
}
	
real.exp = function () {
	return Math.exp(this.exp.exp.getValue()) * this.exp.scale.getValue();
}

real.logarithm = function () {
	var link = this.logarithm.link.getValue();
	if (link >= this.logarithm.epsilon.getValue()) {
		return Math.log( link );
	}
	return -this.logarithm.infinite.getValue();
}

real.reciprocal = function () {
	var link = this.reciprocal.link.getValue();
	if (link >= this.reciprocal.epsilon.getValue()) {
		return 1/link;
	}
	return -this.reciprocal.infinite.getValue();
}



easelSif.param.real = real;
}());
