/*
* Copyright (c) 2012 haramanai.
* composite
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
this.sifPlayer.param = this.sifPlayer.param||{};
 (function() { 

var composite =  {};
	/**
	 * COMPOSITE
	 * @function param._getComposite
	 * @param {Object} layer the layer that contains the param
	 * @param {String} param_name the name of the param
	 * @param {String} wanted_type the type that the param wands to be
	 * @param {Object} that the holder of the values
	 * @param {Object} data the data that holds the values.
	 * @param {Object} param_type the type of the data param.
	 **/
composite._get = function (layer, param_name, wanted_type, that, data) {
	var param = sifPlayer.param;
	var _set = param._set;
	
	param_type = 'composite';
	
	that[param_name] = {};
	that[param_name]._type = param_type;

	that[param_name].composite = {};
	
	if (data.composite._type === 'vector') {

				// get the defs
		if (data[param_type]._x) {
			data[param_type].x = layer.sifobj.sif.canvas.defs[ data[param_type]._x ];
		}
		if (data[param_type]._y) {
			data[param_type].y = layer.sifobj.sif.canvas.defs[ data[param_type]._y ];
		}


		_set(layer, 'x', 'real', that[param_name].composite, data.composite.x);
		_set(layer, 'y', 'real', that[param_name].composite, data.composite.y);
		
		param.convert._set( layer, that[param_name], wanted_type, param_type);

		
	}
	else if (data.composite._type === 'bline_point') {
		var composite = that[param_name].composite;
		var param_type = data.composite._type;
		if (data.composite._point) data.composite.point = layer.sifobj.sif.canvas.defs[data.composite._point];
		_set(layer, 'point', 'vector', composite, data.composite.point);
		_set(layer, 'width', 'real', composite, data.composite.width);
		_set(layer, 'origin', 'real', composite, data.composite.origin);
		_set(layer, 'split', 'bool', composite, data.composite.split);
		_set(layer, 't1', 'vector', composite, data.composite.t1);
		_set(layer, 't2', 'vector', composite, data.composite.t2);
		param.convert._set( layer, that[param_name].composite, wanted_type, param_type, data.composite.point.animated || data.composite.width.animated || data.composite.origin.animated || data.composite.t1.animated || data.composite.t2.animated);

	}
}	



composite._setConvert = function (layer, param, wanted_type, is_type) {
	var type = composite;
	
	if ( is_type === 'bline_point' ) {
		param.getPoint = type.getPoint;
		param.getT1 = type.bline_point_getT1;
		param.getT2 = type.bline_point_getT2;
	} else {
		alert('new type of point');
	}
	
	
}
composite.getPoint = function () {
	//if (this.point.composite) alert(this.point.getX());	
	return this.point;
}

composite.bline_point_getPoint = function () {
	//alert(JSON.stringify(this.point));
	return this.point;
}

//Extra for rendering
composite.bline_point_getT1 = function () {
	
	return {x: this.t1.getX() / 3, y: this.t1.getY() / 3};
}

composite.bline_point_getT2 = function () {
	return {x: this.t2.getX() / 3, y: this.t2.getY() / 3};
}

	
	




sifPlayer.param.composite = composite;
}());
