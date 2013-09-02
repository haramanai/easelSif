/*
* Copyright (c) 2012 haramanai.
* integer
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

var integer =  {};


integer._setConvert = function (layer, param, wanted_type, is_type) {
	var type = easelSif.param.integer;
	if (wanted_type === is_type) {
		param.getValue = type.getValue;
		param.setValue = type.setValue;
	}
	else if (type[is_type]){
		param.getValue = type[is_type];
	}
	else {
		alert('no convert for integer to ' + is_type);
	}
	
}
	

integer.setValue = function (v) {
	this.value = v;
}

integer.getValue = function () {
	return this.value;
}

integer.add = function () {
	return ( this.add.lhs.getValue() + this.add.rhs.getValue() ) * this.add.scalar.getValue();
}

integer.subtract = function () {
	return ( this.subtract.lhs.getValue() - this.subtract.rhs.getValue() ) * this.subtract.scalar.getValue();
}

integer.scale = function () {
	return this.scale.link.getValue() * this.scale.scalar.getValue();
}
	
	




easelSif.param.integer = integer;
}());
