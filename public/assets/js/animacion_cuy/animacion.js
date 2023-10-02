$.LoadingOverlay("show");
$(".loadingoverlay").append($('<div id="cargador_overlay" style="font-family:Arial;position: relative; left: 8%;width:7%;height: 10%; text-align:center;font-size:8vh;color:black">--</div>'))
$(".loadingoverlay").css("background-color","rgba(255, 255, 255, 0.3)");

$("#DIV_EVENTOESPERANDO").hide();
$("#DIV_TITULOEVENTO").hide();
// $("body").css("background","none"); 
IPSERVIDOR_WEBSOCKETS=$("#IPSERVIDOR_WEBSOCKETS").val();
PUERTO_WEBSOCKETS=$("#PUERTO_WEBSOCKETS").val();
TIMEOUT_CONEXIONWEBSOCKETS_CORTAR=5000;
CONTROLES=false;

GANADOR_DE_EVENTO="";
EVENTO_ID="";


var VENTANA_ACTIVA = true;
EVENTO_YA_PASO=false;
window.addEventListener('blur', function() {
   //not running full
   VENTANA_ACTIVA=false;
   console.log("VENTANA_ACTIVA FALSE" );

   // if(EVENTO_YA_PASO){
   //      window.reload();
   // }
}, false);

window.addEventListener('focus', function() {
   //running optimal (if used)
    VENTANA_ACTIVA=true;
   console.log("VENTANA_ACTIVA TRUE" )

}, false);



$(document).ready(function () {
    // bloquear_teclas_mouse();
   INICIAR_RENDER();
});

if (WEBGL.isWebGLAvailable() === false) {
    document.body.appendChild(WEBGL.getWebGLErrorMessage());
}
var scene, renderer, camera, stats;
var model, modelCajaP,modelCuyDudando, modelChoque, modelCaja,modelCuyPremio,modelCuySalto,modelCuyEsperando, skeleton, 
mixer, mixerCaja,mixerCuyDudando,mixerCajaP,mixerCuyPremio,mixerCuyEsperando,mixerCuySalto, clock,clockCuyPremio,clockCuyEsperando,clockCuySalto;
var crossFadeControls = [];
var idleAction, walkAction, runAction;
var idleWeight, walkWeight, runWeight;
var actions, settings;
var singleStepMode = false;
var sizeOfNextStep = 0;
var loaded = false;
var i = 0;
var controls;
var posicionZ = 0;


function getObjeto_caja(nombrebuscar){
    // arraycajas=modelCaja.children[0].children[0].children;
    arraycajas=modelCaja.children[0].children[0].children[0].children;
    objetoretornar=null;
    $(arraycajas).each(function(i,e){
        // nombre=e.material.map.name;///1.png
         nombre=e.name;///1.png
        //nombre=nombre.substring(0,nombre.indexOf("."));
        if(nombre==nombrebuscar){
            objetoretornar= e;
            return false;
        }
    })
    return objetoretornar;
}

function get_maderas(){
    maderas=[];
    arraycajas=modelCaja.children[0].children[0].children;
    $(arraycajas).each(function(i,e){
        nombre=e.name;///1.png
        if(nombre=="madera" || nombre=="madera2" ){
            maderas.push(e);
        }
    })
return maderas;
}

function INICIAR_RENDER() {
    clock = new THREE.Clock();
    clockCuyDudando = new THREE.Clock();
    clockCajaP = new THREE.Clock();
    clockCuyChoque = new THREE.Clock();
    clockCuyPremio = new THREE.Clock();
    clockCuyEsperando = new THREE.Clock();
    clockCuySalto= new THREE.Clock();
    var container = document.getElementById('DIV_CANVAS');
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 100);
    camera.position.set(0, 10, 0);
    // //controls
    if(CONTROLES){
        controls = new THREE.OrbitControls(camera);
        controls.rotateSpeed = 1.0;
        controls.zoomSpeed = 1.2;
        controls.panSpeed = 0.8;
        controls.autoRotate = true;
    }
    //  controls.addEventListener( 'change',  renderer.render( scene, camera ) ); 
    //escena
    scene = new THREE.Scene();
     // scene.background = new THREE.Color(0xa0a0a0);
     // scene.fog = new THREE.Fog(0xa0a0a0, 10, 50);
    hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444);
    // hemiLight.color.setHSL( 0.6, 1, 0.6 );
    hemiLight.position.set(0, 20, 0);
    scene.add(hemiLight);
    dirLight = new THREE.DirectionalLight(0xffffff);
    dirLight.position.set(-3, 20, -15);
    // dirLight.position.set(-15, 20, -25);
    dirLight.castShadow = true;
    camerashadow=5;
    dirLight.shadow.camera.top = camerashadow;
    dirLight.shadow.camera.bottom = -camerashadow;
    dirLight.shadow.camera.left = -camerashadow;
    dirLight.shadow.camera.right = camerashadow;
    dirLight.shadow.camera.near = 0.1;
    dirLight.shadow.camera.far = 40;
    dirLight.position.y=34;
    // dirLight.shadow.mapSize.height=2048;
    // dirLight.shadow.mapSize.width=2048;
     dirLight.shadow.mapSize.height=2048;
    scene.add(dirLight);
    // var axesHelper = new THREE.AxesHelper( 5,5,5 );
    // controls = new THREE.OrbitControls(camera);
    // controls.autoRotateSpeed = 10;
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    

    var vertexShader = document.getElementById( 'vertexShader' ).textContent;
    var fragmentShader = document.getElementById( 'fragmentShader' ).textContent;
    var uniforms = {
        "topColor": { value: new THREE.Color( 0x0077ff ) },
        "bottomColor": { value: new THREE.Color( 0xffffff ) },
        "offset": { value: 33 },
        "exponent": { value: 0.6 }
    };
        uniforms[ "topColor" ].value.copy( new THREE.Color(0.1999999,0.5199999,1) );
    var skyGeo = new THREE.SphereBufferGeometry( 80, 120,60 );
    var skyMat = new THREE.ShaderMaterial( {
        uniforms: uniforms,
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        side: THREE.BackSide
    } );

    var sky = new THREE.Mesh( skyGeo, skyMat );
    scene.add( sky );

    //var material = new THREE.MeshBasicMaterial();
    var loader = new THREE.GLTFLoader();
    // Plano y Cajas
    CAJAS_ARRAY = [];
    var loaderCaja = new THREE.GLTFLoader();

    TIEMPO_RENDER=performance.now();
    loaderCaja.load('images/glb/tablerograss_blanco.glb', function (gltfCaja) {
        todo=gltfCaja;
        modelCaja = gltfCaja.scenes[0];
        modelCaja.traverse(function (object) {
            if (object instanceof THREE.Mesh) {
                object.castShadow = true;
            }
        });
        // modelCaja.scale.set(0.005, 0.005, 0.005);
        modelCaja.children[0].children[0].position.y=0.28; 
        var escalatablero=0.4;
        var escalatablerox=0.55;
         // modelCaja.children[0].children[0].children[1].scale.set(escalatablerox,escalatablero,escalatablero);/// suelo 
          tablero= modelCaja.children[0].children[0].children[1];
          tablero.scale.set(escalatablerox,escalatablero,escalatablero);/// suelo 

          suelo= modelCaja.children[0].children[0].children[0];
        // modelCaja.children[0].children[0].children[1].scale.set(0.4,0.4,0.4)

        modelCaja.name ="TABLA_CAJAS";
        scene.add(modelCaja);
        cargar_archivos(); ///////////////////////
        // modelCaja.children[0].children[0].rotation.y = 180 * (Math.PI / 180); ////rotar cajas para que caja X verde este arriba
       modelCaja.children[0].children[0].children[1].receiveShadow=true;
       // modelCaja.children[0].position.y = 39;
       // modelCaja.children[0].children[1].scale.set(3, 3, 3); ///suelo
        // CAJAS_ARRAY = modelCaja.children[0].children[0].children;  /// 0 1 => MADERAS   2=>caja verde  ,  3=> 32, 4 => 15 ...
        CAJAS_ARRAY=modelCaja.children[0].children[0].children[0].children;
        cajax=modelCaja.children[0].children[0].children[2];

    } ,progreso_descarga);

  ///
//  valueToAdd = 0.005;
//         rtTexture1 = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, { // CHANGED
//         minFilter: THREE.LinearMipMapLinearFilter,
//         magFilter: THREE.LinearFilter,
//         format: THREE.RGBFormat
//     });
//     rtTexture1.wrapS = rtTexture1.wrapT = THREE.RepeatWrapping;
//     rtTexture1.repeat.set(1, -1);

//     rtTexture2 = rtTexture1.clone();
//     valo=1000;
//     var w = window.innerWidth;
// var h = window.innerHeight;
// var viewSize = h;
// var aspectRatio = w / h;

// _viewport = {
//     viewSize: viewSize,
//     aspectRatio: aspectRatio,
//     left: (-aspectRatio * viewSize) / 2,
//     right: (aspectRatio * viewSize) / 2,
//     top: viewSize ,
//     bottom: -viewSize ,
//     near: -100,
//     far: 100
// }

// cameraquad = new THREE.OrthographicCamera (
//     _viewport.left,
//     _viewport.right,
//     _viewport.top,
//     _viewport.bottom,
//     _viewport.near,
//     _viewport.far
// );
//     var quadgeometry = new THREE.PlaneGeometry(window.innerWidth, window.innerHeight);
//     quadmaterial = new THREE.ShaderMaterial({

//         uniforms: {

//             tDiffuse1: {
//                 type: "t",
//                 value: rtTexture1                                // CHANGED
//             },
//             tDiffuse2: {
//                 type: "t",
//                 value: rtTexture2                                // CHANGED
//             },
//             mixRatio: {
//                 type: "f",
//                 value: 0.5
//             },
//             opacity: {
//                 type: "f",
//                 value: 1.0
//             }

//         },
//         vertexShader: [
//             "varying vec2 vUv;",
//             "void main() {",
//             "vUv = vec2( uv.x, 1.0 - uv.y );",
//             "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

//             "}"

//         ].join("\n"),
//         fragmentShader: [
//             "uniform float opacity;",
//             "uniform float mixRatio;",

//             "uniform sampler2D tDiffuse1;",
//             "uniform sampler2D tDiffuse2;",
//             "varying vec2 vUv;",
//             "void main() {",
//             "vec4 texel1 = texture2D( tDiffuse1, vUv );",
//             "vec4 texel2 = texture2D( tDiffuse2, vUv );",
//             "gl_FragColor = opacity * mix( texel1, texel2, mixRatio );",
//             "}"

//         ].join("\n")

//     });

//     camera1 = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 100);
//     camera1.position.set(0.00001, 10, 0.0001);
//     // camera1.position.z = 500;
//     // camera1.position.y = 300;
//     camera1.lookAt(new THREE.Vector3(0, 0, 0));

//     camera2 = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 100);
//     camera2.position.set(0.00001,0.00001,10);
//     camera2.lookAt(new THREE.Vector3(0, 0, 0));

//     // camera2.position.z = 500;
//     scene.add(camera1);
//     scene.add(camera2);


//     cameraquad.position.set(0, 0.00001,-60);



//     var quad = new THREE.Mesh(quadgeometry, quadmaterial);
//     quadscene = new THREE.Scene();
//     quadscene.add(quad);
//     quadscene.add(cameraquad);

    //////////////////////////////////////////
    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setPixelRatio(window.devicePixelRatio);

    var ww=window.innerWidth;//*0.6;
    var hh=window.innerHeight;//*0.6;
    renderer.setSize(ww, hh);
    renderer.gammaOutput = true;
    renderer.gammaFactor = 2;
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);
}

CONSULTADO_EVENTO=false;
function CargarEstadistica(IdJuego) {    
    var url = document.location.origin + "/" + "api/DataEventoResultadoEventoFk";
    $.ajax({
        url: url,
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({IdJuego: IdJuego}),
        beforeSend: function () {
          CONSULTADO_EVENTO=true;
        },
        complete: function () {
        },
        success: function (response) { 

                
            CONSULTADO_EVENTO=false;
            aaa=response;        
            $.each(response.estadistica, function( key, value ) {
                $("#"+value.valorapuesta).text(value.Repetidos);
                $("#"+value.valorapuesta).prev().css("background-color",value.rgb)
                $("#"+value.valorapuesta).prev().css("color",value.rgbLetra)
            });
            var strUltimos12="";
            $.each(response.resultado_evento, function( key, value ) {
                if(key<12){
                          strUltimos12+='<tr><th class="caja">'+value.idEvento+'</th><th style="color:'+value.rgbLetra+';background-color:'+value.rgb+'">'+value.valorGanador+'</th></tr>';
                }
            });
            $("#tablaUltimos").html(strUltimos12);


            ocultar_cuy_cargando();
            $.LoadingOverlay("hide");
           ocultar_toasr_nohay_evento();
           ocultar_toasr_servidor_error()
        },
        error: function (jqXHR, textStatus, errorThrown) {
          CONSULTADO_EVENTO=false;
         ocultar_toasr_nohay_evento();
          crear_toasr_servidor_error();
          setTimeout(function(){
            CargarEstadistica(1);
          }
            ,1500)

        }
    });
}

function CargarEst() {    
    var url = document.location.origin + "/DatosEstadisticaFK";
    $.ajax({
        url: url,
        type: "POST",
        contentType: "application/json",
        beforeSend: function () {
        },
        complete: function () {
        },
        success: function (response) { 
            calcular_estadisticas(response.estadistica);
          
        },
        error: function (jqXHR, textStatus, errorThrown) {
        }
    });
}

function detener_timeout_conexionwebsockets(){
      if(typeof revisar_ya_conecto!="undefined"){
        clearInterval(revisar_ya_conecto);revisar_ya_conecto=null;
      } 
}
function timeout_conexionwebsockets(){
}
function crear_toastr_websockets_error(){
    if(ANIMACION_CUY==false){
        if(typeof toasr_websockets_error=="undefined"){
            toastr.options = {
              timeOut: 0,
              extendedTimeOut: 0,
              tapToDismiss: false
            };
            toasr_websockets_error=toastr.error("Conectando a Servidor...");
        }
        else{
            toasr_websockets_error.show()
        }
    }
}

function ocultar_toasr_websockets_error(){ 
     if(typeof toasr_websockets_error!="undefined"){
        toasr_websockets_error.hide();
    }
}
function crear_toasr_nohay_evento(){
  if(typeof toasr_nohay_evento=="undefined"){
                                toastr.options = {
                                  timeOut: 0,
                                  extendedTimeOut: 0,
                                  tapToDismiss: false
                                };
                                toasr_nohay_evento=toastr.error("No hay Evento Activo...");
                            }
            else{toasr_nohay_evento.show()}
}

function crear_toasr_servidor_error(){
  if(typeof toasr_servidor_error=="undefined"){
                                toastr.options = {
                                  timeOut: 0,
                                  extendedTimeOut: 0,
                                  tapToDismiss: false
                                };
                                toasr_servidor_error=toastr.error("Error Servidor...");
                            }
            else{toasr_servidor_error.show()}
}
function ocultar_toasr_nohay_evento(){
    if(typeof toasr_nohay_evento!="undefined"){
                    toasr_nohay_evento.hide();
                }
}
function ocultar_toasr_servidor_error(){ 
     if(typeof toasr_servidor_error!="undefined"){
        toasr_servidor_error.hide();
    }
}

function iniciar_websocketservidor(){
        ocultar_cuy_cargando();
        $.LoadingOverlay("hide");
        ocultar_toasr_nohay_evento();
        ocultar_toasr_servidor_error()
        if(socket!=null && socket.readyState==1){
            if(socket.readyState==0){
                console.info("socket.readyState==0");
            }
            inicio_pedir_hora=performance.now();
            pedir_hora=true;
            timeout_pedir_hora=setInterval(function(){
                if(pedir_hora){
                    crear_toastr_websockets_error();
                }
                else{
                    clearInterval(timeout_pedir_hora);
                }
            },6000);
            console.warn(performance.now() +" YA CONECTADO, pedir datos");
            pedir_eventoJSON();///INICIO_ANIMACION_CUY despues de recibir hora de servidor ///////////////************///
        }
        else{
              console.warn(performance.now() +"INICIANDO CONEXIÓN ");
              CONECTADO__A_SERVIDORWEBSOCKET=false;
              //inicio_intento_conexion=performance.now();
              connectarWebSockets(IPSERVIDOR_WEBSOCKETS,PUERTO_WEBSOCKETS);  ///en archivo ClaseWebSockets.js
                revisar_ya_conecto=setInterval(function(){
                        if(CONECTADO__A_SERVIDORWEBSOCKET){
                            if(typeof toasr_websockets_error!="undefined"){
                                toasr_websockets_error.hide();
                            }
                            clearInterval(revisar_ya_conecto);
                        }
                        else{
                           crear_toastr_websockets_error();
                        }
                },1000);

        }
}


function calcular_estadisticas(array_estadisticas){
    var estadistica=array_estadisticas;
    $.each(estadistica, function( key, value ) {
        $("#"+value.valorapuesta).text(value.Repetidos);
        $("#"+value.valorapuesta).prev().css("background-color",value.rgb)
        $("#"+value.valorapuesta).attr("data-color",value.rgb)
        $("#"+value.valorapuesta).data("color",value.rgb)
        $("#"+value.valorapuesta).prev().css("color",value.rgbLetra)
    });

    rgb1=$("#color1").attr("data-color")
    rgb2=$("#color2").attr("data-color")
    rgb3=$("#cajaB").attr("data-color")
    rango1_12=0
    rango13_24=0
    rango25_36=0
    color1=0
    color2=0;
    color3=0;

    $(estadistica).each(function(i,e){
        valor=parseInt(e.valorapuesta)
        repetidos=parseInt(e.Repetidos);
        color=e.rgb;

        if(valor>0 && valor<=12){
            rango1_12=rango1_12+repetidos;
        }
        if(valor>12 && valor<=24){
            rango13_24=rango13_24+repetidos;
        }
        if(valor>24 && valor<=36){
            rango25_36=rango25_36+repetidos;
        }
        if(valor==0){
            color0=repetidos;
        }
        if(color==rgb1){
            color1=color1+repetidos;
        }
        if(color==rgb2){
            color2=color2+repetidos;
        }
        if(color==rgb3){
            color3=color3+repetidos;
        }
    })
    estadistica.sort(function(a,b){
        if(a.Repetidos > b.Repetidos){ return 1}
            if(a.Repetidos < b.Repetidos){ return -1}
                return 0;
        });
    mayores=[];
    menores=[];
    $(estadistica).each(function(i,e){
        if(i<5){
            menores.push(e);
        }
        if(i>=estadistica.length-5){
            mayores.push(e);
        }
    })
    $("#estadisticas_menores").empty().append($("<div class='cold'>").text("COLD"));
    $(menores).each(function(i,e){
        var fondo=e.rgb;
        var colorletra=e.rgbLetra;
        var valor=e.valorapuesta;
        if(valor=="0"){valor="x";}
        $("#estadisticas_menores")
        .append(
            $("<div>").attr("style","background-color: "+fondo+"; color: "+colorletra).text(valor)
            )
    })

    $("#estadisticas_mayores").empty().append($("<div class='hot'>").text("HOT"));

    mayores.sort(function(a,b){
        if(a.Repetidos < b.Repetidos){ return 1}
        if(a.Repetidos > b.Repetidos){ return -1}
        return 0;
    });

    $(mayores).each(function(i,e){
        var fondo=e.rgb;
        var colorletra=e.rgbLetra;
        var valor=e.valorapuesta;
        if(valor=="0"){valor="x";}

        $("#estadisticas_mayores")
        .append(
            $("<div>").attr("style","background-color: "+fondo+"; color: "+colorletra).text(valor)
            )
    })
    var div_estadistica=$("#DIV_ESTADISTICA");
    $("#1_12",div_estadistica).text(rango1_12);
    $("#13_24",div_estadistica).text(rango13_24);
    $("#25_36",div_estadistica).text(rango25_36);
    $("#color1",div_estadistica).text(color1);
    $("#color2",div_estadistica).text(color2);
    $("#cajaB",div_estadistica).text(color3);
} 