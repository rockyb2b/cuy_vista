$.LoadingOverlay("show");
$(".loadingoverlay").append($('<div id="cargador_overlay" style="font-family:Arial;position: relative; left: 8%;width:7%;height: 10%; text-align:center;font-size:8vh;color:black">--</div>'))
$(".loadingoverlay").css("background-color","rgba(255, 255, 255, 0.3)");

$("#DIV_EVENTOESPERANDO").hide();
$("#DIV_TITULOEVENTO").hide();
IPSERVIDOR_WEBSOCKETS=$("#IPSERVIDOR_WEBSOCKETS").val();
PUERTO_WEBSOCKETS=$("#PUERTO_WEBSOCKETS").val();
TIMEOUT_CONEXIONWEBSOCKETS_CORTAR=5000;
CONTROLES = false;

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
var model, 
    modelCajaP,
    modelCuyDudando,
    modelChoque,
    modelCaja,
    modelCuyPremio,modelCuySalto,
    modelCuyEsperando,
    skeleton, 
    mixer, mixerCaja , mixerCuyDudando , mixerCajaP , mixerCuyPremio , mixerCuyEsperando , mixerCuySalto, 
    clock,
    clockCuyDudando,
    clockCajaP,
    clockCuyChoque,
    clockCuyPremio,
    clockCuyEsperando,
    clockCuySalto;
var CAJAS_ARRAY = [];
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
    arraycajas = modelCaja.children[0].children[0].children[0].children;
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
    var maderas = [];
    arraycajas = modelCaja.children[0].children[0].children;
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
    //escena
    scene = new THREE.Scene();
    var hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444);
    hemiLight.position.set(0, 20, 0);
    scene.add(hemiLight);
    var dirLight = new THREE.DirectionalLight(0xffffff);
    dirLight.position.set(-3, 20, -15);
    dirLight.castShadow = true;
    camerashadow=5;
    dirLight.shadow.camera.top = camerashadow;
    dirLight.shadow.camera.bottom = -camerashadow;
    dirLight.shadow.camera.left = -camerashadow;
    dirLight.shadow.camera.right = camerashadow;
    dirLight.shadow.camera.near = 0.1;
    dirLight.shadow.camera.far = 40;
    dirLight.position.y=34;

    dirLight.shadow.mapSize.height=2048;
    scene.add(dirLight);

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
    TIEMPO_RENDER = performance.now();
    loaderCaja.load('images/glb/tablerograss_blanco.glb', function (gltfCaja) {
        // todo = gltfCaja;
        modelCaja = gltfCaja.scenes[0];
        modelCaja.traverse(function (object) {
            if (object instanceof THREE.Mesh) {
                object.castShadow = true;
            }
        });
        modelCaja.children[0].children[0].position.y = 0.28; 
        var escalatablero = 0.4;
        var escalatablerox = 0.55;
        var tablero = modelCaja.children[0].children[0].children[1];
        tablero.scale.set(escalatablerox,escalatablero,escalatablero);/// suelo 

        var suelo = modelCaja.children[0].children[0].children[0];

        modelCaja.name ="TABLA_CAJAS";
        scene.add(modelCaja);
        cargar_archivos(); ///////////////////////
        modelCaja.children[0].children[0].children[1].receiveShadow=true;
        CAJAS_ARRAY = modelCaja.children[0].children[0].children[0].children;
        cajax = modelCaja.children[0].children[0].children[2];
    } ,progreso_descarga);

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

CONSULTADO_EVENTO = false;
function CargarEstadistica(IdJuego) {    
    var url = document.location.origin + "/" + "api/DataEventoResultadoEventoFk";
    $.ajax({
        url: url,
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({IdJuego: IdJuego}),
        beforeSend: function () {
          CONSULTADO_EVENTO = true;
        },
        complete: function () {
        },
        success: function (response) { 
            CONSULTADO_EVENTO = false;
            aaa = response;        
            $.each(response.estadistica, function( key, value ) {
                $("#"+value.valorapuesta).text(value.Repetidos);
                $("#"+value.valorapuesta).prev().css("background-color",value.rgb)
                $("#"+value.valorapuesta).prev().css("color",value.rgbLetra)
            });
            var strUltimos12 = "";
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
    if(ANIMACION_CUY == false){
        if(typeof toasr_websockets_error == "undefined"){
            toastr.options = {
              timeOut: 0,
              extendedTimeOut: 0,
              tapToDismiss: false
            };
            toasr_websockets_error = toastr.error("Conectando a Servidor...");
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