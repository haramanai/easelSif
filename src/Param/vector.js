/*
* Copyright (c) 2012 haramanai.
* Vector
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


var vector =  {};

vector._get = function (layer, param_name, wanted_type, that, data) {
	var param_type = 'vector';
	var w, tw, time;
	var tw_def = {paused: true, useTick: true};
	var timeline = layer.timeline;
	that[param_name] = {};
	
	if (data.animated) {
		w = data.animated.waypoint
		that[param_name].x = w[0][param_type].x;
		that[param_name].y = w[0][param_type].y;

		
		tw = createjs.Tween.get(that[param_name], tw_def);


		if (w[0]._time !== "0s") {
			time = sifPlayer._secsToMillis(w[0]._time);
			tw.to( {x: w[0][param_type].x, y: w[0][param_type].y},
				time, sifPlayer._getEase(w[0]._before) );
		}

				
		for (var i = 0; i < w.length - 1; i++) {
			time = sifPlayer._secsToMillis(w[i + 1]._time) - sifPlayer._secsToMillis(w[i]._time)
			tw.to( {x: w[i + 1][param_type].x, y: w[i + 1][param_type].y},
				time, sifPlayer._getEase(w[i + 1]._before) );


		}
		

		timeline.addTween(tw);

		sifPlayer.param.convert._set( layer, that[param_name], wanted_type, param_type);


	} 
	else if (data[param_type]) {
		that[param_name].x = data[param_type].x;
		that[param_name].y = data[param_type].y;
		sifPlayer.param.convert._set( layer, that[param_name], wanted_type, param_type, false );	
	}
	else {
		alert(JSON.stringify(data) + ' in vector');
	}
	
	

}



vector._setConvert = function (layer, param, wanted_type, is_type) {
	var type = sifPlayer.param.vector;

	if (wanted_type === is_type) {
		param.getX = type.getX;
		param.getY = type.getY;
		param.setVector = type.setVector;
		param.setX = type.setX;
		param.setY = type.setY;
	} else if (is_type === 'radial_composite') {
		param.getX = type.getRadialX;
		param.getY = type.getRadialY;
	} 
	else if (is_type === 'composite') {		
		param.getX = type.getCompositeX;
		param.getY = type.getCompositeY;

	} 
	else if (is_type === 'add') {
		param.getX = type.getAddX;
		param.getY = type.getAddY;

	}
	else if (is_type === 'scale') {
		if (param.scale.composite) {
			param.getX = type.getScaleCompositeX;
			param.getY = type.getScaleCompositeY;
		}
		else if (param.scale.radial_composite) {
			param.getX = type.getScaleRadialX;
			param.getY = type.getScaleRadialY;
		} else {
			param.getX = type.getScaleX;
			param.getY = type.getScaleY;
		}

	}
	else if (is_type === 'subtract') {
		param.getX = type.getSubX;
		param.getY = type.getSubY;

	}
	
	
	
} 

vector.setVector = function (x, y) {
	this.x = x;
	this.y = y;
}

vector.setX = function (x) {
	this.x = x;
}

vector.setY = function (y) {
	this.y = y;
}

vector.getX = function () {
	return this.x;
}

vector.getY = function () {
	return this.y;
}

vector.getScaleX = function () {
	return this.scale.link.getX() * this.scale.scalar.getValue();
}

vector.getScaleY = function () {
	return this.scale.link.getY() * this.scale.scalar.getValue();
}

vector.getScaleCompositeX = function () {
	return this.scale.composite.x.getValue() * this.scalar.getValue();
}

vector.getScaleCompositeY = function () {
	return this.scale.composite.y.getValue() * this.scalar.getValue();
}
vector.getScaleRadialX = function () {
	var a = this.scale.radial_composite.theta.getValue() * Math.PI / 180.0;
	var t = this.scale.radial_composite.radius.getValue();
	return Math.cos(a) * t * this.scalar.getValue();
}

vector.getScaleRadialY = function () {
	var a = this.scale.radial_composite.theta.getValue() * Math.PI / 180.0;
	var t = this.scale.radial_composite.radius.getValue();
	return Math.sin(a) * t * this.scalar.getValue();
}
vector.getRadialX = function () {
	var a = this.radial_composite.theta.getValue() * Math.PI / 180.0;
	var t = this.radial_composite.radius.getValue();
	return Math.cos(a) * t;
}

vector.getRadialY = function () {
	var a = this.radial_composite.theta.getValue() * Math.PI / 180.0;
	var t = this.radial_composite.radius.getValue();
	return Math.sin(a) * t;
}

vector.getCompositeX = function () {
	return this.composite.x.getValue();
}

vector.getCompositeY = function () {
	return this.composite.y.getValue();
}

vector.getAddX = function () {
	return ( this.add.lhs.getX() + this.add.rhs.getX() ) * this.add.scalar.getValue();
}
	
vector.getAddY = function () {
	return ( this.add.lhs.getY() + this.add.rhs.getY() ) * this.add.scalar.getValue();
}

vector.getSubX = function () {
	return ( this.subtract.lhs.getX() - this.subtract.rhs.getX() ) * this.subtract.scalar.getValue();
}
	
vector.getSubY = function () {
	return ( this.subtract.lhs.getY() - this.subtract.rhs.getY() ) * this.subtract.scalar.getValue();
}	
	



sifPlayer.param.vector = vector;
}());
