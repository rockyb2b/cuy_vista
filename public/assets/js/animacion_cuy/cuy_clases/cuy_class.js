import { Archivos } from './archivos_class.js';

$.LoadingOverlay("show");
$(".loadingoverlay").append($('<div id="cargador_overlay" style="font-family:Arial;position: relative; left: 8%;width:7%;height: 10%; text-align:center;font-size:8vh;color:black">--</div>'))
$(".loadingoverlay").css("background-color","rgba(255, 255, 255, 0.3)");

$("#DIV_EVENTOESPERANDO").hide();
$("#DIV_TITULOEVENTO").hide();
const IPSERVIDOR_WEBSOCKETS = "1";//$("#IPSERVIDOR_WEBSOCKETS").val();
const PUERTO_WEBSOCKETS=$("#PUERTO_WEBSOCKETS").val();
const TIMEOUT_CONEXIONWEBSOCKETS_CORTAR = 5000;
const CONTROLES = false;

var  GANADOR_DE_EVENTO = "";
var  EVENTO_ID = "";

var VENTANA_ACTIVA = true;
var EVENTO_YA_PASO = false;
window.addEventListener('blur', function() {
   //not running full
   VENTANA_ACTIVA = false;
   console.log("VENTANA_ACTIVA FALSE" );
   // if(EVENTO_YA_PASO){
   //      window.reload();
   // }
}, false);

window.addEventListener('focus', function() {
    VENTANA_ACTIVA = true;
    console.log("VENTANA_ACTIVA TRUE")
}, false);

$(document).ready(function () {
    // bloquear_teclas_mouse();
    // INICIAR_RENDER();
});

if (WEBGL.isWebGLAvailable() === false) {
    document.body.appendChild(WEBGL.getWebGLErrorMessage());
}

class Cuy {
    constructor(options) {
        this.TIEMPO_RENDER;
        this.TIEMPO_FIN_RENDER ;
        this.cajax;
        this.scene ;
        this.renderer;
        this.camer;
        this.stat;
        this.model ;
        this.modelCajaP;
        this.modelCuyDudando;
        this.modelChoque;
        this.modelCaja;
        this.modelCuyPremi;
        this.modelCuySalto;
        this.modelCuyEsperando;
        this.skeleton;
        this.mixer;
        this.mixerCaja ;
        this.mixerCuyDudando ;
        this.mixerCajaP ;
        this.mixerCuyPremio ;
        this.mixerCuyEsperando ;
        this.mixerCuySalto;
        this.clock;
        this.clockCuyDudando;
        this.clockCajaP;
        this.clockCuyChoque;
        this.clockCuyPremio;
        this.clockCuyEsperando;
        this.clockCuySalto;
        this.CAJAS_ARRAY = [];//array cajas numbered
        this.i = 0;
        this.controls;//THREE.OrbitControls

        this.CONSULTADO_EVENTO = false;

        this.Archivos ;

        this.tamano_total = 14073552 + 3595876 + 4225396 + 3728832 + 2647408;  /*archivos glb para cargar*/
        this.cargado = 0;
        this.sumatoria_descargado = 0;

        this.toasr_servidor_error ;
        this.toasr_nohay_evento;

        this.dt = 0.03; // velocidad movimiento cuy
        this.dtrotacion = 0.05; // velocidad rotacion cuy;
        this.escalacuys = 0.25;
        this.escalacajagirando = 1;
        this.intervalo_consultaevento = 2000;
        this.buscando_evento = false;
        this.ANIMACION_CUY = false;
        this.ANIMACION_CUY_PORTADA = false;
        this.TEXTO_NEON_PORTADA = "¿A donde va el cuy? ¡Realiza Tu Apuesta!";
        this.TEXTO_CONTADOR = "APUESTAS SE CIERRAN EN";
        this.TEXTO_ESPERAR_TERMINO_EVENTO = "EVENTO TERMINA EN";


        this.var_animarcamara;
        this.var_cajagirando;
        this.var_correr_spline_portada;
        this.a;
        this.ULTIMO_PUNTO_CUY;

        this.posicionycajaxinicial;
        this.posicionfinalcaja;

        this.t;
        this.timerotacion;

        this.cajax_posicioninicial;
        this.posicionmadera;

        this.dtcajax;
        this.tcajax ;
        this.rotacionx_inicio;
        this.rotacionx_fin;
        this.q1_cajax ;
        this.q2_cajax ;

        this.inicio;
        this.inicio_tiempo;
        this.spline;

        this.toast_eventoterminar;
        this.toastr_eventofinalizo;

        this.otro;

        this.up = new THREE.Vector3(0,0,1 );
        this.axis = new THREE.Vector3( );

    }
    accion_cuy2(evento_valor_ganador,seg_para_animacion,seg_para_finevento) {
        EVENTO_ID = 1
        GANADOR_DE_EVENTO ="5"
        TIEMPO_GIRO_CAJA = 3000;
        $("#evento_actual_portada").text("#" +EVENTO_ID);
        TIEMPO_GANADOR_PORTADA = 10000;
    
        TIEMPO_CUY = (20 * 1000) - TIEMPO_GIRO_CAJA; //EVENTO_ACTUAL.tiempo_cuy_moviendo;
        TIEMPO_CUY_CHOQUE = 5000;///tiempo espera cuy en estado de choque
        TIEMPO_ESPERA_CASAGANADOR = 1000; ///tiempo espera luego q cuy entra en casa
        
        PUNTOS_CUY = generarPosicionesRandom();
    
        FECHA_INICIO_EVENTO = "2023-09-26";
        FECHA_INICIO_EVENTO = moment(FECHA_INICIO_EVENTO, "YYYY-MM-DD HH:mm:ss a");
    
        FECHA_FIN_EVENTO = "2023-09-26";
        FECHA_FIN_EVENTO = moment(FECHA_FIN_EVENTO, "YYYY-MM-DD HH:mm:ss a");
    
        FECHA_ANIMACION = "2023-09-26";
        FECHA_ANIMACION = moment(FECHA_ANIMACION, "YYYY-MM-DD HH:mm:ss a");
    
        var id_evento = 1;
        var ganador_evento = evento_valor_ganador;
        var fecha_fin = '2023-09-26 11:50';
        var fecha_fin_ev = moment(fecha_fin, "YYYY-MM-DD HH:mm:ss a");
        // if (ANIMACION_CUY_PORTADA == false) {
        //     INICIO_ANIMACION_CUY_PORTADA(); /*CUY PORTADA*/ ;
        // }
        if (seg_para_animacion > 0) { ///EN rango animacion
            setTimeout(function() {
                ///barra carga cuy
                this.   mostrar_div_eventoesperando();
                $("#barra_loading_tpi").animate({
                    height: "0%"
                }, (seg_para_animacion) * 1000, function() {
                    setTimeout(function(){
                        if(typeof $("#termotetro_para_iniciar").data("illuminate")!="undefined"){
                            $("#termotetro_para_iniciar").data("illuminate").destruir();
                        }
                        callback_animacion(id_evento);
                    },1000)
                    ;
                });
                this.actualizar_contador_texto_latido(seg_para_animacion,TEXTO_CONTADOR);
            }, 1000);
        } else { //////seg animacionm else
            toastr.options = opciones_toast_mantener;
            console.log(performance.now() + " esperando fecha fin evento actual " + id_evento + ",para recargar " + fecha_fin_ev);
            if (seg_para_finevento > 0) {
                this.mostrar_div_eventoesperando();
                this.toast_eventoterminar = toastr.info("Esperando que termine evento actual");
                $("#barra_loading_tpi").animate({
                    height: "0%"
                }, (seg_para_finevento) * 1000, function() {
                    this.callback_esperar_termino_evento(ganador_evento);
                });
                this.actualizar_contador_texto(seg_para_finevento , this.TEXTO_ESPERAR_TERMINO_EVENTO);
            } 
            else 
            {
                this.toastr_eventofinalizo = toastr.info(" Evento actual ya finalizó")
                if (typeof timeout_eventofinalizo != "undefined") {
                    //clearTimeout(timeout_eventofinalizo);
                } else {
                    timeout_eventofinalizo = setTimeout(function() {
                        this.toastr_eventofinalizo.hide();
                        clearTimeout(timeout_eventofinalizo);
                    //   delete timeout_eventofinalizo;
                        iniciar_websocketservidor();
                    }, 4000)
                }
            } ///else segundos_para_fin_evento >0
      } //fin else
    } ///fin accion cuy2

    actualizar_contador_texto_latido(tiempo_en_segundos,texto){
        $("#contador_para_activar").text(texto + " " + tiempo_en_segundos +" seg.");
        var conta = tiempo_en_segundos - 1;
       // $("#termotetro_para_iniciar").removeClass("latido_animacion_2");
        conteo_ = setInterval(function() {
            $("#contador_para_activar").text(texto + " " + conta +" seg. ");
            if (conta < 1) {
             // $("#termotetro_para_iniciar").removeClass("latido_animacion_2");
                clearInterval(conteo_);
            }else if(conta < 11)
            {
                efecto_brillo=$('#termotetro_para_iniciar')
                    .illuminate({
                        'intensity': '1.9',
                        'color': 'white',
                        'blink': 'true',
                        'blinkSpeed': '500',
                        'outerGlow': 'true',
                        'outerGlowSize': '10px',
                        'outerGlowColor': '#BD0000'
                                });
                        // $("#termotetro_para_iniciar").addClass("latido_animacion_2");
            }
            conta = parseInt(conta) - 1;
        }, 1000);
    }
    actualizar_contador_texto(tiempo_en_segundos,texto){
        $("#contador_para_activar").text(texto + " " + tiempo_en_segundos +" seg.");
        var conta = tiempo_en_segundos - 1;
        conteo_ = setInterval(function() {
            $("#contador_para_activar").text(texto + " " + conta +" seg. ");
            if (conta < 1) {
                clearInterval(conteo_);
            }
            conta = parseInt(conta) - 1;
        }, 1000);
    }
    callback_esperar_termino_evento(GANADOR_DE_EVENTO){
        this.reiniciar_termometro();
        // ultimos120eventos.splice(-1,1);
        // ultimos120eventos.unshift({ganador:GANADOR_DE_EVENTO,idEvento:EVENTO_ID});
        // calcular_estadisticas_nuevo();
        // agregar_ganador_estadistica(GANADOR_DE_EVENTO);
        this.toast_eventoterminar.hide();
        // iniciar_websocketservidor(); //////////////////////////////
    }
    generarPosicionesRandom() {
        const arrayPuntos = [];
        for (let i = 0; i < 40; i++) {
            const randomX = Math.random() >= 0.5 ? Math.abs(this.randomPosicion(0, 2.35)) : -Math.abs(this.randomPosicion(0, 2.35));
            const randomZ = Math.random() >= 0.5 ? Math.abs(this.randomPosicion(0, 2.35)) : -Math.abs(this.randomPosicion(0, 2.35));
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
    randomPosicion(min, max) {
        const numero = Math.random() * (max - min) + min;
        const numeroDecimal = parseFloat(numero.toFixed(2));
        return numeroDecimal;
    }
    reiniciar_termometro(){
        $("#barra_loading_tpi").css("height","100%");
    }

    getObjeto_caja(nombrebuscar){
        var arraycajas = this.modelCaja.children[0].children[0].children[0].children;
        var objetoretornar = null;
        $(arraycajas).each(function(i,e){
            var nombre = e.name;///1.png
            if(nombre == nombrebuscar){
                objetoretornar= e;
                return false;
            }
        })
        return objetoretornar;
    }
    
    get_maderas(){
        var maderas = [];
        var arraycajas = this.modelCaja.children[0].children[0].children[0];
        $(arraycajas).each(function(i,e){
            var nombre = e.name;///1.png
            if(nombre == "madera" || nombre == "madera2" ){
                maderas.push(e);
            }
        })
        return maderas;
    }
    
    INICIAR_RENDER() {
        var container = document.getElementById('DIV_CANVAS');
        this.clock = new THREE.Clock();
        this.clockCuyDudando = new THREE.Clock();
        this.clockCajaP = new THREE.Clock();
        this.clockCuyChoque = new THREE.Clock();
        this.clockCuyPremio = new THREE.Clock();
        this.clockCuyEsperando = new THREE.Clock();
        this.clockCuySalto= new THREE.Clock();
        this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 100);
        this.camera.position.set(0, 10, 0);
        // //controls
        if(CONTROLES){
            this.controls = new THREE.OrbitControls(camera);
            this.controls.rotateSpeed = 1.0;
            this.controls.zoomSpeed = 1.2;
            this.controls.panSpeed = 0.8;
            this.controls.autoRotate = true;
        }
        //escena
        this.scene = new THREE.Scene();
        var hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444);
        hemiLight.position.set(0, 20, 0);
        this.scene.add(hemiLight);
        var dirLight = new THREE.DirectionalLight(0xffffff);
        dirLight.position.set(-3, 20, -15);
        dirLight.castShadow = true;
        var camerashadow = 5;
        dirLight.shadow.camera.top = camerashadow;
        dirLight.shadow.camera.bottom = -camerashadow;
        dirLight.shadow.camera.left = -camerashadow;
        dirLight.shadow.camera.right = camerashadow;
        dirLight.shadow.camera.near = 0.1;
        dirLight.shadow.camera.far = 40;
        dirLight.position.y=34;
    
        dirLight.shadow.mapSize.height=2048;
        this.scene.add(dirLight);
    
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));
    
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
        this.scene.add( sky );
    
        //var material = new THREE.MeshBasicMaterial();
        var loader = new THREE.GLTFLoader();
        // Plano y Cajas
        this.CAJAS_ARRAY = [];
        var loaderCaja = new THREE.GLTFLoader();
        this.TIEMPO_RENDER = performance.now();
        
        const $this = this;

        loaderCaja.load('images/glb/tablerograss_blanco.glb', function(gltfCaja) {
            // todo = gltfCaja;
            $this.modelCaja = gltfCaja.scenes[0];
            $this.modelCaja.traverse(function(object) {
                if (object instanceof THREE.Mesh) {
                    object.castShadow = true;
                }
            });
            $this.modelCaja.children[0].children[0].position.y = 0.28; 
            var escalatablero = 0.4;
            var escalatablerox = 0.55;
            var tablero = $this.modelCaja.children[0].children[0].children[1];
            tablero.scale.set(escalatablerox,escalatablero,escalatablero);/// suelo 
            var suelo = $this.modelCaja.children[0].children[0].children[0];
    
            $this.modelCaja.name ="TABLA_CAJAS";
            $this.scene.add($this.modelCaja);


            const options = {
                archivos: [
                        'images/glb/cuycaminando.glb',
                        'images/glb/cajagirando1.glb',
                        'images/glb/cuycabezagirando.glb',
                        'images/glb/cuyestrellas.glb'
                    ],
                callback : function(){
                    $this.otro = $this.model.clone();
                    $this.TIEMPO_FIN_RENDER = performance.now() - $this.TIEMPO_RENDER;
                    $this.TIEMPO_FIN_RENDER = ($this.TIEMPO_FIN_RENDER/1000).toFixed(2);
                    console.warn("FIN CARGA ARCHIVOS en " + $this.TIEMPO_FIN_RENDER + " seg");
                    $("#JUEGO").show();
                    if ($this.ANIMACION_CUY_PORTADA == false) {
                        $this.INICIO_ANIMACION_CUY_PORTADA(); /*CUY PORTADA*/ ;
                    }
                    //iniciar_websocketservidor();
                    window.addEventListener('resize', this.responsive_canvas, false);
                    return;
                },
                cuy: $this
            };
            var archivos_cargar = new Archivos(options);
            $this.Archivos = archivos_cargar;
            $this.Archivos.cargarArchivos();

            // this.cargar_archivos(); ///////////////////////
            $this.modelCaja.children[0].children[0].children[1].receiveShadow = true;
            $this.CAJAS_ARRAY = $this.modelCaja.children[0].children[0].children[0].children;
            $this.cajax = $this.modelCaja.children[0].children[0].children[2];
        } ,this.progreso_descarga);
    
        this.renderer = new THREE.WebGLRenderer({antialias: true});
        this.renderer.setPixelRatio(window.devicePixelRatio);
    
        var ww = window.innerWidth;//*0.6;
        var hh = window.innerHeight;//*0.6;
        this.renderer.setSize(ww, hh);
        this.renderer.gammaOutput = true;
        this.renderer.gammaFactor = 2;
        this.renderer.shadowMap.enabled = true;
        container.appendChild(this.renderer.domElement);
    }
    INICIO_ANIMACION_CUY_PORTADA(){
        this.ANIMACION_CUY_PORTADA = true;
        this.ANIMACION_CUY = false;
    
        this.ocultar_cuy_cargando();
        $.LoadingOverlay("hide");
        this.t = 0;  
        this.timerotacion = 0; 
        this.detener_var_animarcamara();
        this.ocultar_cuy_esperando();
        this.animar_camara();
    
        this.mostrar_cuymoviendo();
        // camara_mirar(modelCajaP);
        if(typeof this.a != "undefined"){
            this.ULTIMO_PUNTO_CUY = this.a;
        }
        //reiniciar_cuy();///reiniciar posicion cuyes 0 0 0
        this.actualizar_cuyes_posicion();
        
        this.detener_var_cajagirando();
        this.iniciar_animacion_cuy_portada();
    }
    progreso_descarga = function( xhr ) {
        if ( xhr.lengthComputable ) {
            var falta = xhr.total - xhr.loaded;
            var cargado_estavuelta = xhr.loaded - this.cargado;
            this.sumatoria_descargado = this.sumatoria_descargado + cargado_estavuelta;
            this.cargado = xhr.loaded;
            if(falta === 0){
                this.cargado = 0;
            }
            var percentCompletadoTotal = this.sumatoria_descargado / this.tamano_total * 100;
            if($("#cargador_overlay").length > 0){
                $("#cargador_overlay").text(Math.round( percentCompletadoTotal,2)+"%")
            }
        }
    }


    /**/
    responsive_canvas() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        this.renderer.render(this.scene,this.camera);
     }
    detener_var_animarcamara(){
        TWEEN.removeAll();
        if(typeof this.var_animarcamara != "undefined"){
             cancelAnimationFrame(this.var_animarcamara);
             delete this.var_animarcamara;
        }
    }
    ocultar_cuy_esperando(){
        $("#DIV_ESPERA").addClass("SIN_ANIMACION").hide();
    }

    animar_camara() {
        TWEEN.update();
        this.var_animarcamara = requestAnimationFrame(this.animar_camara);
        this.renderer.render(this.scene, this.camera);
        if(typeof this.controls != "undefined"){
            this.controls.update();
        }
    }
    mostrar_cuymoviendo(){
        this.model.visible = true; 
        this.modelCajaP.visible = false;
        this.modelCuyDudando.visible = false;       
        this.modelCuyChoque.visible = false;
    }
    actualizar_cuyes_posicion(){
        this.modelCuyDudando.position.x = this.model.position.x;
        this.modelCuyDudando.position.y = this.model.position.y;
        this.modelCuyDudando.position.z = this.model.position.z;
        this.modelCuyChoque.position.x = this.model.position.x;
        this.modelCuyChoque.position.y = this.model.position.y;
        this.modelCuyChoque.position.z = this.model.position.z;
    }
    detener_var_cajagirando(){
        if(typeof this.var_cajagirando != "undefined"){
             cancelAnimationFrame(this.var_cajagirando);
             delete this.var_cajagirando;
        }
    }
    iniciar_animacion_cuy_portada(){
        this.mixer.update(this.clock.getDelta());
        this.mixerCuyDudando.update(this.clockCuyDudando.getDelta());
        this.mixerCajaP.update(this.clockCajaP.getDelta());
        this.detener_var_cajagirando();
        this.mostrar_cuymoviendo();
        this.cajax = this.getObjeto_caja("x");
        this.maderas = [];
        this.maderas.push(this.getObjeto_caja("madera"));
        this.maderas.push(this.getObjeto_caja("madera2"));
        this.posicionycajaxinicial = -9.8808069229126  ;//9.932283401;//-6.86645478253922e-7;//-993.228455;///  z=>  -993.228455
        this.posicionfinalcaja = -11.4;//8.2;//3.4999993133545217//800;
        this.cajax_posicioninicial = new THREE.Vector3() ; 
        this.cajax.getWorldPosition(this.cajax_posicioninicial);
        this.posicionmadera = new THREE.Vector3() ; 
        this.getObjeto_caja("madera").getWorldPosition(this.posicionmadera);
        this.dtcajax = 0.2;
        this.tcajax = 0;
        this.rotacionx_inicio = 0;//-7.318557638911297e-33;
        this.rotacionx_fin = -Math.PI / 2;//-1.4;
        this.q1_cajax = new THREE.Quaternion().copy(this.cajax.quaternion);
        this.q2_cajax = new THREE.Quaternion().copy(this.cajax.quaternion);
        this.timerotacion = 0;
        if(typeof this.controls != "undefined"){
            this.controls.autoRotate = false;
        }
        this.inicio_tiempo = performance.now();
        this.inicio = 
        {
            x:this.model.position.x,
            y:this.model.position.y,
            z:this.model.position.z
        };
        this.spline = new THREE.CatmullRomCurve3(this.puntos_azar_inicio(this.inicio));
        this.dtSPLINE = 0.0015;
        this.correr_spline_portada(this.inicio);
        // camara_movimiento_inicio({x:0,y:10.3,z:0},camera,2500);
        // iniciar_cuy(GANADOR_DE_EVENTO,TIEMPO_CUY);
    }
    correr_spline_portada(){
        if(this.ANIMACION_CUY){
            this.t = 1;
            this.detener_var_correr_spline_portada();
        }
        this.model.visible=true;
        this.modelCuyChoque.visible=false;
        this.var_correr_spline_portada = requestAnimationFrame(this.correr_spline_portada);
        var tangent;
        var pt = this.spline.getPoint( this.t );
        this.model.position.set( pt.x, pt.y, pt.z );
        tangent = this.spline.getTangent( this.t ).normalize();
        this.mixer.update(this.clock.getDelta())
        this.axis.crossVectors(this.up, tangent).normalize();
        var radians = Math.acos( this.up.dot( tangent ) );
        this.model.quaternion.setFromAxisAngle( this.axis, radians );
        this.t = this.t + this.dtSPLINE;
        if(this.t >= 1){
            // model.position.copy(posicion_fin_caja);
            this.t = 0;
            cancelAnimationFrame(this.var_correr_spline_portada) ;
                // console.info("FIN SPLINE");
            this.CUY_CORRIENDO = false;
            this.model.visible = true;
            if(!this.ANIMACION_CUY)
            {
                this.inicio = 
                    {
                        x:model.position.x,
                        y:model.position.y,
                        z:model.position.z
                    };
                this.spline = new THREE.CatmullRomCurve3(this.puntos_azar_inicio(this.inicio));
                this.correr_spline_portada();
            }
            fin_tiempof = performance.now();
            milisegundosf = (fin_tiempof - this.inicio_tiempo);
            console.info("TIEMPO FINAL spLine=> segundos: " +parseFloat(milisegundosf/1000).toFixed(2)+" ,  milliseconds : "+ milisegundosf );
        }
    }

    mostrar_div_eventoesperando(){
        $("#DIV_ESPERANDOEVENTO").removeClass("SIN_ANIMACION").fadeIn();//show();
    }
    puntos_azar_inicio(inicio){
        var arrayvector = [];
        arrayvector.push(new THREE.Vector3(inicio.x,0,inicio.z));
        for(var a=0; a < 10; a++ ){
            var nuevo = this.generar_nueva_posicion_random2(2.35);
            arrayvector.push(new THREE.Vector3(nuevo.x,0,nuevo.z))
        }
        return arrayvector;
    }
    generar_nueva_posicion_random2(rango){
        var randomx = Math.random() >= 0.5 ? Math.abs(parseFloat(this.random_posicion(0, rango))) : -Math.abs(parseFloat(this.random_posicion(0,rango))) ;  // rango x=> -2.5  a   2.5 
        var randomz = Math.random() >= 0.5 ? Math.abs(parseFloat(this.random_posicion(0, rango))) : -Math.abs(parseFloat(this.random_posicion(0, rango))); // rango z=> -2.5  a   2.5
        var b = { x: randomx, y: 0, z: randomz  };
        return b;
    }
    random_posicion(min, max) {
        return ((Math.random() * (max - min)) + min).toFixed(2);
    }
    detener_var_correr_spline_portada(){
        if(typeof this.var_correr_spline_portada != "undefined"){
             cancelAnimationFrame(this.var_correr_spline_portada);
             delete this.var_correr_spline_portada;
        }
    }
    /** */
    CargarEstadistica(IdJuego) {    
        var url = document.location.origin + "/" + "api/DataEventoResultadoEventoFk";
        $.ajax({
            url: url,
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify({IdJuego: IdJuego}),
            beforeSend: function() {
                this.CONSULTADO_EVENTO = true;
            },
            complete: function() {
            },
            success: function(response) { 
                this.CONSULTADO_EVENTO = false;
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
                this.ocultar_cuy_cargando();
                $.LoadingOverlay("hide");
                ocultar_toasr_nohay_evento();
                ocultar_toasr_servidor_error()
            },
            error: function(jqXHR, textStatus, errorThrown) {
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
    ocultar_cuy_cargando(){
        $("#DIV_CARGANDO").hide();
    }
    detener_timeout_conexionwebsockets(){
        if(typeof revisar_ya_conecto != "undefined"){
            clearInterval(revisar_ya_conecto);
            revisar_ya_conecto = null;
        } 
    }
    
    crear_toastr_websockets_error(){
        if(this.ANIMACION_CUY == false){
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
    
    ocultar_toasr_websockets_error(){ 
         if(typeof toasr_websockets_error!="undefined"){
            toasr_websockets_error.hide();
        }
    }
    crear_toasr_nohay_evento(){
        if(typeof this.toasr_nohay_evento =="undefined"){
            toastr.options = {
                timeOut: 0,
                extendedTimeOut: 0,
                tapToDismiss: false
            };
            this.toasr_nohay_evento = toastr.error("No hay Evento Activo...");
        }
        else{
            this.toasr_nohay_evento.show()
        }
    }
    
    crear_toasr_servidor_error(){
        if(typeof this.toasr_servidor_error == "undefined"){
            toastr.options = {
                timeOut: 0,
                extendedTimeOut: 0,
                tapToDismiss: false
            };
            this.toasr_servidor_error = toastr.error("Error Servidor...");
        }
        else{
            this.toasr_servidor_error.show()
        }
    }
    ocultar_toasr_nohay_evento(){
        if(typeof this.toasr_nohay_evento != "undefined"){
            this.toasr_nohay_evento.hide();
        }
    }
    ocultar_toasr_servidor_error(){ 
        if(typeof this.toasr_servidor_error != "undefined"){
            this.toasr_servidor_error.hide();
        }
    }
    
    iniciar_websocketservidor(){
        ocultar_cuy_cargando();
        $.LoadingOverlay("hide");
        ocultar_toasr_nohay_evento();
        ocultar_toasr_servidor_error()
        if(socket != null && socket.readyState == 1){
            if(socket.readyState==0){
                console.info("socket.readyState==0");
            }
            inicio_pedir_hora = performance.now();
            pedir_hora = true;
            timeout_pedir_hora = setInterval(function(){
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
            revisar_ya_conecto = setInterval(function(){
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
    
    calcular_estadisticas(array_estadisticas){
        var estadistica=array_estadisticas;
        $.each(estadistica, function( key, value ) {
            $("#"+value.valorapuesta).text(value.Repetidos);
            $("#"+value.valorapuesta).prev().css("background-color",value.rgb)
            $("#"+value.valorapuesta).attr("data-color",value.rgb)
            $("#"+value.valorapuesta).data("color",value.rgb)
            $("#"+value.valorapuesta).prev().css("color",value.rgbLetra)
        });
    
        rgb1 = $("#color1").attr("data-color")
        rgb2 = $("#color2").attr("data-color")
        rgb3 = $("#cajaB").attr("data-color")
        rango1_12 = 0
        rango13_24 = 0
        rango25_36 = 0
        color1 = 0
        color2 = 0;
        color3 = 0;
    
        $(estadistica).each(function(i,e){
            valor = parseInt(e.valorapuesta)
            repetidos = parseInt(e.Repetidos);
            color = e.rgb;
    
            if(valor > 0 && valor <= 12){
                rango1_12=rango1_12+repetidos;
            }
            if(valor > 12 && valor <= 24){
                rango13_24=rango13_24+repetidos;
            }
            if(valor > 24 && valor <= 36){
                rango25_36=rango25_36+repetidos;
            }
            if(valor==0){
                color0 = repetidos;
            }
            if(color==rgb1){
                color1 = color1+repetidos;
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
        mayores = [];
        menores = [];
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
}
export { Cuy }





