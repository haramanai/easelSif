/*
* Copyright (c) 2014 haramanai.
* param
* version 0.1.
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
this.easelSif.param = this.easelSif.param||{};
 (function() { 
var param = easelSif.param;

	/**
	 * VECTOR
	 * @function param._getVector
	 * @param {Object} layer the layer that contains the param
	 * @param {String} param_name the name of the param
	 * @param {String} wanted_type the type that the param wands to be
	 * @param {Object} that the holder of the values
	 * @param {Object} data the data that holds the values.
	 **/		
	param._set = function(layer, param_name, wanted_type, that, data) { 
		var param_type;
		
		if (!data) alert(JSON.stringify(data) + this.type + "  " + param_name);
		if (data.animated) param_type = data.animated._type;
		if (data._type) param_type = data._type;
		
		if (data._use) {
			//To change
			param._set(layer, param_name, wanted_type, that, layer.sifobj.sif.canvas.defs[data._use]);
		}		//VECTOR
		else if (data.vector || param_type === 'vector') {
			param.vector._get( layer, param_name, wanted_type, that, data );
		}		//INTEGER
		else if (data.integer || param_type === 'integer') {
			param._getNumber( layer, param_name, wanted_type, that, data, 'integer' );
		}
		else if (data.real || param_type === 'real') {
			param._getNumber( layer, param_name, wanted_type, that, data, 'real' );
		}
		else if (data.angle || param_type === 'angle') {
			param._getNumber( layer, param_name, wanted_type, that, data, 'angle' );
		}
		else if (data.bool || param_type === 'bool') {
			param.bool._get( layer, param_name, wanted_type, that, data);
		}
		else if (data.time || param_type === 'time') {
			param._getTime( layer, param_name, wanted_type, that, data);
		}

		else if (data.color || param_type === 'color') {
			param._getColor( layer, param_name, wanted_type, that, data );
		}
		else if (data.gradient || param_type === 'gradient') {
			param._getGradient( layer, param_name, wanted_type, that, data );
		}		//COMPOSITE
		else if (data.composite) {
			param.composite._get(layer, param_name, wanted_type, that, data);
		}		//BLINE POINT => VERTEX
		else if (data.bline_point) {
			//This is a special conversion cause the bline_points are always passed as composite types
			// so here is the place where all the converted bline points are going to be handled
			// The trick here is to make any other type to look like a regular bline point
			that[param_name] = {};
			that[param_name].composite = {};
			if (data.bline_point.vertex) { //This is a vertex bline point
				param._set(layer, 'point', 'vector', that[param_name].composite, data.bline_point.vertex);
				param._set(layer, 't1', 'vector', that[param_name].composite, data.bline_point.t1);
				that[param_name].composite.split = {};
				that[param_name].composite.split.getValue = function () {return false};
				param.convert._set(layer, that[param_name].composite, wanted_type, 'bline_point');
			} else {
				alert('not converted bline point');
			}

		}	
				// CONVERT TYPES
				//SCALE
		else if (data.scale || param_type === 'scale') {
			that[param_name] = {};
			that[param_name].scale = {};
			if (data.scale._link) data.scale.link = layer.sifobj.sif.canvas.defs[data.scale._link];
			if (data.scale._scalar) data.scale.scalar = layer.sifobj.sif.canvas.defs[data.scale._scalar];
			param._set(layer, 'link', data.scale._type, that[param_name].scale, data.scale.link);
			param._set(layer, 'scalar', 'real', that[param_name].scale, data.scale.scalar);
			param.convert._set( layer, that[param_name], wanted_type, 'scale');		
		}
		else if (data.radial_composite || param_type === 'radial_composite') {
			param._getRadial_composite( layer, param_name, wanted_type, that, data );
		}		//ADD
		else if (data.add) {
			param_type = data.add._type;
			that[param_name] = {};
			that[param_name].add = {};
			if (data.add._lhs) data.add.lhs = layer.sifobj.sif.canvas.defs[data.add._lhs];
			if (data.add._rhs) data.add.rhs = layer.sifobj.sif.canvas.defs[data.add._rhs];
			if (data.add._scaler) data.add.scaler = layer.sifobj.sif.canvas.defs[data.add._scaler];
			param._set(layer, 'lhs', param_type, that[param_name].add, data.add.lhs);
			param._set(layer, 'rhs', param_type, that[param_name].add, data.add.rhs);
			param._set(layer, 'scalar', 'real', that[param_name].add, data.add.scalar);
				
			param.convert._set( layer, that[param_name], wanted_type, 'add');
			
		}		//AND
		else if (data.and) {
			param_type = data.and._type;
			
			that[param_name] = {};
			that[param_name].and = {};
			param._set(layer, 'link1', param_type, that[param_name].and, data.and.link1);
			param._set(layer, 'link2', param_type, that[param_name].and, data.and.link2);
				
			param.convert._set( layer, that[param_name], wanted_type, 'and');
			
		}		//ATAN2
		else if (data.atan2) {
			param_type = data.atan2._type;
			that[param_name] = {};
			that[param_name].atan2 = {};
			if (data.atan2._x) data.atan2.x = layer.sifobj.sif.canvas.defs[data.atan2._x];
			if (data.atan2._y) data.atan2.y = layer.sifobj.sif.canvas.defs[data.atan2._y];
			param._set(layer, 'x', 'real', that[param_name].atan2, data.atan2.x);
			param._set(layer, 'y', 'real', that[param_name].atan2, data.atan2.y);
			param.convert._set( layer, that[param_name], wanted_type, 'atan2');
			
		}		//COS
		else if (data.cos) {
			param_type = data.cos._type;
			that[param_name] = {};
			that[param_name].cos = {};
			if (data.cos._angle) data.cos.angle = layer.sifobj.sif.canvas.defs[data.cos._angle];
			if (data.cos._amp) data.cos.amp = layer.sifobj.sif.canvas.defs[data.cos._amp];
			param._set(layer, 'angle', 'angle', that[param_name].cos, data.cos.angle);
			param._set(layer, 'amp', 'real', that[param_name].cos, data.cos.amp);
			param.convert._set( layer, that[param_name], wanted_type, 'cos');
			
		}		//DOT PRODUCT
		else if (data.dotproduct) {
			param_type = data.dotproduct._type;
			that[param_name] = {};
			that[param_name].dotproduct = {};
			if (data.dotproduct._lhs) data.dotproduct.lhs = layer.sifobj.sif.canvas.defs[data.dotproduct._lhs];
			if (data.dotproduct._rhs) data.dotproduct.rhs = layer.sifobj.sif.canvas.defs[data.dotproduct._rhs];
			param._set(layer, 'lhs', 'vector', that[param_name].dotproduct, data.dotproduct.lhs);
			param._set(layer, 'rhs', 'vector', that[param_name].dotproduct, data.dotproduct.rhs);
				
			param.convert._set( layer, that[param_name], wanted_type, 'dotproduct');
			
		}		//EXPONENTIAL
		else if (data.exp) {
			param_type = data.exp._type;
			that[param_name] = {};
			that[param_name].exp = {};
			if (data.exp._exp) data.exp.exp = layer.sifobj.sif.canvas.defs[data.exp._exp];
			if (data.exp._scale) data.exp.scale = layer.sifobj.sif.canvas.defs[data.exp._scale];
			param._set(layer, 'exp', 'real', that[param_name].exp, data.exp.exp);
			param._set(layer, 'scale', 'real', that[param_name].exp, data.exp.scale);
				
			param.convert._set( layer, that[param_name], wanted_type, 'exp');
			
		}		//LOGARITHM
		else if (data.logarithm) {
			param_type = data.logarithm._type;
			that[param_name] = {};
			that[param_name].logarithm = {};
			if (data.logarithm._link) data.logarithm.link = layer.sifobj.sif.canvas.defs[data.logarithm._link];

			param._set(layer, 'link', 'real', that[param_name].logarithm, data.logarithm.link);
			param._set(layer, 'epsilon', 'real', that[param_name].logarithm, data.logarithm.epsilon);
			param._set(layer, 'infinite', 'real', that[param_name].logarithm, data.logarithm.infinite);	
			param.convert._set( layer, that[param_name], wanted_type, 'logarithm');
			
		}		//RECIPROCAL
		else if (data.reciprocal) {
			param_type = data.reciprocal._type;
			that[param_name] = {};
			that[param_name].reciprocal = {};
			if (data.reciprocal._link) data.reciprocal.link = layer.sifobj.sif.canvas.defs[data.reciprocal._link];

			param._set(layer, 'link', 'real', that[param_name].reciprocal, data.reciprocal.link);
			param._set(layer, 'epsilon', 'real', that[param_name].reciprocal, data.reciprocal.epsilon);
			param._set(layer, 'infinite', 'real', that[param_name].reciprocal, data.reciprocal.infinite);	
			param.convert._set( layer, that[param_name], wanted_type, 'reciprocal');
			
		}		//SUBTRACT
		else if (data.subtract) {
			param_type = data.subtract._type;
			that[param_name] = {};
			that[param_name].subtract = {};
			if (data.subtract._lhs) data.subtract.lhs = layer.sifobj.sif.canvas.defs[data.subtract._lhs];
			if (data.subtract._rhs) data.subtract.rhs = layer.sifobj.sif.canvas.defs[data.subtract._rhs];
			if (data.subtract._scalar) data.subtract.scalar = layer.sifobj.sif.canvas.defs[data.subtract._scalar];
			param._set(layer, 'lhs', param_type, that[param_name].subtract, data.subtract.lhs);
			param._set(layer, 'rhs', param_type, that[param_name].subtract, data.subtract.rhs);
			param._set(layer, 'scalar', 'real', that[param_name].subtract, data.subtract.scalar);
				
			param.convert._set( layer, that[param_name], wanted_type, 'subtract');
			
		}		//SINE
		else if (data.sine) {
			param_type = data.sine._type;
			that[param_name] = {};
			that[param_name].sine = {};
			if (data.sine._angle) data.sine.angle = layer.sifobj.sif.canvas.defs[data.sine._angle];
			if (data.sine._amp) data.sine.amp = layer.sifobj.sif.canvas.defs[data.sine._amp];
			param._set(layer, 'angle', 'angle', that[param_name].sine, data.sine.angle);
			param._set(layer, 'amp', 'real', that[param_name].sine, data.sine.amp);
			param.convert._set( layer, that[param_name], wanted_type, 'sine');
			
		}	//vectorangle
		else if (data.vectorangle) {
			param_type = data.vectorangle._type;
			that[param_name] = {};
			that[param_name].vectorangle = {};
			param._set(layer, 'vector', 'vector', that[param_name].vectorangle, data.vectorangle.vector);
			param.convert._set( layer, that[param_name], wanted_type, 'vectorangle');
		}		
		else if (data.greyed) {
			param._set(layer, param_name, wanted_type, that, data.greyed.link);
		}
		else {
			alert('no param type');
			alert(JSON.stringify(data) + ' layer type : ' + layer.type);
		}

	}

//CONVERTED 	

	

	/**
	 * animates the angle real integer and checks for convert 
	 * @function param._getNumber
	 * @param {Object} layer the layer that contains the param
	 * @param {String} param_name the name of the param
	 * @param {String} wanted_type the type that the param wands to be
	 * @param {Object} that the holder of the values
	 * @param {Object} data the data that holds the values.
	 * @param {Object} param_type the type of the data param.
	 **/	
	param._getNumber = function (layer, param_name, wanted_type, that, data, param_type) {	
		var w, tw, time;
		var tw_def = {paused: true, useTick: true};
		var timeline = layer.timeline;
		var ease;
		var stm = easelSif._secsToMillis;
		that[param_name] = {};
		
		
		
		if (data.animated) {

			w = data.animated.waypoint
			that[param_name].value = w[0][param_type]._value

			tw = createjs.Tween.get(that[param_name], tw_def);


			if (w[0]._time !== "0s") {
				ease = easelSif._getEase(w[0]._before);
				time = stm(w[0]._time);
				tw.to( {value: w[0][param_type]._value},
					time, ease);
			}

					
			for (var i = 0; i < w.length - 1; i++) {
				ease = easelSif._getEase(w[i + 1]._before);
				time = stm(w[i + 1]._time) - stm(w[i]._time);						
				tw.to( {value: w[i + 1][param_type]._value},
					time, ease );
			}


			
			
			timeline.addTween(tw);


			param.convert._set( layer, that[param_name], wanted_type, param_type);
		} else {
			if (!data[param_type]) alert(JSON.stringify(data) + "param_type : " + param_type + ' param_name : ' + param_name + ' layer type : ' + this.type);
			that[param_name].value = data[param_type]._value;
			param.convert._set( layer, that[param_name], wanted_type, param_type);
		}
	}
	
	/**
	 * TIME
	 * @function param._getRadial_composite
	 * @param {Object} layer the layer that contains the param
	 * @param {String} param_name the name of the param
	 * @param {String} wanted_type the type that the param wands to be
	 * @param {Object} that the holder of the values
	 * @param {Object} data the data that holds the values.
	 * @param {Object} param_type the type of the data param.
	 **/
	param._getTime = function (layer, param_name, wanted_type, that, data) {
		var param_type = 'time'; //We will get the time as millisecs..
		var w, tw, time;
		var tw_def = {paused: true, useTick: true};
		var timeline = layer.timeline;
		var ease;
		
		var stm = easelSif._secsToMillis;
		that[param_name] = {};
		
		
		
		if (data.animated) {

			w = data.animated.waypoint
			that[param_name].value = stm(w[0][param_type]._value);

			tw = createjs.Tween.get(that[param_name], tw_def);


			if (w[0]._time !== "0s") {
				ease = easelSif._getEase(w[0]._before);
				time = stm(w[0]._time);
				tw.to( {value: stm(w[0][param_type]._value)},
					time, ease);
				
			}

					
			for (var i = 0; i < w.length - 1; i++) {
				ease = easelSif._getEase(w[i + 1]._before);
				time = stm(w[i + 1]._time) - stm(w[i]._time);						
				tw.to( {value: stm(w[i + 1][param_type]._value)},
					time, ease );
				
			}
			
			
			
			timeline.addTween(tw);

			
			param.convert._set( layer, that[param_name], wanted_type, 'integer');
		} else {
			if (!data[param_type]) alert(JSON.stringify(data) + "param_type : " + param_type + ' param_name : ' + param_name + ' layer type : ' + this.type);
			that[param_name].value = stm(data[param_type]._value);
			param.convert._set( layer, that[param_name], wanted_type, 'integer');
		}
	}
	
		
	/**
	 * RADIAL COMPOSITE
	 * @function param._getRadial_composite
	 * @param {Object} layer the layer that contains the param
	 * @param {String} param_name the name of the param
	 * @param {String} wanted_type the type that the param wands to be
	 * @param {Object} that the holder of the values
	 * @param {Object} data the data that holds the values.
	 * @param {Object} param_type the type of the data param.
	 **/
	param._getRadial_composite = function (layer, param_name, wanted_type, that, data) {	
		param_type = 'radial_composite';
		that[param_name] = {};
		that[param_name]._type = param_type;
		that[param_name].radial_composite = {};
		// get the defs
		if (data[param_type]._radius) {
			data[param_type].radius = layer.sifobj.sif.canvas.defs[ data[param_type]._radius ];
		}
		if (data[param_type]._theta) {
			data[param_type].theta = layer.sifobj.sif.canvas.defs[ data[param_type]._theta ];
		}
		
		param._set(layer, 'radius', 'real', that[param_name][param_type], data[param_type].radius);
		param._set(layer,'theta', 'angle', that[param_name][param_type], data[param_type].theta);
		param.convert._set( layer, that[param_name], wanted_type, param_type);
	}
	
//UNCONVERTED	
	/**
	 * COLOR
	 * @function param._getColor
	 * @param {Object} layer the layer that contains the param
	 * @param {String} param_name the name of the param
	 * @param {String} wanted_type the type that the param wands to be
	 * @param {Object} that the holder of the values
	 * @param {Object} data the data that holds the values.
	 * @param {Object} param_type the type of the data param.
	 **/
	param._getColor = function (layer, param_name, wanted_type, that, data) {
		//NOT CONVERTED.
		var param_type = 'color';
		var tw_def = {paused: true, useTick: true};
		var timeline = layer.timeline;
		that[param_name] = {};
		that[param_name].animated = true;
		
		if (data.animated) {
			w = data.animated.waypoint
			that[param_name].r = w[0][param_type].r;
			that[param_name].g = w[0][param_type].g;
			that[param_name].b = w[0][param_type].b;
			that[param_name].a = w[0][param_type].a;
			tw = createjs.Tween.get(that[param_name], tw_def);
				
			if (w[0]._time !== "0s") {
					tw.to( {r: w[0][param_type].r, g: w[0][param_type].g, b: w[0][param_type].b, a: w[0][param_type].a},
						easelSif._secsToMillis(w[0]._time), 
						easelSif._getEase(w[0]._before) );
			}

					
			for (var i = 0; i < w.length - 1; i++) {
				tw.to( {r: w[i + 1][param_type].r, g: w[i + 1][param_type].g, b: w[i + 1][param_type].b, a: w[i + 1][param_type].a},
					easelSif._secsToMillis(w[i + 1]._time) - easelSif._secsToMillis(w[i]._time),
					easelSif._getEase(w[i + 1]._before) );
			}
			
			timeline.addTween(tw);
		} else {
			that[param_name].r = data[param_type].r;
			that[param_name].g = data[param_type].g;
			that[param_name].b = data[param_type].b;
			that[param_name].a = data[param_type].a;
		}
	}
	
	/**
	 * GRADIENT
	 * @function param._getGradient
	 * @param {Object} layer the layer that contains the param
	 * @param {String} param_name the name of the param
	 * @param {String} wanted_type the type that the param wands to be
	 * @param {Object} that the holder of the values
	 * @param {Object} data the data that holds the values.
	 * @param {Object} param_type the type of the data param.
	 **/
	param._getGradient = function (layer, param_name, wanted_type, that, data, param_type) {
		//NOT CONVERTED.
		var param_type = 'gradient';
		var tw_def = {paused: true, useTick: true};
		var timeline = layer.timeline;
		that[param_name] = {};
		
		var pcolor,dcolor;
		if (data.animated) {
			w = data.animated.waypoint
			that[param_type] = {};
			that[param_type].color = [];
			for (var i = 0, ii = w[0].gradient.color.length; i < ii; i++) {
				that[param_type].color.push({});
				pcolor = that[param_type].color[i];
				dcolor = w[0].gradient.color[i];
				pcolor.pos = dcolor._pos;
				pcolor.r = dcolor.r;
				pcolor.g = dcolor.g;
				pcolor.b = dcolor.b;
				pcolor.a = dcolor.a;
				
				tw = createjs.Tween.get(pcolor, tw_def);
				if (w[0]._time !== "0s") {
					tw.to( {pos: dcolor._pos, r: dcolor.r, g: dcolor.g, b: dcolor.b, a: dcolor.a},
						easelSif._secsToMillis(w[0]._time), 
						easelSif._getEase(w[0]._before) );
					
				}
				for (var j = 0, jj = w.length - 1; j < jj; j++) {
					dcolor = w[j + 1].gradient.color[i];
					tw.to( {pos: dcolor._pos, r: dcolor.r, g: dcolor.g, b: dcolor.b, a: dcolor.a},
						easelSif._secsToMillis(w[j + 1]._time) - easelSif._secsToMillis(w[j]._time), 
						easelSif._getEase(w[j + 1]._before) );
					
				}
				timeline.addTween(tw);
			}
						
		} else {
			that[param_type] = {};
			that[param_type].color = [];
			for (var i = 0, ii = data[param_type].color.length; i < ii; i++) {
				that[param_type].color.push({});
				pcolor = that[param_type].color[i];
				dcolor = data[param_type].color[i];
				pcolor.pos = dcolor._pos;
				pcolor.r = dcolor.r;
				pcolor.g = dcolor.g;
				pcolor.b = dcolor.b;
				pcolor.a = dcolor.a;		
			}									
		}
	}
	
		
}());
