(function(){
	'use strict'
	var scene, renderer, camera, stats;
	var modelCaja,modelCuyEsperando, skeleton, 
	mixer, mixerCaja,mixerCuyDudando,mixerCajaP,mixerCuyPremio,mixerCuyEsperando,mixerCuySalto, clock,clockCuyPremio,clockCuyEsperando,clockCuySalto;
	var crossFadeControls = [];
	var idleAction, walkAction, runAction;
	var idleWeight, walkWeight, runWeight;
	var actions, settings;
	var singleStepMode = false;
	var sizeOfNextStep = 0;
	var loaded = false;
	var i = 0;
	var ganador = 0;
	var controls;
	var posicionZ = 0;
	var CONTROLES=false;
	var contenedor="div_animacionganador";
	var INICIAR_RENDER= function() {
		var widthtotal=(window.innerWidth*0.25);
		var heighttotal=(window.innerWidth*0.25);

	    clock = new THREE.Clock();
	    clockCuyPremio = new THREE.Clock();
	    clockCuyEsperando = new THREE.Clock();
	    var container = document.getElementById(contenedor);
	    camera = new THREE.PerspectiveCamera(60, widthtotal / heighttotal, 1, 100);
	    camera.position.set(0, 10, 0);
	    // //controls
	    if(CONTROLES){
	        controls = new THREE.OrbitControls(camera);
	        controls.rotateSpeed = 1.0;
	        controls.zoomSpeed = 1.2;
	        controls.panSpeed = 0.8;
	        controls.autoRotate = true;
	    }
	    //escena
	    scene = new THREE.Scene();
	    scene.background = new THREE.Color(0xa0a0a0);
	    scene.fog = new THREE.Fog(0xa0a0a0, 10, 50);
	    var hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444);
	    hemiLight.position.set(0, 20, 0);
	    scene.add(hemiLight);
	    var dirLight = new THREE.DirectionalLight(0xffffff);
	    dirLight.position.set(-3, 20, -15);
	    dirLight.castShadow = true;
	    dirLight.shadow.camera.top = 2;
	    dirLight.shadow.camera.bottom = -2;
	    dirLight.shadow.camera.left = -2;
	    dirLight.shadow.camera.right = 2;
	    dirLight.shadow.camera.near = 0.1;
	    dirLight.shadow.camera.far = 40;

	    dirLight.shadow.mapSize.height=2048;
	    dirLight.shadow.mapSize.height=2048;
	    scene.add(dirLight);
	    camera.lookAt(new THREE.Vector3(0, 0, 0));


	    var mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(100, 100), new THREE.MeshPhongMaterial({
	        color: 0x999999,
	        depthWrite: false
	    }));
	    mesh.rotation.x = -Math.PI / 2;
	    mesh.receiveShadow = true;
	    scene.add(mesh);
	    //var material = new THREE.MeshBasicMaterial();
	    var loader = new THREE.GLTFLoader();
	    // Plano y Cajas
	    var loaderCaja = new THREE.GLTFLoader();

	    var TIEMPO_RENDER = performance.now();
	    loaderCaja.load('images/glb/tablerograss.glb', function (gltfCaja) {
	        modelCaja = gltfCaja.scenes[0];
	        modelCaja.traverse(function (object) {
	            if (object instanceof THREE.Mesh) {
	                object.castShadow = true;
	            }
	        });
	        // modelCaja.scale.set(0.005, 0.005, 0.005);
	        modelCaja.children[0].children[0].position.y=0.28; 
	        var escalatablero=0.4;
	         modelCaja.children[0].children[0].children[1].scale.set(escalatablero,escalatablero,escalatablero);/// suelo 
	        modelCaja.name ="TABLA_CAJAS";
	        scene.add(modelCaja);
	        //cargar_archivos(); ///////////////////////
	        // modelCaja.children[0].children[0].rotation.y = 180 * (Math.PI / 180); ////rotar cajas para que caja X verde este arriba
	       modelCaja.children[0].children[0].children[1].receiveShadow=true;

	    } );
	    renderer = new THREE.WebGLRenderer({antialias: true});

	    renderer.setPixelRatio(window.devicePixelRatio);
	    renderer.setSize(widthtotal, heighttotal);
	    renderer.gammaOutput = true;
	    renderer.gammaFactor = 2.2;
	    renderer.shadowMap.enabled = true;
	    container.appendChild(renderer.domElement);
	}();
	var index=0;
	var archivos=['images/glb/cuyesperando.glb'];
	var cargar_archivos=
	    function(index){
	    	var TIEMPO_RENDER=performance.now();
			    var objLoader = new THREE.GLTFLoader();
			    if (index > archivos.length - 1) {
			    	this.index=0;
			        TIEMPO_FIN_RENDER=performance.now()-TIEMPO_RENDER;
			        TIEMPO_FIN_RENDER=(TIEMPO_FIN_RENDER/1000).toFixed(2);
			        console.warn("FIN CARGA ARCHIVOS en "+TIEMPO_FIN_RENDER + " seg");
			        ///NUEVOOOOOOOOOO
			        //window.addEventListener('resize', responsive_canvas, false);
			        return;
			    };

			    objLoader.load(archivos[index], function (gltf) {
			        if (archivos[index] =="images/glb/cuyesperando.glb") {
			            modelCuyEsperando = gltf.scenes[0];
			            modelCuyEsperando.traverse(function (objeto) {
			                if (objeto instanceof THREE.Mesh) {
			                    objeto.castShadow = true
			                }
			            });
			            modelCuyEsperando.castShadow=true;
			            modelCuyEsperando.receiveShadow=true;
			            modelCuyEsperando.name = "CUY_PREMIO";
			            modelCuyEsperando.scale.set(escalacuys, escalacuys, escalacuys);
			            modelCuyEsperando.position.set(0, 0, 0);
			            scene.add(modelCuyEsperando);
			            var animations = gltf.animations;
			            mixerCuyEsperando = new THREE.AnimationMixer(modelCuyEsperando);
			            mixerCuyEsperando.clipAction(animations[0]).play();
			        }
			        index++;
			        cargar_archivos(index);
			    } );
	}
})()