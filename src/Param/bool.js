/*
* Copyright (c) 2012 haramanai.
* bool
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

var bool =  {};

bool._get = function (layer, param_name, wanted_type, that, data) {
	var param = sifPlayer.param;
	var param_type = 'bool';
	var w, tw, time;
	var tw_def = {paused: true, useTick: true};
	var timeline = layer.sifobj.timeline;
	var ease;
	var easeIn = 0;
	var easeInOut = [ 0, 1 ];
	
	that[param_name] = {};
	
	
	
	if (data.animated) {

		w = data.animated.waypoint
		that[param_name].value = w[0][param_type]._value

		tw = createjs.Tween.get(that[param_name], tw_def);


		if (w[0]._time !== "0s") {
			ease = sifPlayer.Ease.bool;
			time = sifPlayer._secsToMillis(w[0]._time);
			tw.to( {value: w[0][param_type]._value},
				time, ease);
		}

				
		for (var i = 0; i < w.length - 1; i++) {
			ease = (easeInOut[1 - easeIn])? sifPlayer.Ease.bool : sifPlayer.Ease.constant;
			easeIn = 1 - easeIn;
			//easeInOut[1 - easeIn]
			time = sifPlayer._secsToMillis(w[i + 1]._time) - sifPlayer._secsToMillis(w[i]._time);						
			if (w[i][param_type]._value !== w[i + 1][param_type]._value) {
				tw.to( {value: w[i + 1][param_type]._value},
					time, ease);
			} else {
				tw.wait(time);
			}
		}
		

		
		
		timeline.addTween(tw);


		param.convert._set( layer, that[param_name], wanted_type, param_type);
	} else {
		if (!data[param_type]) alert(JSON.stringify(data) + "param_type : " + param_type + ' param_name : ' + param_name + ' layer type : ' + this.type);
		that[param_name].value = data[param_type]._value;
		param.convert._set( layer, that[param_name], wanted_type, param_type);
	}
}


bool._setConvert = function (layer, param, wanted_type, is_type, animated) {
	var type = sifPlayer.param.bool;
	if (wanted_type === is_type) {
		param.getValue = type.getValue;
		param.setValue = type.setValue;
	}
	else if ( is_type === 'and' ) {
		param.getValue = type.getAnd;
	}
}
	

bool.setValue = function (v) {
	this.value = v;
}
	
bool.getValue = function () {
	return this.value;
}

bool.getAnd = function () {
	return this.link1 && this.link2;
}


	
	




sifPlayer.param.bool = bool;
}());
