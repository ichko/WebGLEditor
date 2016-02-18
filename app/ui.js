var app = app || {};
var lib = lib || {};

var creatableItems = {
	cube: {ref: app.cube},
	cuboid: {ref: app.cuboid},
	icosahedron: {ref: app.icosahedron},
	prism: {ref: app.prism, sides: true},
	pyramid: {ref: app.pyramid, sides: true},
	sphere: {ref: app.sphere},
	torus: {ref: app.torus},
	plane: {ref: app.plane},
	obj: {ref: app.obj.get}
};

var counter = 0;

var uiScene = (function(){

	function uiScene(config){
		this.sceneHolder = config.sceneHolder;
		this.scene = config.scene;
	}

	function render(item, id){
		return '<div class="item '+ (item.active ? 'active' : '') +'" data-Id="' + id + '">' + (item.name || 'blank') + '<span>' + (item.typeName || 'drawable') + '</span></div>';
	}

	function addClickEvent(){
		var items = document.getElementsByClassName('item'),
			me = this;

		for(var i = 0;i < items.length;i++){
			items[i].addEventListener('click', function(){
				itemClicked.call(this, me);
			});

			items[i].addEventListener('dblclick', function(){
				changeName.call(this, me);
			});
		}
	}

	function changeName(ctx){
		var newName = prompt("Name");
		ctx.scene[this.dataset.id].name = newName.length ? newName : 'no_name';
		ctx.bindScene();
	}

	function itemClicked(ctx){
		var items = document.getElementsByClassName('item');
		for(var i = 0;i < items.length;i++){
			items[i].className = 'item';
			ctx.scene[items[i].dataset.id].active = false;
		}

		this.className = 'item active';
		ctx.scene[this.dataset.id].active = true;
		showProps.call(ctx, this.dataset.id);
	}

	function showProps(id){
		var result = '';
		if(this.scene[id].meshes && this.scene[id].meshes.length){
			var cnt = 0;
			this.scene[id].meshes.forEach(function(mesh){
				result += getPopsModel.call(this, mesh, cnt++, id);
			});
		}
		else
			result = getPopsModel.call(this, this.scene[id], id, -1);

		document.getElementById('propHolder').innerHTML = result;
		bindPropChangeEvents.call(this);
	}

	function bindPropChangeEvents(){
		var me = this;
		var items = document.getElementsByClassName('input');
		for(var i = 0;i < items.length;i++)
			items[i].addEventListener('input', function(){
				setNewProp.call(this, me);
			});

		var elements = document.getElementsByClassName('deleteItem');
		for(i = 0;i < elements.length;i++)
			elements[i].addEventListener('click', function(){
				if(confirm("Are you sure?")){
					var id = getChangedItem.call(me, this).id;
					me.scene.splice(id, 1);
					me.bindScene();
					document.getElementById('propHolder').innerHTML = '';
				}
			});
	}

	function getChangedItem(element){
		var parent = element.parentElement.parentElement;
		if(parent.dataset.compid != -1){
			return {
				id: parent.dataset.compid,
				element: this.scene[parent.dataset.compid].meshes[parent.dataset.id]
			};
		}

			return {
				id: parent.dataset.id,
				element: this.scene[parent.dataset.id]
			};
	}

	function setNewProp(ctx){
		var item = getChangedItem.call(ctx, this).element;

		if(typeof this.dataset.pprop !== 'undefined')
			item[this.dataset.prop][this.dataset.pprop] = this.value;
		else
			if(this.dataset.prop == 'color'){
				var rgb = app.math.hexToRgb(this.value);
				item.material[this.dataset.prop] = [rgb.r/255,rgb.g/255,rgb.b/255];
			}
			else if(this.dataset.prop == 'texture'){
				item.material.normalTexture = app.texture.get({ctx: lib.gl.ctx, url: this.value});
			}
			else
				item[this.dataset.prop] = this.value;
	}

	function getPopsModel(item, id, compositeId){
		var variation = 30,
			color = [Math.round(item.material.color[0]*255),
					 Math.round(item.material.color[1]*255),
					 Math.round(item.material.color[2]*255)],
			textureUrl = (item.material.colorTexture && item.material.colorTexture.hasTexture()) ? item.material.colorTexture.getTextureUrl() : '';

		return '<div class="proprs" data-compId="' + (compositeId || -1) + '" data-id="' + id + '">\
			<span class="editableGroup">\
			<span class="popName">Size</span>\
			<input type="range" class="input range" data-prop="size" min="0" max="' + variation + '" step="0.1" value="' + item.size + '"/><br/>\
			</span>\
			\
			<span class="editableGroup">\
			<span class="popName">Color</span>\
			<input type="color" class="input" data-prop="color" value="' + app.math.rgbToHex(color[0], color[1], color[2]) + '"/><br/>\
			</span>\
			\
			<span class="editableGroup">\
			<span class="popName">Texture</span>\
			<input type="text" class="input" data-prop="texture" placeholder="Texture Url" value="' + textureUrl + '"/><br/>\
			</span>\
			\
			<span class="editableGroup">\
			<span class="popName">X</span>\
			<input type="range" class="input range" data-prop="poz" data-pprop="x" min="' + -variation + '" max="' + variation + '" step="0.1" value="' + item.poz.x + '"/><br/>\
			</span>\
			<span class="editableGroup">\
			<span class="popName">Y</span>\
			<input type="range" class="input range" data-prop="poz" data-pprop="y" min="' + -variation + '" max="' + variation + '" step="0.1" value="' + item.poz.y + '"/><br/>\
			</span>\
			<span class="editableGroup">\
			<span class="popName">Z</span>\
			<input type="range" class="input range" data-prop="poz" data-pprop="z" min="' + -variation + '" max="' + variation + '" step="0.1" value="' + item.poz.z + '"/><br/>\
			</span>\
			\
			<span class="editableGroup">\
			<span class="popName">Rotation X</span>\
			<input type="range" class="input range" data-prop="orientation" data-pprop="0" min="-3.14" max="3.14" step="0.01" value="' + item.orientation[0] + '"/><br/>\
			</span>\
			<span class="editableGroup">\
			<span class="popName">Rotation Y</span>\
			<input type="range" class="input range" data-prop="orientation" data-pprop="1" min="-3.14" max="3.14" step="0.01" value="' + item.orientation[1] + '"/><br/>\
			</span>\
			<span class="editableGroup">\
			<span class="popName">Rotation Z</span>\
			<input type="range" class="input range" data-prop="orientation" data-pprop="2" min="-3.14" max="3.14" step="0.01" value="' + item.orientation[2] + '"/><br/>\
			</span>\
			\
			<span class="editableGroup">\
			<span class="popName">Scale X</span>\
			<input type="range" class="input range" data-prop="scale" data-pprop="0" min="' + -variation + '" max="' + variation + '" step="0.1" value="' + item.poz.z + '"/><br/>\
			</span>\
			<span class="editableGroup">\
			<span class="popName">Scale Y</span>\
			<input type="range" class="input range" data-prop="scale" data-pprop="1" min="' + -variation + '" max="' + variation + '" step="0.1" value="' + item.poz.z + '"/><br/>\
			</span>\
			<span class="editableGroup">\
			<span class="popName">Scale Z</span>\
			<input type="range" class="input range" data-prop="scale" data-pprop="2"  min="' + -variation + '" max="' + variation + '" step="0.1" value="' + item.poz.z + '"/><br/>\
			</span>\
			<span><span class="btn deleteItem">DELETE</span></span>\
		</div>';
	}

	uiScene.prototype.bindScene = function(){	
		this.sceneHolder.innerHTML = '';
		var id = 0;
		this.scene.forEach(function(item){
			this.sceneHolder.innerHTML += render(item, id++);
		});

		addClickEvent.call(this);
	};

	uiScene.prototype.bindCreatable = function(cretableHolder){
		var result = '';
		for(var propName in creatableItems)
			result += '<div class="creatableItem">' + propName + '</div>';

		cretableHolder.innerHTML = result;
		bindCreatableEvent(this);
	};

	function bindCreatableEvent(ctx){
		var items = document.getElementsByClassName('creatableItem');
		for(var i = 0;i < items.length;i++)
			items[i].addEventListener('click', function(){
				creatableItemClicked.call(this, ctx);
			});
	}

	function creatableItemClicked(ctx){
		var me = this;
		if(this.innerHTML == 'obj'){
			app.obj.get({
				ctx: lib.gl.ctx,
				name: prompt('Url to the obj file'),
				texturesBasePath: prompt('Textures base path (optional, you can specify texture later)'),
				success: function(obj, original) {
					obj.name = me.innerHTML + '_' + counter++;
					lib.scene.push(obj);
					ctx.bindScene();
				}
			});
		}else{
			var sides = 4;
			if(creatableItems[this.innerHTML].sides)
				sides = +prompt("Number of sides");

			ctx.scene.push(new creatableItems[this.innerHTML].ref({
				name: this.innerHTML + '_' + counter++, 
				sides: sides, 
				material: {color: [0.8,0.5,0.1]}
			}));
		}

		ctx.bindScene();
	}

	return uiScene;

})();