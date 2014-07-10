import subprocess

subprocess.call(['java', '-jar', '../tools/compiler.jar',
				'--js', '../src/sifplayer.js' ,
				'--js', '../src/easelsif.js' ,
				'--js', '../src/Ease.js' ,
				'--js', '../src/Bone.js' ,
				'--js', '../src/sifobject.js' ,
				'--js', '../src/Param/param.js' ,
				'--js', '../src/Param/vector.js' ,
				'--js', '../src/Param/integer.js' ,
				'--js', '../src/Param/real.js' ,
				'--js', '../src/Param/angle.js' ,
				'--js', '../src/Param/bool.js' ,
				'--js', '../src/Param/composite.js' ,
				'--js', '../src/Param/convert.js' ,
				'--js', '../src/Layers/region.js' ,
				'--js', '../src/Layers/group.js' ,
				'--js', '../src/Layers/outline.js' ,
				'--js', '../src/Layers/circle.js' ,
				'--js', '../src/Layers/import.js' ,
				'--js', '../src/Layers/rotate.js' ,
				'--js', '../src/Layers/stretch.js' ,
				'--js', '../src/Layers/translate.js' ,
				'--js', '../src/Layers/zoom.js' ,
				'--js', '../src/Layers/timeloop.js' ,
				'--js', '../src/Layers/skeleton.js' ,
				'--js_output_file', '../build/easelsif.min.js'])
