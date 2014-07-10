/*
* Copyright (c) 2014 haramanai.
* PasteCanvas
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

/**
* @class group
* @extends Layer
* @constructor
* @param {Object} parent The parent of the Layer
* @param {Object} data The data for the Layer
**/	 	
function group(sifobj, data) {
	this.sifobj = sifobj;
	this.init(data);
}

var p = group.prototype = new createjs.Container();
	
	/** 
	 * Initialization method.
	 * @method init
	 * @param {Object} parent The parent of the Layer
	 * @param {Object} data The data for the Layer
	 **/
	p.init = function (data) {
		var _set = sifPlayer.param._set;
		this.initialize()
		this.timeline = new createjs.Timeline();
		this.timeline.setPaused(true);
		this.timeline.duration = this.sifobj.timeline.duration;
		this.type = 'group';


		_set(this, 'amount', 'real', this, data.amount);
		_set(this, 'blend_method', 'integer', this, data.blend_method);
		_set(this, 'origin', 'vector', this, data.origin);

		this.transformation = {};
		var composite = data.transformation.composite;
		
		//COMPOSIT TRANSORMATION
		if (composite) {		
			_set(this, 'offset', 'vector', this.transformation, composite.offset);
			_set(this, 'angle', 'angle', this.transformation, composite.angle);
			_set(this, 'skew_angle', 'angle', this.transformation, composite.skew_angle);
			_set(this, 'scale', 'vector', this.transformation, composite.scale);
			_set(this, 'skew_angle', 'angle', this.transformation, composite.skew_angle);

			this.getMatrix = group.getMatrixComposite;
			this.scaleX = this.transformation.scale.getX();
		}
		
		//BONE TRANSFORMATION
		var bone_link = data.transformation.bone_link;
		if (bone_link) {
			this.bone = bone_link.bone[0].bone_valuenode._guid;
			bone_link = data.transformation.bone_link.base_value.composite;
			var base_value = {};
			
			_set(this, 'offset', 'vector', base_value, bone_link.offset);
			_set(this, 'angle', 'angle', base_value, bone_link.angle);
			_set(this, 'skew_angle', 'vector', base_value, bone_link.skew_angle);
			_set(this, 'scale', 'vector', base_value, bone_link.scale);
			
			this.base_value = base_value;

			this.getMatrix = group.getMatrixBone;
			this.getMatrix();
		}
		
		
		
		sifPlayer._addToDesc(this, data);

		if (data.canvas) {
			if (data.canvas.canvas) {
				this._getLayers(data.canvas.canvas.layer);
			} else {
				this._getLayers(this.sifobj.sif.canvas.defs[data.canvas._use].canvas.layer);		
			}
		}
		
		//alert(JSON.stringify(this.children));
		//this.updateValues();
		
	}
	
	p._getLayers = sifPlayer.easelSif.SifObject.prototype._getLayers;
	
	p.moveChildrenTo = sifPlayer.easelSif.SifObject.prototype.moveChildrenTo;


	/**
	 * moves the time line of the layer to the position
	 * @method setPosition
	 * param {Integer}
	 **/		
	p.setPosition = function (position, delta) {
		this.childAnimated = false;
		//For now the canvas
		this.animated = (this.bone)? true : sifPlayer._checkTimeline(this.timeline);
		var scale;
		this.timeline.setPosition(position);
		var new_pos = this.timeline.position;
		var ch = this.children;
		var ab;
		for (var i = 0, ii = ch.length; i < ii; i++) {
			if (ch[i].unsynced) {
				new_pos = ch[i].setPosition( ch[i].timeline.position + delta , delta);
			} else {
				new_pos = ch[i].setPosition(new_pos, delta);
			}
			
			if (ch[i].animated) {
				ch[i].uncache();
				this.childAnimated = this.animated = true;
			}
			//console.log(ch[i].getBounds());
		}
		
		if (this.childAnimated) {this.uncache();}

		if (!this.childAnimated && !this.cacheID && this.type === 'group') {
			this.uncache();
			//this._bounds = null;
			scale = Math.abs(sifPlayer.easelSif.getTotalScale(this));
			ab = this.getBounds();
			if (ab) {
				this.cache(ab.x , ab.y, ab.width, ab.height, scale);
				
			}
			
		}

		return position;
	}

	
	p.updateContext = function (ctx) {
		//This step is done from easeljs anyway.
		var mtx = this.getMatrix();
		ctx.globalAlpha *= this.amount.getValue();
		ctx.globalCompositeOperation = sifPlayer.easelSif._getBlend( this.blend_method.getValue() );		
		ctx.transform(mtx.a, mtx.b, mtx.c, mtx.d, mtx.tx, mtx.ty);
		
	}
	
		
	
	group.getMatrixBone = function (matrix) {
		var bone = this.sifobj.sif.bones.guid[this.bone];
		var base = this.base_value;
		var mtx = this._matrix.copy(bone._m);
		mtx.appendTransform(base.offset.getX(), base.offset.getY(), base.scale.getX(), base.scale.getY(), base.angle.getValue(), 0, 0 ,0,0);

		matrix = mtx.copy(mtx); 
		return matrix;
		
	}
	
	group.getMatrixComposite = function (matrix) {
		var tr = this.transformation;
		var orx = this.origin.getX() + tr.offset.getX();
		var ory = this.origin.getY()+ tr.offset.getY();

	
		
		var sx = this.scaleX = tr.scale.getX();
		var sy = this.scaleY = tr.scale.getY();


		var a = tr.angle.getValue();
		var mtx = this._matrix.identity().appendTransform(orx, ory, sx, sy, a, 0,0,0,0);
		
		matrix = mtx.copy(mtx); 
		return matrix;
	}
	
	


sifPlayer.easelSif.group = group;
}());
