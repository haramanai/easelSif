/**
* @preserve Copyright (c) 2012 haramanai.
* sifPlayer easelSif
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
this.sifPlayer = this.sifPlayer || {};
(function() { 	
//Common functions
	/**
	 * Gets the time in seconds and returns it to milliseconds
	 * 
	 * @function sifPlayer._secsToMillis
	 * @param {Element} node XML node element to be parsed
	 * @return {Object} the data that can be used by the SifObject
	 **/	
	sifPlayer._getData = function (node) {

		var	data = {};

		// append a value
		function Add(name, value) {

			if (data[name]) {
				if (data[name].constructor != Array) {
					data[name] = [data[name]];
				}
				data[name][data[name].length] = value;
			}
			else {
				data[name] = value;
			}
		};
		
		// element attributes
		var c, cn, cname;
		for (c = 0; cn = node.attributes[c]; c++) {
			Add("_" + cn.name, sifPlayer._toSifValue(cn.value));
		}
		
		// child elements
		for (c = 0; cn = node.childNodes[c]; c++) {
			if (cn.nodeType == 1) {
				cname = cn.nodeName;
				if (cn.childNodes.length == 1 && cn.firstChild.nodeType == 3) {
					// text value
					Add(cn.nodeName, sifPlayer._toSifValue(cn.firstChild.nodeValue));
				}
				else {
					// A switch to help catch the changes we wand
					
					switch (cname) {
						
							
							
						case 'param':
							/* To get the params out the param array 
							*and set the name as propertie we will get
							* the ugly: 
							* bline.bline.entry[0].point.vector.x
							* canvas.canvas.layer for the PasteCanvas
							* color.color.a
							* and some more but it's the best solution for
							* a clean json 
							* */
							data[cn.getAttribute('name')] = sifPlayer._getData(cn);
							break;
							
							
						case 'layer':
							/* layer and waypoint must always be array
							 * 
							 * */
							
							if (typeof data[cname] == 'undefined') data[cname] = [];
							var layer_type = cn.getAttribute('type');

							/*		Switch Layer Type
							*	Push a fake layer of type restore and unshift the layer
							* 	This is needed for rendering.
							* */
							switch (layer_type) {
								case 'rotate': case 'translate': case 'zoom': case 'stretch':
									Add('layer', {_type: 'restore'});
									data.layer.unshift(sifPlayer._getData(cn));
									break;

								case 'timeloop':
									data.layer.unshift(sifPlayer._getData(cn));
									break;

								default:
									Add(cn.nodeName, sifPlayer._getData(cn))							
									break;
										
								
									
									
							} //Switch Layer Type Over
							break; //layer
								
						case 'waypoint':
							/*  To be sure that it will be an array
							 * */
								if (typeof data[cname] == 'undefined') data[cname] = [];
								//No break here just wanted to be sure that it will be an array.
									
						default:
							Add(cname, sifPlayer._getData(cn))
							break
					} //Switch (cn.nodeName) END
				}
			}
		}

		return data;

	}


	/**
	 * Gets the time in seconds and returns it to milliseconds
	 * 
	 * @function sifPlayer._secsToMillis
	 * @param {String} _s The time in seconds
	 * @return {Number} the millisecs
	 **/	
	sifPlayer._secsToMillis = function (_s) {
			return parseFloat(_s.replace("s",""))*1000;
	}
	
	/**
	 * Gets the time in seconds and returns it to milliseconds
	 * 
	 * @function sifPlayer._canvasTimeToMillis
	 * @param {String} _s The time in seconds and frames
	 * @param {Integer} fps The frames per seccond
	 * @return {Number} the millisecs
	 **/	
	sifPlayer._canvasTimeToMillis = function (_s, fps) {
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
	 * @function sifPlayer._toSifValue
	 * @param {String} value The value to be converted to a sif value
	 * @return {Number || String} the sif value
	 **/		
	sifPlayer._toSifValue = function ( value ) {
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
	 * @function sifPlayer._getEase
	 * @param {String} ease_type the type of ease to catch
	 * @param {Object} ease_type the data to check the value type
	 * @return {object} returns a cteatejs.Ease to be used
	 **/	
	sifPlayer._getEase = function (ease_type) {

		if (ease_type === 'linear') return createjs.Ease.none;
		if (ease_type === 'clamped') return createjs.Ease.none;
		//EaseInOut
		if (ease_type === 'halt') return createjs.Ease.none;
		if (ease_type === 'constant') return sifPlayer.Ease.constant;
		//TCB
		if (ease_type === 'auto') return createjs.Ease.none;

		return false;
	}
	
	sifPlayer.aabbFromEntries = function (e , width) {
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


	sifPlayer._addToDesc = function (o, data) {
		if (data._desc) {
			o.name = data._desc;
			//keep refernce of the layer to the sifobj so we can reach it.
			o.sifobj.desc[o.name] = o;
			
		}
	}
	
	
	sifPlayer._checkTimeline = function (timeline) {	
		var tw = timeline._tweens;
		var pos = timeline.position;
		var check = false;
		if (tw) {	

			for (var i = 0, ii = tw.length; i < ii; i++) {
				if (sifPlayer._checkTween(tw[i])) {check = true;}
				
			}

		}
		return check;
	}
	
	sifPlayer._checkTween = function (tw) {
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

window.sifPlayer = sifPlayer;
}());

