var lib = app.lib.init(function init(lib){
	app.inputHandler.lockPointer(lib.gl.canvas);
	var myUiScene = new uiScene({scene: lib.scene, sceneHolder: document.getElementById('sceneHolder') });
	myUiScene.bindCreatable(document.getElementById('cretableHolder'));

	var zoom = 0.4;
	lib.modelMatrix.scale([zoom,zoom,zoom]);

	lib.camera.poz = app.vector3.init(-1,-5,3);

	app.obj.get({
		ctx: lib.gl.ctx,
		name: 'app/objs/ouranosaurus.json',
		success: function(obj, original) {
			obj.meshes[0].material.colorTexture = app.texture.get({url: 'app/objs/textures/ouran.png', ctx: lib.gl.ctx});
			obj.meshes[0].poz = app.vector3.init(0,0,0.1);
			obj.name = 'Dinosaur';
			lib.scene.push(obj);
			myUiScene.bindScene();
		}
	});

	app.obj.get({
		ctx: lib.gl.ctx,
		name: 'app/objs/anky.json',
		texturesBasePath: 'app/objs/textures/',
		success: function(obj, original) {
			obj.meshes[0].orientation = [0,0,-Math.PI/2];
			obj.meshes[0].poz = app.vector3.init(4,0,0.2);
			obj.name = 'Anky';
			lib.scene.push(obj);
			myUiScene.bindScene();
		}
	});

	app.obj.get({
		ctx: lib.gl.ctx,
		name: 'app/objs/dllo.json',
		texturesBasePath: 'app/objs/textures/',
		success: function(obj, original) {
			obj.meshes[0].poz = app.vector3.init(-4,0,0.1);
			obj.meshes[0].size = 3;
			obj.name = 'Dllo';
			lib.scene.push(obj);
			myUiScene.bindScene();
		}
	});

	app.obj.get({
		ctx: lib.gl.ctx,
		name: 'app/objs/farmHouse.json',
		texturesBasePath: 'app/objs/textures/',
		success: function(obj, original) {
			obj.meshes[0].orientation = [0,0,-Math.PI/2];
			obj.name = 'House';
			lib.scene.push(obj);
			myUiScene.bindScene();
		}
	});

	lib.scene.push(new app.plane({
		size: 1,
		ctx: lib.gl.ctx,
		width: 30,
		height: 30,
		material: {color: [0.3,0.3,0.3]},
		wireframe: true,
		name: 'Plane'
	}));
	myUiScene.bindScene();


}, function update(lib){
	lib.gl.clear();
	lib.cameraControl.update();
	
	document.getElementById('cameraPosition').innerHTML = "Camera Pozition: " + 
		lib.camera.poz.x.toFixed(2) + ', ' + 
		lib.camera.poz.y.toFixed(2) + ', ' + 
		lib.camera.poz.z.toFixed(2) + '';

	lib.renderer.drawScene(lib.scene, lib.camera);
});