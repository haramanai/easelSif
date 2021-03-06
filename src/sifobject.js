/*
* Copyright (c) 2014 haramanai.
* SifObject
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
//requires easelSif
(function() { 

/**
* @class SifObject
* @constructor
* @param {XmlDocument} xmlDoc The xml document that represents the synfig animation
* @param {Number} x The x of the SifObject
* @param {Number} y The y of the SifObject
* @param {Number} width The width of the SifObject
* @param {Number} height The height of the SifObject
* @param {String} sifPath The path of the sif.xml this is needed for import layer
**/
function SifObject(filename , width, height) {
	'use strict'
	this.Container_constructor();
	this.sifobj = this;
	this.sifPath = '';
	p.desc = {};
	this.width = (width)?width:64;
	this.height = (height)?height:64;
	
	this.timeline = new createjs.Timeline();

	if (filename) this.init(filename);

}

var p = createjs.extend(SifObject, createjs.Container);

// public properties:




	p._getData = function (node) {

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
			Add("_" + cn.name, easelSif._toSifValue(cn.value));
		}
		
		// child elements
		for (c = 0; cn = node.childNodes[c]; c++) {
			if (cn.nodeType == 1) {
				cname = cn.nodeName;
				if (cn.childNodes.length == 1 && cn.firstChild.nodeType == 3) {
					// text value
					Add(cn.nodeName, easelSif._toSifValue(cn.firstChild.nodeValue));
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
							data[cn.getAttribute('name')] = this._getData(cn);
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
									Add(cn.nodeName, this._getData(cn));
									break;

								case 'timeloop':
									data.layer.unshift(this._getData(cn));
									break;
									

								default:
									Add(cn.nodeName, this._getData(cn));						
									break;
										
								
									
									
							} //Switch Layer Type Over
							break; //layer

								
						case 'waypoint': case 'entry': case 'bone_root': case 'bone':
							/*  To be sure that it will be an array
							 * */
								if (typeof data[cname] == 'undefined') data[cname] = [];
								//No break here just wanted to be sure that it will be an array.
									
						default:
							Add(cname, this._getData(cn))
							break
					} //Switch (cn.nodeName) END
				}
			}
		}

		return data;

	}


	/** 
	 * Initialization method.
	 * @method init
	 * @param {XmlDocument} xmlDoc The xml document that represents the synfig animation
	 **/
	 p.init = function (filename) {
		var xmlDoc = easelSif.preload.getResult(filename);
		//console.log(filename);
		this.sifPath = filename.slice(0,(filename.search('/'))?filename.search('/') + 1:0 );
		
		//this.initialize();
		this.sifobj = this;
		var data = this._getData(xmlDoc.getElementsByTagName('canvas')[0]);		
		this.timeline.setPaused(true);	
		this._getCanvasData(data);
		
		
	}
	


	
	// private methods:

	/**
	 * @method _getCanvasData
	 * @protected
	 * @param {Object} data the data to get the contruct the SifObject
	 **/
	p._getCanvasData = function (data) {

		//console.log(JSON.stringify(data));
		this.sif = {};
		this.sif.canvas = {};
		
		this.sif.canvas.version = data._version;
		this.sif.canvas.width = data._width;
		this.sif.canvas.height = data._height;
		var _vb = data['_view-box'].split(" ");
		this.sif.canvas.view_box = [parseFloat(_vb[0]), parseFloat(_vb[1]), parseFloat(_vb[2]), parseFloat(_vb[3])];
		this.sif.canvas.antialias = data._antialias;
		this.sif.canvas.fps = data._fps;
		//convert the time to millis cause it's more common for computers...
		this.sif.canvas.begin_time = easelSif._canvasTimeToMillis(data['_begin-time'], this.sif.canvas.fps);
		this.sif.canvas.end_time = easelSif._canvasTimeToMillis(data['_end-time'], this.sif.canvas.fps);
		var _bgcolor = data._bgcolor.split(" ");
		this.sif.canvas.bgcolor = {};
		//convert the color to 256 to much html5 ... I think so...
		this.sif.canvas.bgcolor.r = Math.round(parseFloat(_bgcolor[0]) * 256);
		this.sif.canvas.bgcolor.g = Math.round(parseFloat(_bgcolor[1]) * 256);
		this.sif.canvas.bgcolor.b = Math.round(parseFloat(_bgcolor[2]) * 256);
		this.sif.canvas.bgcolor.a = parseFloat(_bgcolor[3]);
		this.sif.canvas.name = data.name;
		
		
		
		this.sif.canvas.defs = this._getDefs(data.defs);
		this._getBones(data);
		//this._getBones(data);

		
		this.timeline.duration = this.sif.canvas.end_time;
		
		this.scaleX = this.width / (this.sif.canvas.view_box[2] - this.sif.canvas.view_box[0]);
		this.scaleY = this.height / (this.sif.canvas.view_box[3] - this.sif.canvas.view_box[1]);
		
		if (this.sif.canvas.view_box[0]) this.x = this.width / 2;
		if (this.sif.canvas.view_box[1]) this.y = this.height / 2;

		//Get the layers
		this._getLayers(data.layer);



	}
	
	/**
	 * @method _getDefs
	 * @protected
	 * @param {Object} data the data to get defs for SifObj
	 * @return {Object} the defs for the SifObject
	 **/
	p._getDefs = function (data) {
		var defs = {};
		var def_type;
		for (name in data) {

			if (data[name].constructor != Array) {
				if (name === 'animated') {
					defs[data[name]._id]  = {};
					defs[data[name]._id].animated = data[name];
				} else {			
					defs[data[name]._id] = {};
					defs[data[name]._id][name] = data[name];
					defs[data[name]._id]._type = name;							
				}
			} else {
				
					
				for (var j = 0; j < data[name].length; j++) {
					if (name === 'animated') {
						defs[data[name][j]._id] = {};
						defs[data[name][j]._id].animated = data[name][j];
					} else {
						defs[data[name][j]._id] = {};
						defs[data[name][j]._id][name] = data[name][j];
						defs[data[name][j]._id]._type = name
					}
				}			
			}
		}
		//alert(JSON.stringify(defs));
		return defs;
	}
	
	p._getBones = function (data) {
		var sifobj = this;
		var b = data.bones;
		if (!b) return;
		this.sif.bones = {};
		var guid = this.sif.bones.guid = {};
		var g;
		
		for (var i = 0, ii = b.bone.length; i < ii; i++) {
			guid[b.bone[i]._guid] = new easelSif.Bone(sifobj, b.bone[i]);

		}	
		
			
		
	}
	
	p._getLayers = function (_layer) {
		var o = this;
		var sifobj = this.sifobj;
		var _lt;
		var _l;
		if (_layer) {
			
			for (var i = 0, ii = _layer.length; i < ii; i++) {	
				_lt = _layer[i]._type;
				_l = easelSif._getLayer(sifobj, _layer[i]);

				
				if (_lt === 'rotate' || _lt === 'translate' || _lt === 'stretch' || _lt === 'zoom') {
					this.moveChildrenTo(_l);
				}
				
				o.addChild(_l);
				
			}
		}
		
	}
	
	p.moveChildrenTo = function (o) {
		var ch = [];
		for (var i = 0, ii = this.children.length; i < ii; i++) {
			ch.push(this.children[i]);
		}
		
		for (var i = 0, ii = ch.length; i < ii; i++) {
			o.addChild(ch[i]);
		}
	}
	

	/**
	 * 
	 * @method tick
	 * @param {Integer} delta
	 **/		
	p.tick = function (delta) {
		this.setPosition(this.timeline.position + delta);

	}

	
	/**
	 * 
	 * @method setPosition
	 * @param {Integer} time
	 **/	
	p.setPosition = function (position) {
		
		var delta = position - this.timeline.position;
		this.animated = false;
		this.timeline.setPosition(position);
		var new_pos = this.timeline.position;
		var ch = this.children;
		for (var i = 0, ii = this.children.length; i < ii; i++) {
			if (ch[i].unsynced) {
				new_pos = ch[i].setPosition( ch[i].timeline.position + delta , delta);					
			} else {
				new_pos = ch[i].setPosition(new_pos, delta);
				
			}
			if (ch[i].animated) this.childAnimated = this.animated = true;
		}
	}
	
	//this method is for ovveride and setup objects of the sifobj after it's creation
	p.setup = function () {
		
		return true;
	}


easelSif.SifObject = createjs.promote(SifObject, "Container");
}());

