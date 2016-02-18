var lib = app.lib.init(function init(lib){
	app.inputHandler.lockPointer(lib.gl.canvas);
	var myUiScene = new uiScene({scene: lib.scene, sceneHolder: document.getElementById('sceneHolder') });
	myUiScene.bindCreatable(document.getElementById('cretableHolder'));

	var zoom = 0.4;
	lib.modelMatrix.scale([zoom,zoom,zoom]);

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