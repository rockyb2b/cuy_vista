class Archivos {
    constructor(options) {
        this.cuy = options.cuy;
        this.index = 0;
        this.archivos = options.archivos;
        // [
        //     'images/glb/cuycaminando.glb',
        //     'images/glb/cajagirando1.glb',
        //     'images/glb/cuycabezagirando.glb',
        //     'images/glb/cuyestrellas.glb'
        // ];
        this.callback = function(){ options.callback()}
        this.tamano_total = 14073552 + 3595876 + 4225396 + 3728832 + 2647408;  /*archivos glb para cargar*/
        this.cargado = 0;
        this.sumatoria_descargado = 0;
        this.escalacuys = 0.25;
        this.escalacajagirando = 1;

    }
  
    cargarArchivos() {
        const objLoader = new THREE.GLTFLoader();
        if (this.index > this.archivos.length - 1) {
            this.callback();
            return;
            otro = model.clone();////////////////////////
            this.cuy.TIEMPO_FIN_RENDER = performance.now() - this.cuy.TIEMPO_RENDER;
            this.cuy.TIEMPO_FIN_RENDER = (this.cuy.TIEMPO_FIN_RENDER/1000).toFixed(2);
            console.warn("FIN CARGA ARCHIVOS en " + this.cuy.TIEMPO_FIN_RENDER + " seg");
            $("#JUEGO").show();
            if (ANIMACION_CUY_PORTADA == false) {
                INICIO_ANIMACION_CUY_PORTADA(); /*CUY PORTADA*/ ;
            }
            //iniciar_websocketservidor();
            window.addEventListener('resize', responsive_canvas, false);
            return;
        }
  
        objLoader.load(this.archivos[this.index], (gltf) => {
            // Your code for loading each file here
            if (this.archivos[this.index] == "images/glb/cuycaminando.glb") {
                this.cuy.model = gltf.scenes[0];
                this.cuy.model.traverse(function (object) {
                    if (object instanceof THREE.Mesh) {
                        object.castShadow = true
                    }
                });
                this.cuy.model.scale.set(this.escalacuys, this.escalacuys, this.escalacuys);
                this.cuy.model.position.set(0, 0, 0);
                this.cuy.model.name = "CUY";

                this.cuy.model.castShadow = true;
                this.cuy.model.receiveShadow = true;
                this.cuy.scene.add(this.cuy.model);
                this.cuy.skeleton = new THREE.SkeletonHelper(this.cuy.model);
                var animations = gltf.animations;
                this.cuy.mixer = new THREE.AnimationMixer(this.cuy.model);
                this.cuy.mixer.clipAction(animations[0]).play();
            }
            if (this.archivos[this.index] == "images/glb/cajagirando1.glb") {
                this.cuy.modelCajaP = gltf.scenes[0];
                this.cuy.modelCajaP.traverse(function (objectCajaGira) {
                    if (objectCajaGira instanceof THREE.Mesh) {
                        //objectCajaGira.castShadow = true
                    }
                });
                this.cuy.modelCajaP.name = "CAJA_GIRANDO";
                this.cuy.modelCajaP.scale.set(this.escalacajagirando,this.escalacajagirando,this.escalacajagirando);
                this.cuy.modelCajaP.position.set(0, 0, 0);
                this.cuy.modelCajaP.position.y=-0.006;

                this.cuy.scene.add(this.cuy.modelCajaP);
                var animations = gltf.animations;
            
                this.cuy.mixerCajaP = new THREE.AnimationMixer(this.cuy.modelCajaP);
                this.cuy.mixerCajaP.clipAction(animations[0]).play();
            }
            if (this.archivos[this.index] == "images/glb/cuycabezagirando.glb") {
                this.cuy.modelCuyDudando = gltf.scenes[0];
                this.cuy.modelCuyDudando.castShadow=true;
                this.cuy.modelCuyDudando.receiveShadow=true;
                this.cuy.modelCuyDudando.traverse(function (objectCuyDudando) {
                    if (objectCuyDudando instanceof THREE.Mesh) {
                        objectCuyDudando.castShadow = true
                    }
                });
                this.cuy.modelCuyDudando.name = "CUY_DUDANDO";

                this.cuy.modelCuyDudando.scale.set(this.escalacuys, this.escalacuys, this.escalacuys);
                this.cuy.modelCuyDudando.position.set(0, 0, 0);
                this.cuy.scene.add(this.cuy.modelCuyDudando);
                var animations = gltf.animations;
                this.cuy.mixerCuyDudando = new THREE.AnimationMixer(this.cuy.modelCuyDudando);
                this.cuy.mixerCuyDudando.clipAction(animations[0]).play();
            }
            if (this.archivos[this.index] =="images/glb/cuyestrellas.glb") {
                this.cuy.modelCuyChoque = gltf.scenes[0];
                this.cuy.modelCuyChoque.traverse(function (objectCuyChoque) {
                    if (objectCuyChoque instanceof THREE.Mesh) {
                        objectCuyChoque.castShadow = true
                    }
                });
                this.cuy.modelCuyChoque.castShadow=true;
                this.cuy.modelCuyChoque.receiveShadow=true;
                this.cuy.modelCuyChoque.name = "CUY_CHOQUE";
                this.cuy.modelCuyChoque.scale.set(this.escalacuys, this.escalacuys, this.escalacuys);
                this.cuy.modelCuyChoque.position.set(0, 0, 0);
                this.cuy.scene.add(this.cuy.modelCuyChoque);
                var animations = gltf.animations;
                this.cuy.mixerCuyChoque = new THREE.AnimationMixer(this.cuy.modelCuyChoque);
                this.cuy.mixerCuyChoque.clipAction(animations[0]).play();
            }
            if (this.archivos[this.index] =="images/glb/cuypremio.glb") {
                this.cuy.modelCuyPremio = gltf.scenes[0];
                this.cuy.modelCuyPremio.traverse(function (objeto) {
                    if (objeto instanceof THREE.Mesh) {
                        objeto.castShadow = true
                    }
                });
                this.cuy.modelCuyPremio.castShadow=true;
                this.cuy.modelCuyPremio.receiveShadow=true;
                this.cuy.modelCuyPremio.name = "CUY_PREMIO";
                this.cuy.modelCuyPremio.scale.set(this.escalacuys, this.escalacuys, this.escalacuys);
                this.cuy.modelCuyPremio.position.set(0, 0, 0);
                this.cuy.scene.add(this.cuy.modelCuyPremio);
                var animations = gltf.animations;
                this.cuy.mixerCuyPremio = new THREE.AnimationMixer(this.cuy.modelCuyPremio);
                this.cuy.mixerCuyPremio.clipAction(animations[0]).play();
            }

            if (this.archivos[this.index] =="images/glb/cuyesperando.glb") {
                this.cuy.modelCuyEsperando = gltf.scenes[0];
                this.cuy.modelCuyEsperando.traverse(function (objeto) {
                    if (objeto instanceof THREE.Mesh) {
                        objeto.castShadow = true
                    }
                });
                this.cuy.modelCuyEsperando.castShadow=true;
                this.cuy.modelCuyEsperando.receiveShadow=true;
                this.cuy.modelCuyEsperando.name = "CUY_PREMIO";
                this.cuy.modelCuyEsperando.scale.set(this.escalacuys, this.escalacuys, this.escalacuys);
                this.cuy.modelCuyEsperando.position.set(0, 0, 0);
                this.cuy.scene.add(this.cuy.modelCuyEsperando);
                var animations = gltf.animations;
                this.cuy.mixerCuyEsperando = new THREE.AnimationMixer(this.cuy.modelCuyEsperando);
                this.cuy.mixerCuyEsperando.clipAction(animations[0]).play();
            }
            if (this.archivos[this.index] =="images/glb/cuysalto.glb") {
                this.cuy.modelCuySalto = gltf.scenes[0];
                this.cuy.modelCuySalto.traverse(function (objeto) {
                    if (objeto instanceof THREE.Mesh) {
                        objeto.castShadow = true
                    }
                });
                this.cuy.modelCuySalto.castShadow=true;
                this.cuy.modelCuySalto.receiveShadow=true;
                this.cuy.modelCuySalto.name = "CUY_PREMIO";
                this.cuy.modelCuySalto.scale.set(this.escalacuys, this.escalacuys, this.escalacuys);
                this.cuy.modelCuySalto.position.set(0, 0, 0);
                this.cuy.scene.add(this.cuy.modelCuySalto);
                var animations = gltf.animations;
                this.cuy.mixerCuySalto = new THREE.AnimationMixer(this.cuy.modelCuySalto);
                this.cuy.mixerCuySalto.clipAction(animations[0]).play();
            }
            this.index++;
            this.cargarArchivos();
        }, this.progresoDescarga);
    }
    progresoDescarga(xhr) {
        if ( xhr.lengthComputable ) {
            var falta = xhr.total - xhr.loaded;
            var cargado_estavuelta = xhr.loaded - this.cargado;
            this.sumatoria_descargado = this.sumatoria_descargado + cargado_estavuelta;
            this.cargado = xhr.loaded;
            if(falta === 0)
            {
                this.cargado = 0;
            }
            var percentCompletadoTotal = this.sumatoria_descargado / this.tamano_total * 100;
            if($("#cargador_overlay").length > 0){
                $("#cargador_overlay").text(Math.round( percentCompletadoTotal , 2) + "%" )
            }
        }
    }
}
export { Archivos }
//   var index = 0;
// var archivos = [
//     'images/glb/cuycaminando.glb',
//     'images/glb/cajagirando1.glb',
//     'images/glb/cuycabezagirando.glb',
//     'images/glb/cuyestrellas.glb'
// ];
// function cargar_archivos() {
//     var objLoader = new THREE.GLTFLoader();
//     if (index > archivos.length - 1) {
//         otro = model.clone();////////////////////////
//         TIEMPO_FIN_RENDER = performance.now() - TIEMPO_RENDER;
//         TIEMPO_FIN_RENDER = (TIEMPO_FIN_RENDER/1000).toFixed(2);
//         console.warn("FIN CARGA ARCHIVOS en "+TIEMPO_FIN_RENDER + " seg");
//         $("#JUEGO").show();
//         if (ANIMACION_CUY_PORTADA == false) {
//             INICIO_ANIMACION_CUY_PORTADA(); /*CUY PORTADA*/ ;
//         }
//         //iniciar_websocketservidor();
//         window.addEventListener('resize', responsive_canvas, false);
//         return;
//     };

//     objLoader.load(archivos[index], function (gltf) {
//         if (archivos[index] == "images/glb/cuycaminando.glb") {
//             model = gltf.scenes[0];
//             model.traverse(function (object) {
//                 if (object instanceof THREE.Mesh) {
//                     object.castShadow = true
//                 }
//             });
//             model.scale.set(escalacuys, escalacuys, escalacuys);
//             model.position.set(0, 0, 0);
//             model.name = "CUY";

//             model.castShadow = true;
//             model.receiveShadow = true;
//             scene.add(model);
//             window.skeleton = new THREE.SkeletonHelper(model);
//             var animations = gltf.animations;
//             mixer = new THREE.AnimationMixer(model);
//             mixer.clipAction(animations[0]).play();
//         }
//         if (archivos[index] == "images/glb/cajagirando1.glb") {
//             modelCajaP = gltf.scenes[0];
//             modelCajaP.traverse(function (objectCajaGira) {
//                 if (objectCajaGira instanceof THREE.Mesh) {
//                     //objectCajaGira.castShadow = true
//                 }
//             });
//             modelCajaP.name = "CAJA_GIRANDO";
//             modelCajaP.scale.set(escalacajagirando,escalacajagirando,escalacajagirando);
//             modelCajaP.position.set(0, 0, 0);
//             modelCajaP.position.y=-0.006;

//             scene.add(modelCajaP);
//             var animations = gltf.animations;
           
//             mixerCajaP = new THREE.AnimationMixer(modelCajaP);
//             mixerCajaP.clipAction(animations[0]).play();
//         }
//         if (archivos[index] == "images/glb/cuycabezagirando.glb") {
//             modelCuyDudando = gltf.scenes[0];
//             modelCuyDudando.castShadow=true;
//             modelCuyDudando.receiveShadow=true;
//             modelCuyDudando.traverse(function (objectCuyDudando) {
//                 if (objectCuyDudando instanceof THREE.Mesh) {
//                     objectCuyDudando.castShadow = true
//                 }
//             });
//             modelCuyDudando.name = "CUY_DUDANDO";

//             modelCuyDudando.scale.set(escalacuys, escalacuys, escalacuys);
//             modelCuyDudando.position.set(0, 0, 0);
//             scene.add(modelCuyDudando);
//             var animations = gltf.animations;
//             mixerCuyDudando = new THREE.AnimationMixer(modelCuyDudando);
//             mixerCuyDudando.clipAction(animations[0]).play();
//         }
//         if (archivos[index] =="images/glb/cuyestrellas.glb") {
//             modelCuyChoque = gltf.scenes[0];
//             modelCuyChoque.traverse(function (objectCuyChoque) {
//                 if (objectCuyChoque instanceof THREE.Mesh) {
//                     objectCuyChoque.castShadow = true
//                 }
//             });
//             modelCuyChoque.castShadow=true;
//             modelCuyChoque.receiveShadow=true;
//             modelCuyChoque.name = "CUY_CHOQUE";
//             modelCuyChoque.scale.set(escalacuys, escalacuys, escalacuys);
//             modelCuyChoque.position.set(0, 0, 0);
//             scene.add(modelCuyChoque);
//             var animations = gltf.animations;
//             mixerCuyChoque = new THREE.AnimationMixer(modelCuyChoque);
//             mixerCuyChoque.clipAction(animations[0]).play();
//         }
//         if (archivos[index] =="images/glb/cuypremio.glb") {
//             modelCuyPremio = gltf.scenes[0];
//             modelCuyPremio.traverse(function (objeto) {
//                 if (objeto instanceof THREE.Mesh) {
//                     objeto.castShadow = true
//                 }
//             });
//             modelCuyPremio.castShadow=true;
//             modelCuyPremio.receiveShadow=true;
//             modelCuyPremio.name = "CUY_PREMIO";
//             modelCuyPremio.scale.set(escalacuys, escalacuys, escalacuys);
//             modelCuyPremio.position.set(0, 0, 0);
//             scene.add(modelCuyPremio);
//             var animations = gltf.animations;
//             mixerCuyPremio = new THREE.AnimationMixer(modelCuyPremio);
//             mixerCuyPremio.clipAction(animations[0]).play();
//         }

//         if (archivos[index] =="images/glb/cuyesperando.glb") {
//             modelCuyEsperando = gltf.scenes[0];
//             modelCuyEsperando.traverse(function (objeto) {
//                 if (objeto instanceof THREE.Mesh) {
//                     objeto.castShadow = true
//                 }
//             });
//             modelCuyEsperando.castShadow=true;
//             modelCuyEsperando.receiveShadow=true;
//             modelCuyEsperando.name = "CUY_PREMIO";
//             modelCuyEsperando.scale.set(escalacuys, escalacuys, escalacuys);
//             modelCuyEsperando.position.set(0, 0, 0);
//             scene.add(modelCuyEsperando);
//             var animations = gltf.animations;
//             mixerCuyEsperando = new THREE.AnimationMixer(modelCuyEsperando);
//             mixerCuyEsperando.clipAction(animations[0]).play();
//         }
//         if (archivos[index] =="images/glb/cuysalto.glb") {
//             modelCuySalto = gltf.scenes[0];
//             modelCuySalto.traverse(function (objeto) {
//                 if (objeto instanceof THREE.Mesh) {
//                     objeto.castShadow = true
//                 }
//             });
//             modelCuySalto.castShadow=true;
//             modelCuySalto.receiveShadow=true;
//             modelCuySalto.name = "CUY_PREMIO";
//             modelCuySalto.scale.set(escalacuys, escalacuys, escalacuys);
//             modelCuySalto.position.set(0, 0, 0);
//             scene.add(modelCuySalto);
//             var animations = gltf.animations;
//             mixerCuySalto = new THREE.AnimationMixer(modelCuySalto);
//             mixerCuySalto.clipAction(animations[0]).play();
//         }
//         index++;
//         cargar_archivos();

//     } ,progreso_descarga );
// }

// tamano_total = 14073552 + 3595876 + 4225396 + 3728832 + 2647408;  /*archivos glb para cargar*/
// cargado = 0;
// sumatoria_descargado = 0;
// progreso_descarga = function( xhr ) {
//     if ( xhr.lengthComputable ) {
//         var falta = xhr.total-xhr.loaded;
//         var cargado_estavuelta = xhr.loaded-cargado;
//         sumatoria_descargado = sumatoria_descargado + cargado_estavuelta;
//         cargado = xhr.loaded;
//         if(falta === 0){cargado = 0;}
//         // var percentComplete = xhr.loaded / xhr.total * 100;
//         var percentCompletadoTotal = sumatoria_descargado / tamano_total * 100;
//         if($("#cargador_overlay").length > 0){
//             $("#cargador_overlay").text(Math.round( percentCompletadoTotal,2)+"%")
//         }
//     //console.info( Math.round( percentComplete, 2 ) + '% downloaded' +"   %total= "+  Math.round( percentCompletadoTotal,2));
//     }
// };