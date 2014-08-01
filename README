easelSif
---

 is a lib that uses [createJs](http://www.createjs.com/#!/CreateJS) 
to load [preload](http://www.createjs.com/#!/PreloadJS), 
display [easelJs](http://www.createjs.com/#!/EaselJS) 
and animate [tweenJs](http://www.createjs.com/#!/TweenJS) 
unzipped sif [Synfig](http://www.synfig.org) files.

All published under the MIT license.


The object that is produced is a Container object of easeljs all the layers are easeljs objects.

It is not complete future. 
It supports the types of layers:

	Group layer (Container)
	Region  (Shape)
	Outline (without point width) (Shape)
	Circle  (Shape)
	Import (image)	
	Scale  (Container) ## ALL the tranformation layers are containers better use group layer
	Translate  (Container)
	Rotate  (Container)
	Zoom	(Container)
	Stretch  (Container)
	Timeloop  (DisplayObject)

The blend methods that much the globalCompositeOperation of the context2d

	Composite		=>  source-over
	Straight		=>  copy
	Onto			=>  source-atop //With a bug that will render onto everything in the layer list.
	Straight Onto	=>  source-in
	Behind			=>  destination-over
	Alpha Over		=>  destination-out
	Alpha Brighter	=>  destination-in

The convert that you can use.

Vector converts to :

	radial composite
	composite
	add
	subtract
	scale

Real converts to:

	add
	subtract
	scale
	cos
	sine
	expotential
	dotproduct
	logarithm
	reciprocal

Angle converts to:

	add
	subtract
	scale
	atan2
	cos
	dotproduct (remember that this is using two Math.sqrt)
	vectorAngle

Integer converts to:

	add
	subtract
	scale

Bool converts to:

	and






Run the easelSif.html to see it. 

There is a min version in the build folder

The sifObject contains a property named desc.
Desc is a reference of all the layers by name.
For example if you wand to the layer named “circle”
If there is only one 'circle' sifobj.desc['circle'] will be a refernce of the layer. 
But if there are more layers named 'circle' then the
sifobj.desc['circle'] will be an array with all the layers named 'circle'

Also if you wand your animation to loop you can tell the timeline loop
sifobj.timeline.loop = true;

You can unsync a layer by setting the property unsynced to True


important
----

If you want to create a stage for easeljs and then import synfig files 
that will work properly the x and y values you must set the Canvas property's (F8) Image Area to have
top left to x : 0.0, y : 0.0

For example 

	Top Left	    X: 0,00000		Y: 0,00000
	Bottom Right    X: 8,00000		Y: 4,50000
	


