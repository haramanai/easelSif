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
	 * @function sifPlayer._getLayer
	 * @param {Object} parent The parent of new Layer
	 * @param {Object} data the data for the layer
	 * @return {Object} the a sif layer
	 **/	
	easelSif._getLayer = function (sifobj, data) {
		var o;
		if (sifPlayer.easelSif[data._type]) {
			o = new sifPlayer.easelSif[data._type]();
			o.init(sifobj, data);
			return o;
		}
		if (data._type === 'import') {
			o = new sifPlayer.easelSif.Import();
			o.init(sifobj, data);
			return o;
		}
		
		if (data._type === 'switch') {
			o = new sifPlayer.easelSif.Switch();
			o.init(sifobj, data);
			return o;
		}
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

