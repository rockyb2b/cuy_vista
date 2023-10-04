class Archivos {
    constructor(options) {
        // this.cuy = options.cuy_clase;
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
            if (this.archivos[index] == "images/glb/cuycaminando.glb") {
                window.model = gltf.scenes[0];
                window.model.traverse(function (object) {
                    if (object instanceof THREE.Mesh) {
                        object.castShadow = true
                    }
                });
                window.model.scale.set(escalacuys, escalacuys, escalacuys);
                window.model.position.set(0, 0, 0);
                window.model.name = "CUY";

                window.model.castShadow = true;
                window.model.receiveShadow = true;
                (window.scene).add(window.model);
                window.skeleton = new THREE.SkeletonHelper(window.model);
                var animations = gltf.animations;
                window.mixer = new THREE.AnimationMixer(window.model);
                window.mixer.clipAction(animations[0]).play();
            }
            if (this.archivos[index] == "images/glb/cajagirando1.glb") {
                window.modelCajaP = gltf.scenes[0];
                window.modelCajaP.traverse(function (objectCajaGira) {
                    if (objectCajaGira instanceof THREE.Mesh) {
                        //objectCajaGira.castShadow = true
                    }
                });
                window.modelCajaP.name = "CAJA_GIRANDO";
                window.modelCajaP.scale.set(escalacajagirando,escalacajagirando,escalacajagirando);
                window.modelCajaP.position.set(0, 0, 0);
                window.modelCajaP.position.y=-0.006;

                window.scene.add(window.modelCajaP);
                var animations = gltf.animations;
            
                window.mixerCajaP = new THREE.AnimationMixer(window.modelCajaP);
                window.mixerCajaP.clipAction(animations[0]).play();
            }
            if (this.archivos[index] == "images/glb/cuycabezagirando.glb") {
                window.modelCuyDudando = gltf.scenes[0];
                window.modelCuyDudando.castShadow=true;
                window.modelCuyDudando.receiveShadow=true;
                window.modelCuyDudando.traverse(function (objectCuyDudando) {
                    if (objectCuyDudando instanceof THREE.Mesh) {
                        objectCuyDudando.castShadow = true
                    }
                });
                window.modelCuyDudando.name = "CUY_DUDANDO";

                window.modelCuyDudando.scale.set(escalacuys, escalacuys, escalacuys);
                window.modelCuyDudando.position.set(0, 0, 0);
                window.scene.add(window.modelCuyDudando);
                var animations = gltf.animations;
                window.mixerCuyDudando = new THREE.AnimationMixer(window.modelCuyDudando);
                window.mixerCuyDudando.clipAction(animations[0]).play();
            }
            if (this.archivos[index] =="images/glb/cuyestrellas.glb") {
                window.modelCuyChoque = gltf.scenes[0];
                window.modelCuyChoque.traverse(function (objectCuyChoque) {
                    if (objectCuyChoque instanceof THREE.Mesh) {
                        objectCuyChoque.castShadow = true
                    }
                });
                window.modelCuyChoque.castShadow=true;
                window.modelCuyChoque.receiveShadow=true;
                window.modelCuyChoque.name = "CUY_CHOQUE";
                window.modelCuyChoque.scale.set(escalacuys, escalacuys, escalacuys);
                window.modelCuyChoque.position.set(0, 0, 0);
                window.scene.add(window.modelCuyChoque);
                var animations = gltf.animations;
                window.mixerCuyChoque = new THREE.AnimationMixer(window.modelCuyChoque);
                window.mixerCuyChoque.clipAction(animations[0]).play();
            }
            if (this.archivos[index] =="images/glb/cuypremio.glb") {
                window.modelCuyPremio = gltf.scenes[0];
                window.modelCuyPremio.traverse(function (objeto) {
                    if (objeto instanceof THREE.Mesh) {
                        objeto.castShadow = true
                    }
                });
                window.modelCuyPremio.castShadow=true;
                window.modelCuyPremio.receiveShadow=true;
                window.modelCuyPremio.name = "CUY_PREMIO";
                window.modelCuyPremio.scale.set(escalacuys, escalacuys, escalacuys);
                window.modelCuyPremio.position.set(0, 0, 0);
                window.scene.add(window.modelCuyPremio);
                var animations = gltf.animations;
                window.mixerCuyPremio = new THREE.AnimationMixer(window.modelCuyPremio);
                window.mixerCuyPremio.clipAction(animations[0]).play();
            }

            if (this.archivos[index] =="images/glb/cuyesperando.glb") {
                window.modelCuyEsperando = gltf.scenes[0];
                window.modelCuyEsperando.traverse(function (objeto) {
                    if (objeto instanceof THREE.Mesh) {
                        objeto.castShadow = true
                    }
                });
                window.modelCuyEsperando.castShadow=true;
                window.modelCuyEsperando.receiveShadow=true;
                window.modelCuyEsperando.name = "CUY_PREMIO";
                window.modelCuyEsperando.scale.set(escalacuys, escalacuys, escalacuys);
                window.modelCuyEsperando.position.set(0, 0, 0);
                window.scene.add(window.modelCuyEsperando);
                var animations = gltf.animations;
                window.mixerCuyEsperando = new THREE.AnimationMixer(window.modelCuyEsperando);
                window.mixerCuyEsperando.clipAction(animations[0]).play();
            }
            if (this.archivos[index] =="images/glb/cuysalto.glb") {
                window.modelCuySalto = gltf.scenes[0];
                window.modelCuySalto.traverse(function (objeto) {
                    if (objeto instanceof THREE.Mesh) {
                        objeto.castShadow = true
                    }
                });
                window.modelCuySalto.castShadow=true;
                window.modelCuySalto.receiveShadow=true;
                window.modelCuySalto.name = "CUY_PREMIO";
                window.modelCuySalto.scale.set(escalacuys, escalacuys, escalacuys);
                window.modelCuySalto.position.set(0, 0, 0);
                window.scene.add(window.modelCuySalto);
                var animations = gltf.animations;
                window.mixerCuySalto = new THREE.AnimationMixer(window.modelCuySalto);
                window.mixerCuySalto.clipAction(animations[0]).play();
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
                cargado = 0;
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