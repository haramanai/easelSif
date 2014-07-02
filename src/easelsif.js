/*
* Copyright (c) 2012 haramanai.
* Ease
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


(function() { 	
//Common functions
var easelSif = {};
	

	easelSif._getData = function (node) {

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
							data[cn.getAttribute('name')] = easelSif._getData(cn);
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
									//Add('layer', {_type: 'restore'});
									Add(cn.nodeName, easelSif._getData(cn));
									break;

								case 'timeloop':
									data.layer.unshift(easelSif._getData(cn));
									break;

								default:
									Add(cn.nodeName, easelSif._getData(cn));						
									break;
										
								
									
									
							} //Switch Layer Type Over
							break; //layer
								
						case 'waypoint': case 'entry': case 'bone_root': case 'bone':
							/*  To be sure that it will be an array
							 * */
								if (typeof data[cname] == 'undefined') data[cname] = [];
								//No break here just wanted to be sure that it will be an array.
									
						default:
							Add(cname, easelSif._getData(cn))
							break
					} //Switch (cn.nodeName) END
				}
			}
		}

		return data;

	}

	
	easelSif.getTotalScale = function (o) {
		var sx = 1;
		var sy = 1;
		while (o != null) {
			sx *= o.scaleX;
			o = o.parent;
		}
		return sx;
	}
	
	/**
	 * This function creates and return a new layer for the sifObject
	 * @function sifPlayer._getLayer
	 * @param {Object} parent The parent of new Layer
	 * @param {Object} data the data for the layer
	 * @return {Object} the a sif layer
	 **/	
	easelSif._getLayer = function (parent, data) {
		if (sifPlayer.easelSif[data._type]) return new sifPlayer.easelSif[data._type](parent, data);
		if (data._type === 'import') return new sifPlayer.easelSif.Import(parent, data);
		// Not supported LAYER
		console.log("EERRROOR  "  + data._type + " layer it's not supported");
		//var bad_layer = new sifPlayer.easelSif.Layer();
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
		



	
	


sifPlayer.easelSif = easelSif;
}());

