/*
* Copyright (c) 2014 haramanai.
* easelSif
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
(function() { 	
//Common functions
var easelSif = {};
	



	
	easelSif.getTotalScale = function (o) {
		var sx = 1;
		var sy = 1;
		while (o != null) {
			sx *= o.scaleX;
			sy *= o.scaleY;
			o = o.parent;

		}
		return Math.sqrt(sx * sx  + sy * sy);
	}

	
	/**
	 * This function creates and return a new layer for the sifObject
	 * @function _getLayer
	 * @param {Object} parent The parent of new Layer
	 * @param {Object} data the data for the layer
	 * @return {Object} the a sif layer
	 **/	
	easelSif._getLayer = function (sifobj, data) {
		var o;
		if (easelSif[data._type]) {
			o = new easelSif[data._type]();
			o.init(sifobj, data);
			return o;
		}
		if (data._type === 'import') {
			o = new easelSif.Import();
			o.init(sifobj, data);
			return o;
		}
		
		if (data._type === 'switch') {
			o = new easelSif.Switch();
			o.init(sifobj, data);
			return o;
		}
		// Not supported LAYER
		console.log("EERRROOR  "  + data._type + " layer it's not supported");
		//var bad_layer = new easelSif.Layer();
		//bad_layer.initLayer(parent, data);
		//return bad_layer;
	}
	
	easelSif._setTimeline = function (o) {
		o.timeline = new createjs.Timeline();
		o.timeline.setPaused(true);
	}
	
	easelSif._getBlend = function (blend) {
	
		switch (blend) {
			case 0:
				//Composite
				return 'source-over';

			case 1:
				//Straight 
				return 'copy';

			case 13:
				//Onto
				return 'source-atop';

			case 21:
				//Straight Onto
				return 'source-in';

			case 12:
				//Behind
				return 'destination-over';

			case 19:
				//Alpha Over
				return 'destination-out';
				break;
			case 14:
				//Alpha Brighter
				return 'destination-in';
				break;
				
				
			default:
				return 'source-over';
				
		}
	}
	
	easelSif.aabbFromEntries = function (e , width) {
		var a = [e[0][0], e[0][1], e[0][0], e[0][1]];
		for (var i = 0, ii = e.length; i < ii; i++) {
			if (e[i][0] < a[0]) {
				a[0] = e[i][0]
			} 
			else if (e[i][0] > a[2]) {
				a[2] = e[i][0];
			}
			
			if (e[i][2] < a[0]) {
				a[0] = e[i][2]
			} 
			else if (e[i][2] > a[2]) {
				a[2] = e[i][2];
			}
			
			if (e[i][4] < a[0]) {
				a[0] = e[i][4]
			} 
			else if (e[i][4] > a[2]) {
				a[2] = e[i][4];
			}
			
			
			//Y
			
			if (e[i][1] < a[1]) {
				a[1] = e[i][1]
			} 
			else if (e[i][1] > a[3]) {
				a[3] = e[i][1];
			}
			
			if (e[i][3] < a[1]) {
				a[1] = e[i][3]
			} 
			else if (e[i][3] > a[3]) {
				a[3] = e[i][3];
			}
			
			if (e[i][5] < a[1]) {
				a[1] = e[i][5]
			} 
			else if (e[i][5] > a[3]) {
				a[3] = e[i][5];
			}
			

			if (width) {
				a[0] -= width;
				a[1] -= width;
				a[2] += width;
				a[3] += width;
			}

		}
		return a;
	}



	/**
	 * Gets the time in seconds and returns it to milliseconds
	 * 
	 * @function easelSif._secsToMillis
	 * @param {String} _s The time in seconds
	 * @return {Number} the millisecs
	 **/	
	easelSif._secsToMillis = function (_s) {
			return parseFloat(_s.replace("s",""))*1000;
	}
	
	/**
	 * Gets the time in seconds and returns it to milliseconds
	 * 
	 * @function easelSif._canvasTimeToMillis
	 * @param {String} _s The time in seconds and frames
	 * @param {Integer} fps The frames per seccond
	 * @return {Number} the millisecs
	 **/	
	easelSif._canvasTimeToMillis = function (_s, fps) {
		var millis = 0;
		var t;
		if (_s.search('h') > 0 ) {
			t = _s.split('h');
			millis += t[0] * 3600000;
			_s = t[1];
		}
		
		if (_s.search('m') > 0 ) {
			t = _s.split('m');
			millis += t[0] * 60000;
			_s = t[1];
		}

		if (_s.search('s') > 0 ) {
			t = _s.split('s');
			millis += t[0] * 1000;
			_s = t[1];			
		}
		
		if (_s.search('f') > 0 ) {
			t = _s.split('f');
			millis += t[0] * 1000/fps;	
		}
		return millis;
	}
	
	
	/**
	 * Returns a string to a sif value
	 * 
	 * @function easelSif._toSifValue
	 * @param {String} value The value to be converted to a sif value
	 * @return {Number || String} the sif value
	 **/		
	easelSif._toSifValue = function ( value ) {
		var num = Number(value);
		if (!isNaN(num)) return num;
		if (value === 'true') return true;
		if (value === 'false') return false;
		//if a value or vector is using a def the first letter is ':' so we check to remove it.
		if (value[0] === ":") return value.substr(1);
		return value;
	}
	
	/**
	 * Returns a cteatejs.Ease to be used
	 * @function easelSif._getEase
	 * @param {String} ease_type the type of ease to catch
	 * @param {Object} ease_type the data to check the value type
	 * @return {object} returns a cteatejs.Ease to be used
	 **/	
	easelSif._getEase = function (ease_type) {

		if (ease_type === 'linear') return createjs.Ease.none;
		if (ease_type === 'clamped') return createjs.Ease.none;
		//EaseInOut
		if (ease_type === 'halt') return createjs.Ease.none;
		if (ease_type === 'constant') return easelSif.Ease.constant;
		//TCB
		if (ease_type === 'auto') return createjs.Ease.none;

		return false;
	}
	
	easelSif.aabbFromEntries = function (e , width) {
		var a = [e[0][0], e[0][1], e[0][0], e[0][1]];
		for (var i = 0, ii = e.length; i < ii; i++) {
			if (e[i][0] < a[0]) {
				a[0] = e[i][0]
			} 
			else if (e[i][0] > a[2]) {
				a[2] = e[i][0];
			}
			
			if (e[i][2] < a[0]) {
				a[0] = e[i][2]
			} 
			else if (e[i][2] > a[2]) {
				a[2] = e[i][2];
			}
			
			if (e[i][4] < a[0]) {
				a[0] = e[i][4]
			} 
			else if (e[i][4] > a[2]) {
				a[2] = e[i][4];
			}
			
			
			//Y
			
			if (e[i][1] < a[1]) {
				a[1] = e[i][1]
			} 
			else if (e[i][1] > a[3]) {
				a[3] = e[i][1];
			}
			
			if (e[i][3] < a[1]) {
				a[1] = e[i][3]
			} 
			else if (e[i][3] > a[3]) {
				a[3] = e[i][3];
			}
			
			if (e[i][5] < a[1]) {
				a[1] = e[i][5]
			} 
			else if (e[i][5] > a[3]) {
				a[3] = e[i][5];
			}
			

			if (width) {
				a[0] -= width;
				a[1] -= width;
				a[2] += width;
				a[3] += width;
			}

		}
		return a;
	}


	easelSif._addToDesc = function (o, data) {
		var desc = o.sifobj.desc;
		if (data._desc) {
			o.name = data._desc;
			//keep refernce of the layer to the sifobj so we can reach it.
			if (desc[o.name]) {
				if (desc[o.name].constructor != Array) {
					var r = desc[o.name]
					desc[o.name] = [];
					desc[o.name].push(r);					
				}
				desc[o.name].push(o);
			} else {
				desc[o.name] = o;
			}
			
		}
	}
	
	
	easelSif._checkTimeline = function (timeline) {	
		var tw = timeline._tweens;
		var pos = timeline.position;
		var check = false;
		if (tw) {	

			for (var i = 0, ii = tw.length; i < ii; i++) {
				if (easelSif._checkTween(tw[i])) {check = true;}
				
			}

		}
		return check;
	}
	
	easelSif._checkTween = function (tw) {
		var props = tw._curQueueProps;
		var target = tw._target;
		var preprops = (target.preprops)?target.preprops : {};
		var check = false;
		
		
		for (var n in props) {
			if (target[n] !== preprops[n]) check = true;
			preprops[n] = target[n];
		}
		target.preprops = preprops;
		return check;		
	}	



	
	


window.easelSif = easelSif;
}());

