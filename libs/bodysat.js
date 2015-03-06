/*
* @preserve Copyright (c) 2014 haramanai.
* BodySat
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
		

	
	function BodySat(group, collisionLayer) {
		var V = SAT.Vector;
		var P = SAT.Polygon;
		this.collisionLayerName = (collisionLayer)?collisionLayer:'easelSif_collision';
		this.group = group;
		this.polygon = null;
		this.response = new SAT.Response();
		
		if (group) {
			var e = group.getChildByName(this.collisionLayerName).bline.entry;
			var offset = group.transformation.offset;
			
			// A square
			this.polygon = new P(new V(offset.x,offset.y), [
			  new V(e[0].composite.point.x,e[0].composite.point.y), 
			  new V(e[1].composite.point.x,e[1].composite.point.y), 
			  new V(e[2].composite.point.x,e[2].composite.point.y), 
			  new V(e[3].composite.point.x,e[3].composite.point.y)
			]);
		}

	}
	
	var p = BodySat.prototype;
	
	p.updateGroupPos = function() {
		var p = this.polygon.pos;
		var o = this.group.transformation.offset;
		o.x = p.x;
		o.y = p.y;
	}
	
	p.boundFromColliders = function (colliders) {
		var collided;
		for (var i =0; i < colliders.length; i++) {
			//colliders[i].checkAnim();
			collided = SAT.testPolygonPolygon(this.polygon, colliders[i].polygon, this.response);
			if (collided) {
				this.response.clear();
				this.polygon.pos.sub(this.response.overlapV);
			}
		}
		
	}
	
	p.checkAnim = function() {
		var offset = this.group.transformation.offset;
		var pos = this.polygon.pos;
		if (offset.x !== pos.x || offset.y !== pos.y) {
			console.log('wrong');
			pos.x = offset.x; pos.y = offset.y;
		}
	}



window.BodySat = BodySat;
}());

