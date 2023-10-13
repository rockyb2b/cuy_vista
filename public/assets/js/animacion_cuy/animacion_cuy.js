///////////FUNCIONESSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS
var index = 0;
var archivos = [
    'images/glb/cuycaminando.glb',
    'images/glb/cajagirando1.glb',
    'images/glb/cuycabezagirando.glb',
    // 'images/cuyChoqueGLB.glb'
    'images/glb/cuyestrellas.glb'
    // ,'images/glb/cuyesperando.glb'
    // ,'images/glb/cuypremio.glb'
    // ,'images/glb/cuysalto.glb'
    // ,'images/glb/tablero.glb'
];
dt = 0.03 // velocidad movimiento cuy
dtrotacion = 0.05; // velocidad rotacion cuy;
escalacuys = 0.25;
escalacajagirando = 1;
intervalo_consultaevento = 2000;
buscando_evento = false;
ANIMACION_CUY = false;
ANIMACION_CUY_PORTADA = false;
TEXTO_NEON_PORTADA = "¿A donde va el cuy? ¡Realiza Tu Apuesta!";
TEXTO_CONTADOR = "APUESTAS SE CIERRAN EN";
TEXTO_ESPERAR_TERMINO_EVENTO = "EVENTO TERMINA EN";

//TIEMPO_GANADOR_PORTADA=10000;
function camara_mirar(objeto){
    camera.position.x = objeto.position.x ;
    camera.position.y = objeto.position.y + 1.6;
    camera.position.z = objeto.position.z +5.5;
    camera.lookAt(objeto.position);
}

function animar_desvanacer() {
    animar=requestAnimationFrame(animar_desvanacer);
    camera1.lookAt(new THREE.Vector3(0, 0, 0));
    camera2.lookAt(new THREE.Vector3(0, 0, 0));

    quadmaterial.uniforms.mixRatio.value += valueToAdd;
    if (quadmaterial.uniforms.mixRatio.value > 1.25 || quadmaterial.uniforms.mixRatio.value < -0.25) {
        alert("termino");
        cancelAnimationFrame(animar)
    }

    renderer.render(scene, camera1, rtTexture1);
    renderer.render(scene, camera2, rtTexture2);
    renderer.render(quadscene, cameraquad, null, true);
}

function camara_inicio(){
    camera.position.x = 0;
    camera.position.y = 10;
    camera.position.z = 0;
    camera.lookAt(new THREE.Vector3(0, 0, 0));
}

function animar_camara() {
    TWEEN.update();
    var_animarcamara = requestAnimationFrame(animar_camara);
    renderer.render(scene, camera);
    if(typeof controls!="undefined"){
        controls.update();
    }
}

function camara_movimiento_inicio(hacia,camera,tiempo, callback){
    var from = {
        x: camera.position.x,
        y: camera.position.y,
        z: camera.position.z
    };
    var to = {
        x: hacia.x,
        y: hacia.y,
        z: hacia.z
    };
    var tween = new TWEEN.Tween(from)
        .to(to, tiempo)
        .easing(TWEEN.Easing.Linear.None)
        .onUpdate(function () {
        camera.position.set(this.x, this.y, this.z);
        camera.lookAt(new THREE.Vector3(0, 0, 0));
    })
        .onStart(function(){
            //  camera.position.x=to.x;camera.position.z=to.z;camera.position.y=to.y
        })
        .onComplete(function () {
            detener_var_animarcamara();
            camera.lookAt(new THREE.Vector3(0, 0, 0));
    })
        .start();
}

function camara_movimiento_girando(hacia,camera,tiempo, callback){
    var from = {
        x: camera.position.x,
        y: camera.position.y,
        z: camera.position.z
    };
    var to = {
        x: hacia.x,
        y: hacia.y,
        z: hacia.z
    };
    var tween = new TWEEN.Tween(from)
        .to(to, tiempo)
        .easing(TWEEN.Easing.Linear.None)
        .onUpdate(function () {
        camera.position.set(this.x, this.y, this.z);
        camera.lookAt(new THREE.Vector3(0, 0, 0));
    })
        .onStart(function(){
            //  camera.position.x=to.x;camera.position.z=to.z;camera.position.y=to.y
        })
        .onComplete(function () {
            callback();
    })
        .start();
}

function get_caja(numero){
    var cajaobjeto = {};
    if(numero == 0 || numero == "x"){
        numero = "x";
    }
    $(CAJAS_ARRAY).each(function(i,e){
        if(e.name == numero){
            cajaobjeto = e;
            return false;
        }
    })
    var worldposition = new THREE.Vector3();
    cajaobjeto.getWorldPosition(worldposition);
    posicion = {nombre:numero,posicion:{x:worldposition.x,y:worldposition.y,z:worldposition.z}}
    return posicion;
}
function responsive_canvas() {
   camera.aspect = window.innerWidth / window.innerHeight;
   camera.updateProjectionMatrix();
   renderer.setSize( window.innerWidth, window.innerHeight );
   renderer.render(scene,camera);
}
function cargarImagenes(srcs, callback) {
    var contador = 0;
    function check() {
        contador++;
        if (srcs.length === contador) callback();
    }
    for (var i = srcs.length; i--;) {
        img = new Image();
        img.onload = check;
        img.src = urls[i]
    }
}
function cargar_archivos() {
    var objLoader = new THREE.GLTFLoader();
    if (index > archivos.length - 1) {
        otro = model.clone();////////////////////////
        TIEMPO_FIN_RENDER = performance.now() - TIEMPO_RENDER;
        TIEMPO_FIN_RENDER = (TIEMPO_FIN_RENDER/1000).toFixed(2);
        console.warn("FIN CARGA ARCHIVOS en "+TIEMPO_FIN_RENDER + " seg");

        $("#JUEGO").show();

        if (ANIMACION_CUY_PORTADA == false) {
            INICIO_ANIMACION_CUY_PORTADA(); /*CUY PORTADA*/ ;
        }
        ///NUEVOOOOOOOOOO
        //iniciar_websocketservidor();
        window.addEventListener('resize', responsive_canvas, false);
        return;
    };

    objLoader.load(archivos[index], function (gltf) {            
        // var model_temp = gltf.scenes[0];
        // model_temp.traverse(function (object) {
        //     if (object instanceof THREE.Mesh) {
        //         object.castShadow = true
        //     }
        // });
        // if (archivos[index] == "images/glb/cuycaminando.glb") {
        //     escala_temp = escalacuys;
        //     model_temp.name = "CUY";
        //     model = model_temp;
            
           
            
        //     var animations = gltf.animations;
        //     mixer = new THREE.AnimationMixer(model);
        //     mixer.clipAction(animations[0]).play();
        // }
        // model.scale.set(escala_temp, escala_temp, escala_temp);
        // model_temp.position.set(0, 0, 0);
        // model_temp.castShadow = true;
        // model_temp.receiveShadow = true;
        // scene.add(model);
        // skeleton = new THREE.SkeletonHelper(model);


        if (archivos[index] == "images/glb/cuycaminando.glb") {
            model = gltf.scenes[0];
            model.traverse(function (object) {
                if (object instanceof THREE.Mesh) {
                    object.castShadow = true
                }
            });
            model.scale.set(escalacuys, escalacuys, escalacuys);
            model.position.set(0, 0, 0);
            model.name = "CUY";

            model.castShadow = true;
            model.receiveShadow = true;
            scene.add(model);
            skeleton = new THREE.SkeletonHelper(model);
            var animations = gltf.animations;
            mixer = new THREE.AnimationMixer(model);
            mixer.clipAction(animations[0]).play();
        }
        if (archivos[index] == "images/glb/cajagirando1.glb") {
            modelCajaP = gltf.scenes[0];
            modelCajaP.traverse(function (objectCajaGira) {
                objectCajaGira.castShadow = true
            });
            modelCajaP.name = "CAJA_GIRANDO";
            modelCajaP.scale.set(escalacajagirando,escalacajagirando,escalacajagirando);
            modelCajaP.position.set(0, 0, 0);
            modelCajaP.position.y=-0.006;

            scene.add(modelCajaP);
            var animations = gltf.animations;
            mixerCajaP = new THREE.AnimationMixer(modelCajaP);
            mixerCajaP.clipAction(animations[0]).play();
        }
        if (archivos[index] == "images/glb/cuycabezagirando.glb") {
            modelCuyDudando = gltf.scenes[0];
            modelCuyDudando.castShadow=true;
            modelCuyDudando.receiveShadow=true;
            modelCuyDudando.traverse(function (objectCuyDudando) {
                if (objectCuyDudando instanceof THREE.Mesh) {
                    objectCuyDudando.castShadow = true
                }
            });
            modelCuyDudando.name = "CUY_DUDANDO";

            modelCuyDudando.scale.set(escalacuys, escalacuys, escalacuys);
            modelCuyDudando.position.set(0, 0, 0);
            scene.add(modelCuyDudando);
            var animations = gltf.animations;
            mixerCuyDudando = new THREE.AnimationMixer(modelCuyDudando);
            mixerCuyDudando.clipAction(animations[0]).play();
        }
        if (archivos[index] =="images/glb/cuyestrellas.glb") {
            modelCuyChoque = gltf.scenes[0];
            modelCuyChoque.traverse(function (objectCuyChoque) {
                if (objectCuyChoque instanceof THREE.Mesh) {
                    objectCuyChoque.castShadow = true
                }
            });
            modelCuyChoque.castShadow=true;
            modelCuyChoque.receiveShadow=true;
            modelCuyChoque.name = "CUY_CHOQUE";
            modelCuyChoque.scale.set(escalacuys, escalacuys, escalacuys);
            modelCuyChoque.position.set(0, 0, 0);
            scene.add(modelCuyChoque);
            var animations = gltf.animations;
            mixerCuyChoque = new THREE.AnimationMixer(modelCuyChoque);
            mixerCuyChoque.clipAction(animations[0]).play();
        }
        if (archivos[index] =="images/glb/cuypremio.glb") {
            modelCuyPremio = gltf.scenes[0];
            modelCuyPremio.traverse(function (objeto) {
                if (objeto instanceof THREE.Mesh) {
                    objeto.castShadow = true
                }
            });
            modelCuyPremio.castShadow=true;
            modelCuyPremio.receiveShadow=true;
            modelCuyPremio.name = "CUY_PREMIO";
            modelCuyPremio.scale.set(escalacuys, escalacuys, escalacuys);
            modelCuyPremio.position.set(0, 0, 0);
            scene.add(modelCuyPremio);
            var animations = gltf.animations;
            mixerCuyPremio = new THREE.AnimationMixer(modelCuyPremio);
            mixerCuyPremio.clipAction(animations[0]).play();
        }

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
        if (archivos[index] =="images/glb/cuysalto.glb") {
            modelCuySalto = gltf.scenes[0];
            modelCuySalto.traverse(function (objeto) {
                if (objeto instanceof THREE.Mesh) {
                    objeto.castShadow = true
                }
            });
            modelCuySalto.castShadow=true;
            modelCuySalto.receiveShadow=true;
            modelCuySalto.name = "CUY_PREMIO";
            modelCuySalto.scale.set(escalacuys, escalacuys, escalacuys);
            modelCuySalto.position.set(0, 0, 0);
            scene.add(modelCuySalto);
            var animations = gltf.animations;
            mixerCuySalto = new THREE.AnimationMixer(modelCuySalto);
            mixerCuySalto.clipAction(animations[0]).play();
        }
     
        index++;
        cargar_archivos();

    } ,progreso_descarga );
}

tamano_total = 14073552 + 3595876 + 4225396 + 3728832 + 2647408;  /*archivos glb para cargar*/
cargado = 0;
sumatoria_descargado = 0;
progreso_descarga = function( xhr ) {
    if ( xhr.lengthComputable ) {
        var falta = xhr.total-xhr.loaded;
        var cargado_estavuelta = xhr.loaded-cargado;
        sumatoria_descargado = sumatoria_descargado + cargado_estavuelta;
        cargado = xhr.loaded;
        if(falta === 0){cargado = 0;}
        // var percentComplete = xhr.loaded / xhr.total * 100;
        var percentCompletadoTotal = sumatoria_descargado / tamano_total * 100;
        if($("#cargador_overlay").length > 0){
            $("#cargador_overlay").text(Math.round( percentCompletadoTotal,2)+"%")
        }
    //console.info( Math.round( percentComplete, 2 ) + '% downloaded' +"   %total= "+  Math.round( percentCompletadoTotal,2));
    }
};

function mostrar_cuy_cargando(){
    $("#DIV_CARGANDO").show();
}
function ocultar_cuy_cargando(){
    $("#DIV_CARGANDO").hide();
}

function ocultar_cuy_esperando(){
    $("#DIV_ESPERA").addClass("SIN_ANIMACION").hide();
}
function mostrar_cuy_esperando(){
    $("#DIV_ESPERA").removeClass("SIN_ANIMACION").show();
}

function mostrar_div_eventoesperando(){
    $("#DIV_ESPERANDOEVENTO").removeClass("SIN_ANIMACION").fadeIn();//show();
}
function ocultar_div_eventoesperando(callback){
    $("#DIV_ESPERANDOEVENTO").addClass("SIN_ANIMACION").fadeOut('500',function(){callback()});
}

function mostrar_div_tituloevento(){
    $("#DIV_TITULOEVENTO").removeClass("SIN_ANIMACION").fadeIn('1000');
}
function ocultar_div_tituloevento(){
$("#DIV_TITULOEVENTO").hide().addClass("SIN_ANIMACION");
    if(typeof ganador_fireworks!=="undefined"){
        ganador_fireworks.destruir();
    }
     if(typeof ganador_confeti!=="undefined"){
        ganador_confeti.destruir();
    }
}
function mostrar_div_ganador(){
     // $("#DIV_GANADOR").show();
     // ocultar_div_tituloevento();
    $("#DIV_GANADOR")
        .off().on("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd",
                        function(e){
                        // do something here
                        $(".contenedor_cubo_ganador").addClass("latido_animacion");
                        $('#cubo_ganador img').shiningImage();
                        $(this).off(e);
                        });
    $("#DIV_GANADOR").removeClass("SIN_ANIMACION_children")
                    .show()
                    .removeClass("off");

     if(typeof ganador_fireworks!=="undefined"){
        ganador_fireworks.destruir();
    }
     if(typeof ganador_confeti!=="undefined"){
        ganador_confeti.destruir();
    }

    ganador_confeti=$('#DIV_GANADOR').confeti();
    ganador_fireworks=$('#DIV_GANADOR').fireworks({
        n_stars : 0, //num of stars
        twinkleFactor : .4, //how much stars 'twinkle'
        maxStarRadius : 3,
        minStrength : 1.5, //lowest firework power
        maxStrength : 7, //highest firework power
        minTrails : 15, //min particles
        maxTrails : 40, //max particles
        particleRadius : 2,
        trailLength : 15, //particle trail length
        delay : .4, // number of LIFEs between explosions
        LIFE : 50, //life time of firework

                sound: true, 
                opacity: 1,
                particles:100,
                width: $('#DIV_GANADOR').width(),
                height: $('#DIV_GANADOR').height()
        });
   if(typeof intervalo_cubo!=="undefined"){
        clearInterval(intervalo_cubo);
    }
    //intervalo_cubo=setInterval(function(){toggleShape()},4000)
}
function ocultar_div_ganador(){
     $("#DIV_GANADOR").removeClass("latido_animacion").addClass("off").addClass("SIN_ANIMACION_children");
     $("#contenedor_cubo_ganador").removeClass("latido_animacion").addClass("off").addClass("SIN_ANIMACION_children");;

    // $("#DIV_GANADOR").hide();

     $("#DIV_GANADOR")
        .off().on("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd",
         function(e){
            console.info("termino anim");
            // do something here
            // ocultar_div_tituloevento();
            mostrar_div_eventoesperando();
            $('#cubo_ganador img').data('shiningImage').stopshine();
            $("#imagen_nro_ganador").data("shiningImage").destruir();

            $(this).off(e);
         });
    if(typeof ganador_fireworks!=="undefined"){
        ganador_fireworks.destruir();
    }
    if(typeof intervalo_cubo!=="undefined"){
        clearInterval(intervalo_cubo);
    }
}


function ocultar_termometro_contador(){
    $("#barra_loading_tpi").stop().stop();
    if(typeof conteo_!="undefined"){
        clearInterval(conteo_);
        delete conteo_
    }
}
function reiniciar_termometro(){
    $("#barra_loading_tpi").css("height","100%");
}
function mostrar_termometro_contador(){
    $("#termotetro_para_iniciar").css("display:flex");
    $("#termotetro_para_iniciar").show();
    $("#contador_para_activar").show();
    $("#evento_para_activar").show()
}

function detener_var_cuymoviendo(){
    if(typeof var_cuymoviendo!="undefined"){
        //CUY_CORRIENDO=false;
         cancelAnimationFrame(var_cuymoviendo);
         delete var_cuymoviendo;
            aumento = 0;
    }
}
function detener_var_animarcamara(){
    TWEEN.removeAll();
    if(typeof var_animarcamara!="undefined"){
         cancelAnimationFrame(var_animarcamara);
         delete var_animarcamara;
    }
}

function detener_var_cajagirando(){
    if(typeof var_cajagirando!="undefined"){
         cancelAnimationFrame(var_cajagirando);
         delete var_cajagirando;
    }
}

function detener_var_correr_spline_portada(){
    if(typeof var_correr_spline_portada!="undefined"){
         cancelAnimationFrame(var_correr_spline_portada);
         delete var_correr_spline_portada;
    }
}
function detener_var_cuydudando(){
    if(typeof var_cuydudando!="undefined"){
         cancelAnimationFrame(var_cuydudando);
         delete var_cuydudando;
    }
}
function detener_var_cuychoque(){
    if(typeof var_cuychoque!="undefined"){
         cancelAnimationFrame(var_cuychoque);
         delete var_cuychoque;
    }
}

function detener_var_cuy_rotando(){
      if(typeof var_cuy_rotando!="undefined"){
         cancelAnimationFrame(var_cuy_rotando);
         delete var_cuy_rotando;
    }
}
function detener_animacion(){
         if (typeof animacion !== "undefined") {
            cancelAnimationFrame(animacion);
            delete animacion;
            aumento = 0;
        }
}
function detener_var_animar_cajax(){
         if (typeof var_animar_cajax !== "undefined") {
            cancelAnimationFrame(var_animar_cajax);
            delete var_animar_cajax;
        }
}

function detener_var_cuysalto(){
        if (typeof var_cuysalto !== "undefined") {
            cancelAnimationFrame(var_cuysalto);
            delete var_cuysalto;
        }

}
function detener_var_cuypremio(){
        if (typeof var_cuypremio !== "undefined") {
            cancelAnimationFrame(var_cuypremio);
            delete var_cuypremio;
        }

}
function detener_var_cuyesperando(){
        if (typeof var_cuyesperando !== "undefined") {
            cancelAnimationFrame(var_cuyesperando);
            delete var_cuyesperando;
        }
}

function mostrar_cuymoviendo(){
    model.visible = true; 
    modelCajaP.visible = false;
    modelCuyDudando.visible = false;       
    modelCuyChoque.visible = false;
}
function mostrar_cajagirando(){
    modelCajaP.visible = true;
    model.visible = false; 
    modelCuyDudando.visible = false;       
    modelCuyChoque.visible = false;
}
function actualizar_cuyes_posicion(){
    modelCuyDudando.position.x=model.position.x;
    modelCuyDudando.position.y=model.position.y;
    modelCuyDudando.position.z=model.position.z;
    modelCuyChoque.position.x=model.position.x;
    modelCuyChoque.position.y=model.position.y;
    modelCuyChoque.position.z=model.position.z;
}
function reiniciar_cuy(){
    model.position.set(0,0,0);
    a = {x:model.position.x,
       y:model.position.y,
       z:model.position.z}

        modelCuyDudando.position.set(0,0,0);
        modelCuyChoque.position.set(0,0,0);
        clock = new THREE.Clock();
        clockCuyDudando = new THREE.Clock();
        clockCuyChoque= new THREE.Clock();
        clockCajaP= new THREE.Clock();
        t=0;
        $("#barra_loading_tpi").css("height","100%");
        // $("#barra_loading_tpi").css("width","0%");
        //PUNTOS_CUY=null;
        //INDICE_PUNTOS_CUY=0;
}
function reiniciar_loading(){
    clock = new THREE.Clock();
    clockCuyDudando = new THREE.Clock();
    clockCuyChoque= new THREE.Clock();
    clockCajaP = new THREE.Clock();
    t=0;
    $("#barra_loading_tpi").css("height","100%");
    //PUNTOS_CUY=null;
    //INDICE_PUNTOS_CUY=0;
}

function getPositionOtro(ganador,otro){
    vector_ganador = new THREE.Vector3();
    getObjeto_caja(ganador).getWorldPosition(vector_ganador);
    otro.position.copy(vector_ganador);
    otro.lookAt(0,0,0);
    otro.translateZ(1);
    posicionnueva = otro.getWorldPosition();
    return {x:posicionnueva.x,y:0,z:posicionnueva.z}
}
function getPositionOtroVector(ganador,otro){
    if( ganador == "0"){
        ganador="x";
    }
    vector_ganador = new THREE.Vector3();
    getObjeto_caja(ganador).getWorldPosition(vector_ganador);
    otro.position.copy(vector_ganador);
    otro.lookAt(0,0,0);
    otro.translateZ(1);
    posicionnueva = new THREE.Vector3();
    otro.getWorldPosition(posicionnueva);
    vector = new THREE.Vector3(posicionnueva.x,0,posicionnueva.z);
    return vector;
}
function INICIO_ANIMACION_CUY_PORTADA(){
    ANIMACION_CUY_PORTADA = true;
    ANIMACION_CUY = false;

    ocultar_cuy_cargando();
    $.LoadingOverlay("hide");
    t = 0  
    timerotacion = 0; 
    detener_var_animarcamara();
    ocultar_cuy_esperando();
    animar_camara();

    mostrar_cuymoviendo();
    // camara_mirar(modelCajaP);
    if(typeof a != "undefined"){
        ULTIMO_PUNTO_CUY = a;
    }
    //reiniciar_cuy();///reiniciar posicion cuyes 0 0 0
    actualizar_cuyes_posicion();
    
    detener_var_cajagirando();
    iniciar_animacion_cuy_portada();
}
function iniciar_animacion_cuy_portada(){
        mixer.update(clock.getDelta());
        mixerCuyDudando.update(clockCuyDudando.getDelta());
        mixerCajaP.update(clockCajaP.getDelta());
        detener_var_cajagirando();
        mostrar_cuymoviendo();
        cajax = getObjeto_caja("x");
        maderas = [];
        maderas.push(getObjeto_caja("madera"));
        maderas.push(getObjeto_caja("madera2"));
        posicionycajaxinicial=-9.8808069229126  ;//9.932283401;//-6.86645478253922e-7;//-993.228455;///  z=>  -993.228455
        posicionfinalcaja=-11.4;//8.2;//3.4999993133545217//800;
        cajax_posicioninicial= new THREE.Vector3() ; 
        cajax.getWorldPosition(cajax_posicioninicial);
        posicionmadera = new THREE.Vector3() ; 
        getObjeto_caja("madera").getWorldPosition(posicionmadera);
        dtcajax = 0.2;
        tcajax = 0;
        rotacionx_inicio=0;//-7.318557638911297e-33;
        rotacionx_fin=-Math.PI / 2;//-1.4;
        q1_cajax = new THREE.Quaternion().copy(cajax.quaternion);
        q2_cajax = new THREE.Quaternion().copy(cajax.quaternion);
        timerotacion = 0;
        if(typeof controls!="undefined"){
            controls.autoRotate = false;
        }
        inicio_tiempo=performance.now();
        inicio={x:model.position.x,
                y:model.position.y,
                z:model.position.z};
        spline = new THREE.CatmullRomCurve3(puntos_azar_inicio(inicio));
        dtSPLINE=0.0015;
        correr_spline_portada(inicio);
        // camara_movimiento_inicio({x:0,y:10.3,z:0},camera,2500);
        // iniciar_cuy(GANADOR_DE_EVENTO,TIEMPO_CUY);
}

///*inicio desde ws*/
function INICIO_ANIMACION_CUY(){
    mixer.update(clock.getDelta());
    mixerCuyDudando.update(clockCuyDudando.getDelta());
    mixerCajaP.update(clockCajaP.getDelta());
    ANIMACION_CUY = true;
    // iniciogiro =  clockCajaP.getElapsedTime();
    t = 0   /// tiempo movimiento cuy;
    timerotacion=0; 
    detener_var_animarcamara();
    ocultar_cuy_esperando();
    animar_camara();

    objeto = modelCajaP;    
    X = objeto.position.x ;
    Y = objeto.position.y + 1.6;
    Z = objeto.position.z + 5.5;
    mostrar_cajagirando();
    //animar_desvanacer();
    camara_movimiento_girando(
        {x:X,y:Y,z:Z},
        camera,
        2000,
        function(){
            iniciogiro =  performance.now();
            camara_mirar(modelCajaP);
            if(typeof a != "undefined"){
                ULTIMO_PUNTO_CUY = a;
            }
            reiniciar_cuy();///reiniciar posicion cuyes 0 0 0
            actualizar_cuyes_posicion();
            if(typeof controls != "undefined"){
                //controls.autoRotate = true;
            }
            detener_var_cajagirando();
            modelCajaP.visible = true;
            cajagirando_animacion();
        }
    );
}

function actualizar_div_ganador(nro_ganador){
    var GANADOR_DE_EVENTO=nro_ganador;
    var ganador_TEXTO=GANADOR_DE_EVENTO == 0 ? "x" : GANADOR_DE_EVENTO;
    $("#cubo_ganador img").attr("src","img/numeros/"+ganador_TEXTO+".png");
    $("#span_idevento").text("#"+EVENTO_ID);
}

function cajagirando_animacion() {
    var_cajagirando = requestAnimationFrame(cajagirando_animacion);
    mixer.update(clock.getDelta());
    mixerCuyDudando.update(clockCuyDudando.getDelta());
    mixerCajaP.update(clockCajaP.getDelta());
    
    mostrar_cajagirando();
    // var tiempogirando = clockCajaP.getElapsedTime() - iniciogiro;
    var tiempogirando = performance.now() - iniciogiro;
    renderer.render(scene, camera);
    if(tiempogirando/1000 <= (TIEMPO_GIRO_CAJA/1000) ){
    }
    else{
        console.info(" tiempo giro = " + tiempogirando);
        puntootro = getPositionOtroVector(GANADOR_DE_EVENTO,otro);///punto antes de caja centro
        actualizar_div_ganador(GANADOR_DE_EVENTO);
        // spline = new THREE.SplineCurve3(puntos_azar());
        // detener_var_animarcamara();
        detener_var_cajagirando();
        mostrar_cuymoviendo();
    
        cajax = getObjeto_caja("x");
        maderas = [];
        maderas.push(getObjeto_caja("madera"));
        maderas.push(getObjeto_caja("madera2"));
        posicionycajaxinicial = -9.8808069229126  ;//9.932283401;//-6.86645478253922e-7;//-993.228455;///  z=>  -993.228455
        posicionfinalcaja = -11.4;//8.2;//3.4999993133545217//800;
        
        //cajax_posicioninicial=cajax.getWorldPosition();
        cajax_posicioninicial= new THREE.Vector3() ; 
        cajax.getWorldPosition(cajax_posicioninicial);

        posicionmadera = new THREE.Vector3() ; 
        getObjeto_caja("madera").getWorldPosition(posicionmadera);

        dtcajax = 0.2;
        tcajax = 0;
        rotacionx_inicio=0;//-7.318557638911297e-33;
        rotacionx_fin=-Math.PI / 2;//-1.4;
        q1_cajax = new THREE.Quaternion().copy(cajax.quaternion);
        q2_cajax = new THREE.Quaternion().copy(cajax.quaternion);
            timerotacion = 0;

        if(typeof controls!="undefined"){
            controls.autoRotate = false;
        }
        camara_movimiento_inicio({x:0,y:10.3,z:0},camera,2500);
        iniciar_cuy(GANADOR_DE_EVENTO,TIEMPO_CUY);
    }
}

function retornar_cajx(){
    cajax.position.y=-9.8808069229126;//9.932283401;//-993.228455; 
    cajax.rotation.x=0;//-7.318557638911297e-33;
    maderas[0].visible=true;
    maderas[1].visible=true;
}

function cajax_animacion(){
    maderas[0].visible=false;
    maderas[1].visible=false;

    funcion_ease = EasingFunctions_array[2].funcion;//easeOutQuad
    // var newZ = lerp(posicionxcajaxinicial, bcajaxz, funcion_ease(tcajax));  
    var newY = lerp(posicionycajaxinicial, posicionfinalcaja, funcion_ease(tcajax));  
    var newrotacionX = lerp(rotacionx_inicio, rotacionx_fin, funcion_ease(tcajax));  
    // cajax.position.z=newZ;
    cajax.position.y=newY;
    cajax.rotation.x=newrotacionX;
    //t += dt;
    tcajax = parseFloat(tcajax + dtcajax).toFixed(5);
    tcajax = parseFloat(tcajax);
    var_animar_cajax = requestAnimationFrame(cajax_animacion);
    if(tcajax > 1){
        detener_var_animar_cajax();
        tcajax=0;
    }
}
function random_posicion(min, max) {
    return ((Math.random() * (max - min)) + min).toFixed(2);
}
function random_entero(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}
function lerp(a, b, t) {
    return a + (b - a) * t;
}
function ease(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

////////////////////nuevo random
function generar_nueva_posicion_random(){
    bfuncion_easing_indice = 0;//random_entero(0,EasingFunctions_array.length-1);
    //console.warn("i= "+bfuncion_easing_indice);
    b = PUNTOS_CUY[INDICE_PUNTOS_CUY];
    INDICE_PUNTOS_CUY++;
    if(INDICE_PUNTOS_CUY > PUNTOS_CUY.length){
        console.warn(INDICE_PUNTOS_CUY+ " ---------Cuy pasó length del array PUNTOS_CUY  --- ")
        INDICE_PUNTOS_CUY = 0; 
        b = PUNTOS_CUY[INDICE_PUNTOS_CUY];
    }
    return b;
}
/////////////////nuevo movimiento
function generar_nueva_posicion_random2(rango){
    // rango=2.,5
    randomx = Math.random() >= 0.5 ? Math.abs(parseFloat(random_posicion(0, rango))) : -Math.abs(parseFloat(random_posicion(0,rango))) ;  // rango x=> -2.5  a   2.5 
    randomz = Math.random() >= 0.5 ? Math.abs(parseFloat(random_posicion(0, rango))) : -Math.abs(parseFloat(random_posicion(0, rango))); // rango z=> -2.5  a   2.5
    b = { x: randomx, y: 0, z: randomz  };
    return b;
}

function puntos_azar(){
    arrayvector = [];
    for(a = 0;a < 10; a++){
        nuevo=generar_nueva_posicion_random2(2.35);
        arrayvector.push(new THREE.Vector3(nuevo.x,0,nuevo.z))
    }
    return arrayvector;
}

function puntos_azar_inicio(inicio){
    arrayvector=[];
    arrayvector.push(new THREE.Vector3(inicio.x,0,inicio.z));
    for(a=0;a<10;a++){
        nuevo=generar_nueva_posicion_random2(2.35);
        arrayvector.push(new THREE.Vector3(nuevo.x,0,nuevo.z))
    }
    return arrayvector;
}
function linea_camino(){
 var material = new THREE.LineBasicMaterial({
        color: 0xff00f0,
    });
    var geometry = new THREE.Geometry();
    for(var i = 0; i < spline.getPoints(100).length; i++){
        geometry.vertices.push(spline.getPoints(100)[i]);  
    }
    var line = new THREE.Line(geometry, material);line.name="linea_camino";
    scene.add(line);
}

up = new THREE.Vector3(0,0,1 );
axis = new THREE.Vector3( );
// t=0;dt=0.003
// correr_nuevo()
function correr_spline(){
    var var_correr=requestAnimationFrame(correr_spline);
    var tangent;
    pt = spline.getPoint( t );
//    console.log(pt)
    model.position.set( pt.x, pt.y, pt.z );
    tangent = spline.getTangent( t ).normalize();
    mixer.update(clock.getDelta())
    axis.crossVectors(up, tangent).normalize();
    radians = Math.acos( up.dot( tangent ) );
    model.quaternion.setFromAxisAngle( axis, radians );
    t=t+dtSPLINE;
    if(t>=1){
        model.position.copy(posicion_fin_caja);
         t=0;cancelAnimationFrame(var_correr) ;
            // console.info("FIN SPLINE");
        CUY_CORRIENDO = false;
        if(model.position.x== posicionmadera.x && model.position.z== posicionmadera.z)
        {
            modelCuyChoque.position.copy(posicionmodel);
            modelCuyChoque.lookAt(getObjeto_caja("x").getWorldPosition());
            modelCuyChoque.position.y=-0.1;
            cuychoque();
            cajax_animacion();///caja x voltear
        }
        model.visible=false;
        callback_ganador();
        fin_tiempof = performance.now();
        milisegundosf = (fin_tiempof - inicio_tiempo);
        console.info("TIEMPO FINAL=> segundos: " +parseFloat(milisegundosf/1000).toFixed(2)+" ,  milliseconds : "+ milisegundosf );
      


    }
}
////fin nuevo movimiento


function correr_spline_portada(){
    if(ANIMACION_CUY){
        t = 1;
        detener_var_correr_spline_portada();
    }
    model.visible=true;
    modelCuyChoque.visible=false;
    var_correr_spline_portada=requestAnimationFrame(correr_spline_portada);
    var tangent;
    pt = spline.getPoint( t );
    model.position.set( pt.x, pt.y, pt.z );
    tangent = spline.getTangent( t ).normalize();
    mixer.update(clock.getDelta())
    axis.crossVectors(up, tangent).normalize();
    radians = Math.acos( up.dot( tangent ) );
    model.quaternion.setFromAxisAngle( axis, radians );
    t = t + dtSPLINE;
    if(t >= 1){
        // model.position.copy(posicion_fin_caja);
         t = 0;
         cancelAnimationFrame(var_correr_spline_portada) ;
            // console.info("FIN SPLINE");
        CUY_CORRIENDO = false;
        model.visible = true;
        if(!ANIMACION_CUY)
        {
            inicio = 
                {
                    x:model.position.x,
                    y:model.position.y,
                    z:model.position.z
                };
            spline = new THREE.CatmullRomCurve3(puntos_azar_inicio(inicio));
            correr_spline_portada();
        }
        fin_tiempof = performance.now();
        milisegundosf = (fin_tiempof - inicio_tiempo);
        console.info("TIEMPO FINAL spLine=> segundos: " +parseFloat(milisegundosf/1000).toFixed(2)+" ,  milliseconds : "+ milisegundosf );
    }
}

function cuy_rotacionrandom() {//var_cuy_rotando
    if(!CUY_ROTANDO){return;}
    model.visible = true;
    modelCuyDudando.visible = false;
    modelCuyChoque.visible = false; 
    timerotacion = parseFloat(timerotacion + dtrotacion).toFixed(5);
    timerotacion = parseFloat(timerotacion);
    var_cuy_rotando = requestAnimationFrame(cuy_rotacionrandom);
    mixer.update(clock.getDelta());
    THREE.Quaternion.slerp(q1, q2, model.quaternion, timerotacion); // added
    renderer.render(scene, camera);
    if (timerotacion > 1) {
        model.lookAt(new THREE.Vector3(b.x,b.y,b.z))
        modelCuyDudando.lookAt(new THREE.Vector3(b.x,b.y,b.z))
        modelCuyChoque.lookAt(new THREE.Vector3(b.x,b.y,b.z))

        CUY_ROTANDO=false;
        timerotacion = 0; cancelAnimationFrame(var_cuy_rotando) // changed
         if (typeof var_cuy_rotando != "undefined") {
            cancelAnimationFrame(var_cuy_rotando);
            delete var_cuy_rotando;
        }
        //console.info("acabo rotacion rand");
        modelCuyDudando.rotation.x = model.rotation.x;
        modelCuyDudando.rotation.y = model.rotation.y;
        modelCuyDudando.rotation.z = model.rotation.z;
        modelCuyChoque.rotation.x = model.rotation.x;
        modelCuyChoque.rotation.y = model.rotation.y;
        modelCuyChoque.rotation.z = model.rotation.z;
        modelCuyDudando.position.x = model.position.x;
        modelCuyDudando.position.y = model.position.y;
        modelCuyDudando.position.z = model.position.z;
        a = { x: model.position.x, y: model.position.y, z: model.position.z }; 
        //cuydudando();
        if (typeof callback_rotacion != "undefined") {
            callback_rotacion();
            delete callback_rotacion;
        }
    }
}
/*agrega en solo en historial ahora*/
function agregar_ganador_estadistica(nro_ganador){
    var ganador_objeto={};
    var datos = getColor(estadistica,nro_ganador);
    ganador_objeto.idEvento=EVENTO_ID;
    ganador_objeto.valor=GANADOR_DE_EVENTO;
    ganador_objeto.rgb=datos.rgb;
    ganador_objeto.rgbLetra=datos.rgbLetra;

    if($("#historial_tabla>div").length>11){
        $("#historial_tabla>div:last").remove();
    }
    var valor=ganador_objeto.valor=="0"?"x":ganador_objeto.valor;
    $("#historial_tabla>div:first").before(
        $("<div class='fila_historial'>")
            .append(
                    $("<div>").text(ganador_objeto.idEvento)
                   )
            .append(
                    $("<div>").text(valor)
                            .css("color",ganador_objeto.rgbLetra)
                            .css("background-color",ganador_objeto.rgb)
                   )
       )
}
function callback_ganador(){
        console.warn("CALLBACK CUY GANADOR  --------");//**/}
        reiniciar_termometro();
        tiempo_cuychoque=TIEMPO_ESPERA_CASAGANADOR; ///por defecto 1 seg,al entrar en caja
        if(GANADOR_DE_EVENTO=="0" || GANADOR_DE_EVENTO=="x"){
            tiempo_cuychoque=TIEMPO_CUY_CHOQUE;
        }
        setTimeout(
            function(){
                mostrar_div_ganador();
                setTimeout(function () {
                    ocultar_div_ganador();
                    t = 0;
                    ANIMACION_CUY = false;
                    //iniciar_websocketservidor();
                    ANIMACION_CUY_PORTADA = false;
                    INICIO_ANIMACION_CUY_PORTADA();
                
                },TIEMPO_GANADOR_PORTADA);
                setTimeout(function(){
                    // ultimos120eventos.splice(-1,1);
                    // ultimos120eventos.unshift({ganador:GANADOR_DE_EVENTO,idEvento:EVENTO_ID});
                    // calcular_estadisticas_nuevo();
                    // calcular_estadisticas(estadistica);
                    agregar_ganador_estadistica(GANADOR_DE_EVENTO);
                    GANADOR_DE_EVENTO = "";
                    detener_var_animarcamara();
                    PUNTOS_CUY = null;
                    INDICE_PUNTOS_CUY = 0
                    reiniciar_cuy();
                    retornar_cajx();
                    bfuncion_easing_indice = 0;
                    detener_var_cuychoque();
                },1000);
            }, tiempo_cuychoque);
};
function mover_cuyrandom() {    ///var_cuymoviendo  => animationframe
    if (!CUY_CORRIENDO) {  return;}
    mostrar_cuymoviendo();

    // funcion_ease=EasingFunctions_array[0].funcion;//linear
    funcion_ease = EasingFunctions_array[bfuncion_easing_indice].funcion;//usar random de generarrandompunto b

    var newX = lerp(a.x, b.x, funcion_ease(t));  
    var newY = lerp(a.y, b.y, funcion_ease(t));  
    var newZ = lerp(a.z, b.z, funcion_ease(t));  
    model.position.set(newX,0,newZ); 
    //t += dt;
    t = parseFloat(t+dt).toFixed(5);
    t = parseFloat(t);
    //console.warn("x=> " + newX + "  y=>" + newY + "  z= " + newZ);
    mixer.update(clock.getDelta());
    renderer.render(scene, camera);
    var_cuymoviendo = requestAnimationFrame(mover_cuyrandom);
    if(t >= 1)
    {
        // console.warn("LLEGÓ ccc");
        model.position.set(b.x, b.y, b.z); ///ajustar posición si no llegó exacto
        a = { x: model.position.x, y: model.position.y, z: model.position.z };   //////nueva posicion
        cancelAnimationFrame(var_cuymoviendo);
        detener_animacion();///ant
        detener_var_cuymoviendo();
        detener_var_cuy_rotando();

        actualizar_cuyes_posicion();

        fin_tiempo=performance.now();
        milisegundos=(fin_tiempo-inicio_tiempo);
      
        if (milisegundos > TIEMPO_RANDOM) {////tiempo de animacion cuy paso, ir a caja ganador posicion
            if(!mover_a_ganador){
                    mover_a_ganador = true;
                    // b = get_caja(GANADOR_DE_EVENTO).posicion;
                    if(GANADOR_DE_EVENTO == "x" || GANADOR_DE_EVENTO == "0"){
                        bfuncion_easing_indice = 7;//easeInQuart
                        console.log("X o O");
                        b = new THREE.Vector3();
                        getObjeto_caja("madera").getWorldPosition(b);
                        random_tiempo();
                    }else{
                        posicion_fin_caja = new THREE.Vector3();
                        getObjeto_caja(GANADOR_DE_EVENTO).getWorldPosition(posicion_fin_caja);
                        posicion_fin_caja.y=0;
                        CUY_CORRIENDO = false;
                        puntosspline=[];
                        posicionmodel = new THREE.Vector3();
                        model.getWorldPosition(posicionmodel);

                        puntootro.y = 0;
                        puntosspline.push(posicionmodel);
                        puntosspline.push(puntootro);
                        puntosspline.push(posicion_fin_caja);
                        // spline= new THREE.SplineCurve3(puntosspline);
                        spline= new THREE.CatmullRomCurve3(puntosspline);
                        t = 0;
                        dtSPLINE=0.025;
                        dist_spline=spline.getLength();
                        // console.info("dist_spline "+dist_spline);
                        if(dist_spline>4){
                        dtSPLINE=0.009;
                        }
                        correr_spline();
                    }
            }  
            else { ///movera ganador true  => CUY EN POSICION DE CAJA, FINALIZAR ANIMACION
                CUY_CORRIENDO = false;
                if(model.position.x== posicionmadera.x && model.position.z== posicionmadera.z)
                {
                    modelCuyChoque.position.y=-0.1;
                    cuychoque();
                    cajax_animacion();///caja x voltear
                }
                model.visible=false;
                callback_ganador();
                fin_tiempof = performance.now();
                milisegundosf = (fin_tiempof - inicio_tiempo);
                console.info("TIEMPO FINAL=> segundos: " +parseFloat(milisegundosf/1000).toFixed(2)+" ,  milliseconds : "+ milisegundosf );
               // delete funcion_callback;
             }
            console.info("fin");
        }///ms > tiempo
        else{
            mostrar_cuydudando=b.mostrar_cuydudando;//Math.random()>=0.5?true:false;
            if(mostrar_cuydudando){
                detener_var_cuydudando();
                
                cuydudando();
                tiempodudando=Math.random() * (10 - 1) + 1; 
                setTimeout(function(){
                   generar_nueva_posicion_random();
                   random_tiempo();
                },tiempodudando*100);
            }
            else{
                detener_var_cuydudando();
                generar_nueva_posicion_random();
                random_tiempo();
            }
        }  ///fin else ms >tiempo
    }  ///fin t>1
}


//////////////////////////COMENZAR CUY ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//position_caja11 = modelCaja.children[3].position;///  ganador
function iniciar_cuy(ganador,TIEMPO_RANDOM) {
    posicion_ganador = get_caja(ganador).posicion;///  ganador
    i = 0;
    TIEMPO_RANDOM = TIEMPO_RANDOM;
    TIEMPO_RANDOM = TIEMPO_RANDOM - 2000; ///2000 tiempo para ultimo movimiento , hacia ganador

    CUY_ROTANDO=false;
    CUY_CORRIENDO = false;
    INDICE_PUNTOS_CUY = 0;
    iniciar_tiempo_random(TIEMPO_RANDOM); //////INICIO  CUY
}
//////////////////////////FIN   COMENZAR CUY ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function iniciar_tiempo_random(tiempo) {
    TIEMPO_RANDOM = tiempo;
    inicio_tiempo = performance.now();
    mover_a_ganador = false;

    detener_var_cuydudando();
    cuydudando();
    setTimeout(function(){
        detener_var_cuydudando();
        generar_nueva_posicion_random();
        random_tiempo();
    },3500);
}
function random_tiempo(){
    if (typeof var_cuymoviendo === "undefined") {
        rotarono = b.rotarono;//Math.random() >= 0.5 ?true:false;
        t = 0;  ///coeficiente
        aumento = 0;
     
        mostrar_cuymoviendo();
        mixer.update(clock.getDelta());
        renderer.render(scene, camera);
        if(rotarono){
            q1 = new THREE.Quaternion().copy(model.quaternion);
            model.lookAt(b.x,b.y,b.z);
            q2 = new THREE.Quaternion().copy(model.quaternion); 
            timerotacion = 0;
        }
        detener_animacion();///ant
        detener_var_cuymoviendo();
        detener_var_cuychoque();
        detener_var_cuydudando();
        detener_var_cuy_rotando();

        if(rotarono){
            callback_rotacion = function () { ///se ejecuta al acabar  cuy_rotacion();
                detener_var_cuymoviendo();
                CUY_CORRIENDO = true;
                mover_cuyrandom();
            }
            CUY_ROTANDO = true;
            detener_var_cuy_rotando();
            cuy_rotacionrandom();
        }else{
            CUY_ROTANDO = false;
            model.lookAt(b.x, b.y, b.z);
            modelCuyDudando.lookAt(b.x, b.y, b.z);
            modelCuyChoque.lookAt(b.x, b.y, b.z);
            t = 0;
            aver = CUY_CORRIENDO?"true":"false";
              // console.warn("t else:::::  "+t +" "+b.x+" "+b.y+" "+b.z +"  cuycorriendo  = "+ aver);
            detener_var_cuymoviendo();
            detener_var_cuydudando();
            detener_var_cuychoque();
            CUY_CORRIENDO=true;
            mover_cuyrandom();
        }
    } else {
        cancelAnimationFrame(var_cuymoviendo);
    } 
}

function cuydudando() {
    mixerCuyDudando.update(clockCuyDudando.getDelta());
    var_cuydudando = requestAnimationFrame(cuydudando);
    modelCuyDudando.visible = true;
    model.visible = false;
    modelCuyChoque.visible = false;
    renderer.render(scene, camera);
}
function cuychoque() {
    mixerCuyChoque.update(clockCuyChoque.getDelta());
    var_cuychoque = requestAnimationFrame(cuychoque);
    modelCuyChoque.visible = true;
    model.visible = false;
    modelCuyDudando.visible = false;
    renderer.render(scene, camera);
}

function cuyesperando(){
    mixerCuyEsperando.update
    mixerCuyEsperando.update(clockCuyEsperando.getDelta());
    var_cuyesperando = requestAnimationFrame(cuyesperando);
    modelCuyEsperando.visible = true;
   // model.visible = false;
   // modelCuyChoque.visible = false;
    renderer.render(scene, camera);
}
function cuysalto(){
    mixerCuySalto.update
    mixerCuySalto.update(clockCuySalto.getDelta());
    var_cuysalto = requestAnimationFrame(cuysalto);
    modelCuySalto.visible = true;
   // model.visible = false;
   // modelCuyChoque.visible = false;
    renderer.render(scene, camera);
}
function cuypremio(){
    mixerCuyPremio.update
    mixerCuyPremio.update(clockCuyPremio.getDelta());
    var_cuypremio = requestAnimationFrame(cuypremio);
    modelCuyPremio.visible = true;
   // model.visible = false;
   // modelCuyChoque.visible = false;
    renderer.render(scene, camera);
}

///////////FINNNNNNNNNNNNNNNNNNNNNNNNN            FUNCIONES nuevas


function dibujarCurva() {
  var vertices = path.getSpacedPoints(20);
  // Change 2D points to 3D points
  for (var i = 0; i < vertices.length; i++) {
    point = vertices[i]
    vertices[i] = new THREE.Vector3(point.x, point.y, 0);
  }
  var lineGeometry = new THREE.Geometry();
  lineGeometry.vertices = vertices;
  var lineMaterial = new THREE.LineBasicMaterial({
    color: 0xffffff
  });
  var line = new THREE.Line(lineGeometry, lineMaterial)
  scene.add(line);
}

function cuy_rotacionrapido() {//var_cuy_rotando
    if(!CUY_ROTANDO){return;}
    model.visible = true;
    modelCuyDudando.visible = false;
    modelCuyChoque.visible = false; 
    timerotacion = parseFloat(timerotacion + dtrotacion).toFixed(5);
    timerotacion = parseFloat(timerotacion);
    var_cuy_rotando = requestAnimationFrame(cuy_rotacionrapido);
    mixer.update(clock.getDelta());
    THREE.Quaternion.slerp(q1, q2, model.quaternion, timerotacion); // added
    renderer.render(scene, camera);
    if (timerotacion > 1) {
        model.lookAt(new THREE.Vector3(b.x,b.y,b.z))
        modelCuyDudando.lookAt(new THREE.Vector3(b.x,b.y,b.z))
        modelCuyChoque.lookAt(new THREE.Vector3(b.x,b.y,b.z))

        CUY_ROTANDO=false;
        // console.log("rotacion "+timerotacion);  
        timerotacion = 0; cancelAnimationFrame(var_cuy_rotando) // changed
         if (typeof var_cuy_rotando != "undefined") {
            cancelAnimationFrame(var_cuy_rotando);
            delete var_cuy_rotando;
        }
        //console.info("acabo rotacion rand");
        modelCuyDudando.rotation.x = model.rotation.x;
        modelCuyDudando.rotation.y = model.rotation.y;
        modelCuyDudando.rotation.z = model.rotation.z;
        modelCuyChoque.rotation.x = model.rotation.x;
        modelCuyChoque.rotation.y = model.rotation.y;
        modelCuyChoque.rotation.z = model.rotation.z;
        modelCuyDudando.position.x = model.position.x;
        modelCuyDudando.position.y = model.position.y;
        modelCuyDudando.position.z = model.position.z;
        a = { x: model.position.x, y: model.position.y, z: model.position.z }; 
        //cuydudando();
        if (typeof callback_rotacion != "undefined") {
            callback_rotacion();
            delete callback_rotacion;
        }
    }
}

function mover_cuy_rapido() {    ///var_cuymoviendo  => animationframe
    if (!CUY_CORRIENDO) {  return;}
    mostrar_cuymoviendo();
    funcion_ease=EasingFunctions_array[bfuncion_easing_indice].funcion;//usar random de generarrandompunto b

    var newX = lerp(a.x, b.x, funcion_ease(t));  
    var newY = lerp(a.y, b.y, funcion_ease(t));  
    var newZ = lerp(a.z, b.z, funcion_ease(t));  
    model.position.set(newX,0,newZ); 
    t=parseFloat(t+dt).toFixed(5);
    t=parseFloat(t);
    mixer.update(clock.getDelta());
    renderer.render(scene, camera);
    var_cuymoviendo = requestAnimationFrame(mover_cuy_rapido);
    if( t >= 1 )
    {
        model.position.set(b.x, b.y, b.z); ///ajustar posición si no llegó exacto
        a = { x: model.position.x, y: model.position.y, z: model.position.z };   //////nueva posicion
        detener_var_cuymoviendo();
        detener_var_cuy_rotando();
        actualizar_cuyes_posicion();
        if(!mover_a_ganador){
                mover_a_ganador=true;
                // b=get_caja(GANADOR_DE_EVENTO).posicion;
                if(GANADOR_DE_EVENTO == "x"){
                    b = new THREE.Vector3();
                    getObjeto_caja("madera").getWorldPosition(b);
                }
                else
                {                        
                    b = get_caja(GANADOR_DE_EVENTO).posicion;
                }
        }  
        else {
            CUY_CORRIENDO = false;
            var posicionmadera = getObjeto_caja("madera").getWorldPosition(posicionmadera);    
            if(model.position.x == posicionmadera.x && model.position.z == posicionmadera.z){

                modelCuyChoque.position.y = -0.1;
                cuychoque();
                cajax_animacion();
            }
            }
    }  ///fin t>1
}

function generarPosicionesRandom() {
    const arrayPuntos = [];
    for (let i = 0; i < 40; i++) {
        const randomX = Math.random() >= 0.5 ? Math.abs(randomPosicion(0, 2.35)) : -Math.abs(randomPosicion(0, 2.35));
        const randomZ = Math.random() >= 0.5 ? Math.abs(randomPosicion(0, 2.35)) : -Math.abs(randomPosicion(0, 2.35));
        const rotarono = Math.random() >= 0.5;
        const mostrarCuydudando = Math.random() >= 0.5;
        
        const obj = {
            x: randomX,
            y: 0,
            z: randomZ,
            rotarono: rotarono,
            mostrarCuydudando: mostrarCuydudando
        };
        
        arrayPuntos.push(obj);
    }
    
    return arrayPuntos;
}
function randomPosicion(min, max) {
    const numero = Math.random() * (max - min) + min;
    const numeroDecimal = parseFloat(numero.toFixed(2));
    return numeroDecimal;
}
// Example usage:
const result = generarPosicionesRandom();
console.log(result);