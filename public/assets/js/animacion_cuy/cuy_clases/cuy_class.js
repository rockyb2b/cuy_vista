import { Archivos } from './archivos_class.js';
import { CuyMovement } from './cuymovement_class.js';

const IPSERVIDOR_WEBSOCKETS = "1";//$("#IPSERVIDOR_WEBSOCKETS").val();
const PUERTO_WEBSOCKETS=$("#PUERTO_WEBSOCKETS").val();
const TIMEOUT_CONEXIONWEBSOCKETS_CORTAR = 5000;
const CONTROLES = false;
var EVENTO_YA_PASO = false;
$(document).ready(function () {
    // bloquear_teclas_mouse();
    // INICIAR_RENDER();
});
if (WEBGL.isWebGLAvailable() === false) {
    document.body.appendChild(WEBGL.getWebGLErrorMessage());
}

class Cuy {
    constructor(options) {
        this.TIEMPO_CARGA_ARCHIVOS ;/// fin tiempo CARGA de archivos
        this.container ;
        this.scene ;
        this.cajax;
        this.renderer;
        this.camera;
        this.stat;

        this.model ;//CUY CAMINANDO
        this.modelCajaGirando;
        this.modelCuyDudando;
        this.modelChoque;
        this.modelCaja;
        this.modelCuyPremi;
        this.modelCuySalto;
        this.modelCuyEsperando;

        this.animation;
        this.skeleton;

        this.mixer;
        this.mixerCaja ;
        this.mixerCajaGirando ;
        this.mixerCuyDudando ;
        this.mixerCuyPremio ;
        this.mixerCuyEsperando ;
        this.mixerCuySalto;

        this.clock;
        this.clockCajaGirando;
        this.clockCuyDudando;
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
        this.ANIMACION_CUY_PORTADA = false;//cuy movement waiting for start event
        this.ANIMACION_CUY = false;//cuy movement for  event 
        this.TEXTO_NEON_PORTADA = "¿A donde va el cuy? ¡Realiza Tu Apuesta!";
        this.TEXTO_CONTADOR = "APUESTAS SE CIERRAN EN";
        this.TEXTO_ESPERAR_TERMINO_EVENTO = "EVENTO TERMINA EN";

        this.var_animarcamara;
        this.var_cuymoviendo;
        this.var_cajagirando;
        this.var_correr_spline_portada;
        this.var_correr;
        this.var_cuydudando;
        this.var_cuychoque;
        this.var_cuy_rotando;

        this.a;
        this.ULTIMO_PUNTO_CUY;

        // this.posicionycajaxinicial;
        // this.posicionfinalcaja;

        this.t;
        this.t_portada;
        this.timerotacion;
        this.t_spline_ganador;
        // this.cajax_posicioninicial;
        this.posicionmadera;

        this.dtcajax = 0.2;
        this.tcajax = 0;
        this.rotacionx_inicio = 0;
        this.rotacionx_fin = -Math.PI / 2;
        // this.q1_cajax ;
        // this.q2_cajax ;

        this.inicio;
        this.inicio_tiempo;
        this.spline;

        this.toast_eventoterminar;
        this.toastr_eventofinalizo;

        this.otro;

        this.up = new THREE.Vector3(0,0,1 );
        this.axis = new THREE.Vector3( );

        this.camara_iniciogiro;

        this.mover_a_ganador;

        this.animacion;
        this.aumento;

        this.q1;
        this.q2;

        this.callback_rotacion;

        this.CUY_CORRIENDO;

        this.bfuncion_easing_indice;

        this.posicionmodel;
        this.radians;
        this.tangent;
        ///activar CUY
        this.TIEMPO_GIRO_CAJA = 3000;
        this.TIEMPO_ESPERA_CASAGANADOR = 1000; ///tiempo espera luego q cuy entra en casa
        this.TIEMPO_GANADOR_PORTADA = 10000;

    }
    accion_cuy2(evento_valor_ganador = 15,seg_barra_loading = 2 ,seg_para_finevento = 10) {
        this.t = 0;
        this.EVENTO_ID = 1
        this.GANADOR_DE_EVENTO =evento_valor_ganador
        $("#evento_actual_portada").text("#" + this.EVENTO_ID);
    
        this.TIEMPO_CUY = (20 * 1000) - this.TIEMPO_GIRO_CAJA; //EVENTO_ACTUAL.tiempo_cuy_moviendo;
        this.TIEMPO_CUY_CHOQUE = 5000;///tiempo espera cuy en estado de choque
       
        this.PUNTOS_CUY = this.generarPosicionesRandom();
    
        var id_evento = 1;
        var ganador_evento = evento_valor_ganador;
        var fecha_fin = '2023-09-26 11:50';
        var fecha_fin_ev = moment(fecha_fin, "YYYY-MM-DD HH:mm:ss a");
        // if (ANIMACION_CUY_PORTADA == false) {
        //     INICIO_ANIMACION_CUY_PORTADA(); /*CUY PORTADA*/ ;
        // }
        if (seg_barra_loading > 0) { ///EN rango animacion
            setTimeout(() => {
                const self = this;
                ///barra carga cuy
                this.mostrar_div_eventoesperando();
                $("#barra_loading_tpi").animate({
                    height: "0%"
                }, (seg_barra_loading) * 1000, function() {
                    setTimeout(()=>{
                        if(typeof $("#termotetro_para_iniciar").data("illuminate") != "undefined"){
                            $("#termotetro_para_iniciar").data("illuminate").destruir();
                        }
                        self.callback_animacion(id_evento);
                    },1000)
                    ;
                });
                this.actualizar_contador_texto_latido(seg_barra_loading,this.TEXTO_CONTADOR);
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
                    timeout_eventofinalizo = setTimeout(() => {
                        this.toastr_eventofinalizo.hide();
                        clearTimeout(timeout_eventofinalizo);
                    //   delete timeout_eventofinalizo;
                        iniciar_websocketservidor();
                    }, 4000)
                }
            } ///else segundos_para_fin_evento >0
      } //fin else
    } ///fin accion cuy2

    jugar_cuy(evento_valor_ganador = 15,seg_barra_loading = 2 ,seg_para_finevento = 10) {
        this.EVENTO_ID = 1
        this.GANADOR_DE_EVENTO = evento_valor_ganador
        $("#evento_actual_portada").text("#" + this.EVENTO_ID);
    
        this.TIEMPO_CUY = (20 * 1000) - this.TIEMPO_GIRO_CAJA; //EVENTO_ACTUAL.tiempo_cuy_moviendo;
        this.TIEMPO_CUY_CHOQUE = 5000;///tiempo espera cuy en estado de choque
       
        this.PUNTOS_CUY = this.generarPosicionesRandom();
    
        var id_evento = 1;
        var fecha_fin = '2023-09-26 11:50';
        var fecha_fin_ev = moment(fecha_fin, "YYYY-MM-DD HH:mm:ss a");
        // if (ANIMACION_CUY_PORTADA == false) {
        //     INICIO_ANIMACION_CUY_PORTADA(); /*CUY PORTADA*/ ;
        // }
        if (seg_barra_loading > 0) { ///EN rango animacion
            setTimeout(() => {
                const self = this;
                ///barra carga cuy
                this.mostrar_div_eventoesperando();
                $("#barra_loading_tpi").animate({
                    height: "0%"
                }, (seg_barra_loading) * 1000, function() {
                    setTimeout(()=>{
                        if(typeof $("#termotetro_para_iniciar").data("illuminate") != "undefined"){
                            $("#termotetro_para_iniciar").data("illuminate").destruir();
                        }
                        self.callback_animacion(id_evento);
                    },1000)
                    ;
                });
                this.actualizar_contador_texto_latido(seg_barra_loading,this.TEXTO_CONTADOR);
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
                    this.callback_esperar_termino_evento(this.GANADOR_DE_EVENTO);
                });
                this.actualizar_contador_texto(seg_para_finevento , this.TEXTO_ESPERAR_TERMINO_EVENTO);
            } 
            else 
            {
                this.toastr_eventofinalizo = toastr.info(" Evento actual ya finalizó")
                if (typeof timeout_eventofinalizo != "undefined") {
                    //clearTimeout(timeout_eventofinalizo);
                } else {
                    timeout_eventofinalizo = setTimeout(() => {
                        this.toastr_eventofinalizo.hide();
                        clearTimeout(timeout_eventofinalizo);
                    //   delete timeout_eventofinalizo;
                        iniciar_websocketservidor();
                    }, 4000)
                }
            } ///else segundos_para_fin_evento >0
      } //fin else
    } ///fin accion cuy2
    callback_animacion(EVENTO_ID){
        this.detener_var_correr_spline_portada();
        this.ocultar_termometro_contador();
        this.ocultar_div_eventoesperando(
                ()=>{
                    this.actualizar_evento_titulo(EVENTO_ID);
                    this.buscando_evento = false;
                    this.INICIO_ANIMACION_CUY(); ////////////////////////////////////////
                }
            );
    }

    actualizar_contador_texto_latido(tiempo_en_segundos,texto){
        $("#contador_para_activar").text(texto + " " + tiempo_en_segundos +" seg.");
        var conta = tiempo_en_segundos - 1;
       // $("#termotetro_para_iniciar").removeClass("latido_animacion_2");
        this.conteo_ = setInterval(function() {
            $("#contador_para_activar").text(texto + " " + conta +" seg. ");
            if (conta < 1) {
             // $("#termotetro_para_iniciar").removeClass("latido_animacion_2");
                clearInterval(this.conteo_);
            }else if(conta < 11)
            {
                var efecto_brillo = $('#termotetro_para_iniciar')
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
    ocultar_termometro_contador(){
        $("#barra_loading_tpi").stop().stop();
        if(typeof this.conteo_ != "undefined"){
            clearInterval(this.conteo_);
            delete this.conteo_;
        }
    }
    ocultar_div_eventoesperando(callback){
        $("#DIV_ESPERANDOEVENTO").addClass("SIN_ANIMACION").fadeOut('500',function(){callback()});
    }
    actualizar_evento_titulo(EVENTO_ID){
        $("#idevento_titulo").css("font-size", "7vh")
        $("#idevento_titulo").html('<div style="font-size: 5vh">#</div>' + EVENTO_ID);
        this.mostrar_div_tituloevento();
    }
    INICIO_ANIMACION_CUY(){
        this.mixer.update(this.clock.getDelta());
        this.mixerCuyDudando.update(this.clockCuyDudando.getDelta());
        this.mixerCajaGirando.update(this.clockCajaGirando.getDelta());
        this.ANIMACION_CUY = true;
        // iniciogiro =  clockCajaP.getElapsedTime();
        this.t = 0   /// tiempo movimiento cuy;
        this.t_portada = 1;
        this.timerotacion = 0; 
        this.ocultar_cuy_esperando();
        this.detener_var_animarcamara();
        this.animar_camara();
    
        var objeto = this.modelCajaGirando;    
        const X = objeto.position.x ;
        const Y = objeto.position.y + 1.6;
        const Z = objeto.position.z + 5.5;
        this.mostrar_cajagirando();
        this.camara_movimiento_girando(
            {   
                x:X,
                y:Y,
                z:Z
            },
            this.camera,
            2000,
            () => {
                this.camara_iniciogiro =  performance.now();
                this.camara_mirar(this.modelCajaGirando);
                if(typeof this.a != "undefined"){
                    this.ULTIMO_PUNTO_CUY = this.a;
                }
                this.reiniciar_cuy();///reiniciar posicion cuyes 0 0 0
                this.actualizar_cuyes_posicion();
                if(typeof this.controls != "undefined"){
                }
                this.detener_var_cajagirando();
                this.modelCajaGirando.visible = true;
                this.cajagirando_animacion();
            }
        );
    }
    mostrar_div_tituloevento(){
        $("#DIV_TITULOEVENTO").removeClass("SIN_ANIMACION").fadeIn('1000');
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
                objetoretornar = e;
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
    pantalla_loader()
    {
        $.LoadingOverlay("show");
        $(".loadingoverlay").append($('<div id="cargador_overlay" style="font-family:Arial;position: relative; left: 0%;top:2%;width:7%;height: 10%; text-align:center;font-size:4vw;color:black">--</div>'))
        $(".loadingoverlay").css("background-color","rgba(255, 255, 255, 0.3)");
        $("#DIV_EVENTOESPERANDO").hide();
        $("#DIV_TITULOEVENTO").hide();
    }
    INICIAR_RENDER() {
        this.pantalla_loader();
        this.container = document.getElementById('DIV_CANVAS');
        this.clock = new THREE.Clock();
        this.clockCuyDudando = new THREE.Clock();
        this.clockCajaGirando = new THREE.Clock();
        this.clockCuyChoque = new THREE.Clock();
        this.clockCuyPremio = new THREE.Clock();
        this.clockCuyEsperando = new THREE.Clock();
        this.clockCuySalto= new THREE.Clock();
        this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 100);
        this.camera.position.set(0, 10, 0);
        // //controls
        if(this.CONTROLES){
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

        var camerashadow = 5;
        var dirLight = new THREE.DirectionalLight(0xffffff);
        dirLight.position.set(-3, 20, -15);
        dirLight.castShadow = true;
        dirLight.shadow.camera.top = camerashadow;
        dirLight.shadow.camera.bottom = -camerashadow;
        dirLight.shadow.camera.left = -camerashadow;
        dirLight.shadow.camera.right = camerashadow;
        dirLight.shadow.camera.near = 0.1;
        dirLight.shadow.camera.far = 40;
        dirLight.position.y = 34;
    
        dirLight.shadow.mapSize.height = 2048;
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
        this.CAJAS_ARRAY = [];
        const tiempo_inicio_archivos = performance.now();
        
        const $this = this;//$this =>  clase
        
        var loaderCaja = new THREE.GLTFLoader();
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
                    $this.TIEMPO_CARGA_ARCHIVOS = performance.now() - tiempo_inicio_archivos;
                    $this.TIEMPO_CARGA_ARCHIVOS = ($this.TIEMPO_CARGA_ARCHIVOS/1000).toFixed(2);
                    console.warn("FIN CARGA ARCHIVOS en " + $this.TIEMPO_CARGA_ARCHIVOS + " seg");
                    $("#JUEGO").show();
                    if ($this.ANIMACION_CUY_PORTADA == false) {
                        $this.INICIO_ANIMACION_CUY_PORTADA(); /*CUY PORTADA*/ ;
                    }
                    //iniciar_websocketservidor();
                    window.addEventListener('resize', $this.responsive_canvas.bind($this), false);
                    return;
                },
                cuy: $this
            };
            var archivos_cargar = new Archivos(options);
            $this.Archivos = archivos_cargar;
            $this.Archivos.cargarArchivos();

            $this.modelCaja.children[0].children[0].children[1].receiveShadow = true;
            $this.CAJAS_ARRAY = $this.modelCaja.children[0].children[0].children[0].children;
            $this.cajax = $this.modelCaja.children[0].children[0].children[2];
        } ,this.progreso_descarga.bind(this));
    
        this.renderer = new THREE.WebGLRenderer({antialias: true});
        this.renderer.setPixelRatio(window.devicePixelRatio);
    
        var ww = window.innerWidth;//*0.6;
        var hh = window.innerHeight;//*0.6;
        this.renderer.setSize(ww, hh);
        this.renderer.gammaOutput = true;
        this.renderer.gammaFactor = 2;
        this.renderer.shadowMap.enabled = true;
        this.container.appendChild(this.renderer.domElement);
    }
    INICIO_ANIMACION_CUY_PORTADA(){
        this.ANIMACION_CUY_PORTADA = true;
        this.ANIMACION_CUY = false;
    
        this.ocultar_cuy_cargando();
        $.LoadingOverlay("hide");
        this.t = 0;
        this.t_portada = 0;
        this.timerotacion = 0; 
        this.detener_var_animarcamara();
        this.ocultar_cuy_esperando();
        this.animar_camara(this);
    
        this.mostrar_cuymoviendo();
        // camara_mirar(modelCajaGirando);
        if(typeof this.a != "undefined"){
            this.ULTIMO_PUNTO_CUY = this.a;
        }
        //reiniciar_cuy();///reiniciar posicion cuyes 0 0 0
        this.actualizar_cuyes_posicion();
        
        this.detener_var_cajagirando();
        this.iniciar_animacion_cuy_portada();
    }

    iniciar_animacion_cuy_portada(){//cuy movement en portada 
        this.mostrar_cuymoviendo();

        this.mixer.update(this.clock.getDelta());
        this.mixerCuyDudando.update(this.clockCuyDudando.getDelta());
        this.mixerCajaGirando.update(this.clockCajaGirando.getDelta());

        this.cajax = this.getObjeto_caja("x");

        this.maderas = [];
        this.maderas.push(this.getObjeto_caja("madera"));
        this.maderas.push(this.getObjeto_caja("madera2"));
                
        this.posicionmadera = new THREE.Vector3() ; 
        this.getObjeto_caja("madera").getWorldPosition(this.posicionmadera);
        
        this.timerotacion = 0;
        if(typeof this.controls != "undefined"){
            this.controls.autoRotate = false;
        }
        this.inicio_tiempo = performance.now();
        this.inicio = 
        {
            x : this.model.position.x,
            y : this.model.position.y,
            z : this.model.position.z
        };
        this.spline = new THREE.CatmullRomCurve3(this.puntos_azar_inicio(this.inicio));
        this.dtSPLINE = 0.0015;
        // this.correr_spline_portada(this.inicio);
        // this.correr_spline_portada();

        // var inicio = 
        // {
        //     x : this.cuy.model.position.x,
        //     y : this.cuy.model.position.y,
        //     z : this.cuy.model.position.z
        // };
        // this.spline = new THREE.CatmullRomCurve3(this.puntos_azar_inicio(inicio));

        var callback = function()
        {
            // var cuymovement_class = this;
            // cuymovement_class.detener_animacion_correr_cuy();
            // // cuymovement_class.cuydudando();
            // // setTimeout(function(){
            //     // cuymovement_class.detener_animacion_cuydudando();
            // cuymovement_class.t = 0;
            // var posicion_actual = 
            //     {
            //         x : cuymovement_class.cuy.model.position.x,
            //         y : cuymovement_class.cuy.model.position.y,
            //         z : cuymovement_class.cuy.model.position.z
            //     };
            // console.log(posicion_actual);
            // cuymovement_class.callback = function(){
                
            // };
            // cuymovement_class.spline = new THREE.CatmullRomCurve3(cuymovement_class.puntos_azar(posicion_actual));
            // cuymovement_class.animacion_correr_cuy = null;
            // cuymovement_class.correr_cuyNEW();
            // },2000)
        }
        const fps = 30;
        var fpsInterval = 1000 / fps;
        var cuymov = new CuyMovement({cuy : this ,fpsInterval : fpsInterval,  t : 0  , callback : callback});
        this.animation = cuymov; 
        // cuymov.correr_cuy();
        cuymov.correr_cuy_indefinido();
        // cuymov.correr_cuyganador();
        
        // camara_movimiento_inicio({x:0,y:10.3,z:0},camera,2500);
        // iniciar_cuy(GANADOR_DE_EVENTO,TIEMPO_CUY);
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
    animar_camara() {
        TWEEN.update();
        this.var_animarcamara = requestAnimationFrame(this.animar_camara.bind(this));
        this.renderer.render(this.scene, this.camera);
        if(typeof this.controls != "undefined"){
            this.controls.update();
        }
    }

    ocultar_cuy_esperando(){
        $("#DIV_ESPERA").addClass("SIN_ANIMACION").hide();
    }
    mostrar_cuymoviendo(){
        this.model.visible = true;

        this.modelCajaGirando.visible = false;
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
    
    correr_spline_portada(){
        if(this.ANIMACION_CUY){
            this.t_portada = 1;
            this.detener_var_correr_spline_portada();
        }
        // this.model.visible = true;
        this.modelCuyChoque.visible = false;
        this.var_correr_spline_portada = requestAnimationFrame(this.correr_spline_portada.bind(this));// Keep the context of 'this'
        
        var pt = this.spline.getPoint( this.t_portada );
        this.model.position.set( pt.x, pt.y, pt.z );
        var tangent = this.spline.getTangent( this.t_portada ).normalize();
        this.mixer.update(this.clock.getDelta())
        this.axis.crossVectors(this.up, tangent).normalize();
        this.radians = Math.acos( this.up.dot( tangent ) );
        this.model.quaternion.setFromAxisAngle( this.axis, this.radians );
        this.t_portada = this.t_portada + this.dtSPLINE;
        if(this.t_portada >= 1){
            // model.position.copy(posicion_fin_caja);
            this.t_portada = 0;
            cancelAnimationFrame(this.var_correr_spline_portada) ;
                // console.info("FIN SPLINE");
            this.CUY_CORRIENDO = false;
            this.model.visible = true;
            if(!this.ANIMACION_CUY)
            {
                this.inicio = 
                    {
                        x : this.model.position.x,
                        y : this.model.position.y,
                        z : this.model.position.z
                    };
                this.spline = new THREE.CatmullRomCurve3(this.puntos_azar_inicio(this.inicio));
                this.correr_spline_portada();
            }
            var fin_tiempof = performance.now();
            var milisegundosf = (fin_tiempof - this.inicio_tiempo);
            console.info("TIEMPO FINAL spLine=> segundos: " +parseFloat(milisegundosf/1000).toFixed(2)+" ,  milliseconds : "+ milisegundosf );
        }
    }
    camara_movimiento_inicio(hacia,camera,tiempo, callback){
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
        var self = this;
        var tween = new TWEEN.Tween(from)
            .to(to, tiempo)
            .easing(TWEEN.Easing.Linear.None)
            .onUpdate(function () {
            self.camera.position.set(this.x, this.y, this.z);
            self.camera.lookAt(new THREE.Vector3(0, 0, 0));
        })
            .onStart(function(){
                //  camera.position.x=to.x;camera.position.z=to.z;camera.position.y=to.y
            })
            .onComplete(function () {
                self.detener_var_animarcamara();
                self.camera.lookAt(new THREE.Vector3(0, 0, 0));
        })
            .start();
    }
    camara_movimiento_girando(hacia,camera,tiempo, callback){/*animation camara hasta inicio d giro */
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
    camara_mirar(objeto){
        this.camera.position.x = objeto.position.x ;
        this.camera.position.y = objeto.position.y + 1.6;
        this.camera.position.z = objeto.position.z + 5.5;
        this.camera.lookAt(objeto.position);
    }
    reiniciar_cuy(){
        this.model.position.set(0,0,0);
        this.modelCuyDudando.position.set(0,0,0);
        this.modelCuyChoque.position.set(0,0,0);

        this.a = {
            x : this.model.position.x,
            y : this.model.position.y,
            z : this.model.position.z
        }

        this.clock = new THREE.Clock();
        this.clockCuyDudando = new THREE.Clock();
        this.clockCuyChoque = new THREE.Clock();
        this.clockCajaGirando = new THREE.Clock();
        this.t = 0;
        $("#barra_loading_tpi").css("height","100%");
        // $("#barra_loading_tpi").css("width","0%");
        //PUNTOS_CUY = null;
        //INDICE_PUNTOS_CUY = 0;
    }
    cajagirando_animacion() {
        this.var_cajagirando = requestAnimationFrame(this.cajagirando_animacion.bind(this));

        this.mixer.update(this.clock.getDelta());
        this.mixerCuyDudando.update(this.clockCuyDudando.getDelta());
        this.mixerCajaGirando.update(this.clockCajaGirando.getDelta());
        
        this.mostrar_cajagirando();
        var tiempogirando = performance.now() - this.camara_iniciogiro;
        this.renderer.render(this.scene, this.camera);
        if(tiempogirando/1000 <= (this.TIEMPO_GIRO_CAJA/1000) ){
        }
        else
        {
            console.info(" tiempo giro = " + tiempogirando);
            this.puntootro = this.getPositionOtroVector(this.GANADOR_DE_EVENTO,this.otro);///punto antes de caja centro
            this.actualizar_div_ganador(this.GANADOR_DE_EVENTO);
            // spline = new THREE.SplineCurve3(puntos_azar());
            // detener_var_animarcamara();
            this.detener_var_cajagirando();
            this.mostrar_cuymoviendo();
        
            this.cajax = this.getObjeto_caja("x");
            this.maderas = [];
            this.maderas.push(this.getObjeto_caja("madera"));
            this.maderas.push(this.getObjeto_caja("madera2"));            
    
            this.posicionmadera = new THREE.Vector3() ; 
            this.getObjeto_caja("madera").getWorldPosition(this.posicionmadera);
                
            this.timerotacion = 0;
    
            if(typeof this.controls!="undefined"){
                this.controls.autoRotate = false;
            }
            this.camara_movimiento_inicio(
                {
                    x : 0,
                    y : 10.3,
                    z : 0
                }
                ,this.camera
                ,2500
            );
            this.iniciar_cuy(this.GANADOR_DE_EVENTO , this.TIEMPO_CUY);
        }
    }

    iniciar_cuy(ganador,TIEMPO_RANDOM) {
        var posicion_ganador = this.get_caja(ganador).posicion;///  ganador
        const i = 0;
        this.TIEMPO_RANDOM = TIEMPO_RANDOM;
        this.TIEMPO_RANDOM = TIEMPO_RANDOM - 2000; ///2000 tiempo para ultimo movimiento , hacia ganador
    
        this.CUY_ROTANDO = false;
        this.CUY_CORRIENDO = false;
        this.INDICE_PUNTOS_CUY = 0;
        this.iniciar_tiempo_random(this.TIEMPO_RANDOM); //////INICIO  CUY
    }

    iniciar_tiempo_random(tiempo) {
        this.TIEMPO_RANDOM = tiempo;
        this.inicio_tiempo = performance.now();
        this.mover_a_ganador = false;
    
        this.detener_var_cuydudando();
        this.cuydudando();
        setTimeout(() =>
        {
            this.detener_var_cuydudando();
            this.generar_nueva_posicion_random();
            this.random_tiempo();
        },3500);
    }
    random_tiempo(){
        if (typeof this.var_cuymoviendo === "undefined") {
            this.rotarono = this.b.rotarono;//Math.random() >= 0.5 ?true:false;
            this.t = 0;  ///coeficiente
            this.aumento = 0;
         
            this.mostrar_cuymoviendo();
            this.mixer.update(this.clock.getDelta());
            this.renderer.render(this.scene, this.camera);
            if(this.rotarono){
                this.q1 = new THREE.Quaternion().copy(this.model.quaternion);
                this.model.lookAt(
                    this.b.x,
                    this.b.y,
                    this.b.z
                );
                this.q2 = new THREE.Quaternion().copy(this.model.quaternion); 
                this.timerotacion = 0;
            }
            this.detener_animacion();///ant
            this.detener_var_cuymoviendo();
            this.detener_var_cuychoque();
            this.detener_var_cuydudando();
            this.detener_var_cuy_rotando();
    
            if(this.rotarono){
                this.callback_rotacion = function () { ///se ejecuta al acabar  cuy_rotacion();
                    this.detener_var_cuymoviendo();
                    this.CUY_CORRIENDO = true;
                    this.mover_cuyrandom();
                }
                this.CUY_ROTANDO = true;
                this.detener_var_cuy_rotando();
                this.cuy_rotacionrandom();
            }else{
                this.CUY_ROTANDO = false;
                this.model.lookAt(
                    this.b.x,
                    this.b.y,
                    this.b.z
                    );
                this.modelCuyDudando.lookAt(
                    this.b.x,
                    this.b.y,
                    this.b.z
                    );
                this.modelCuyChoque.lookAt(
                    this.b.x,
                    this.b.y,
                    this.b.z
                    );
                this.t = 0;
                var aver = this.CUY_CORRIENDO ? "true" : "false";
                  // console.warn("t else:::::  "+t +" "+b.x+" "+b.y+" "+b.z +"  cuycorriendo  = "+ aver);
                this.detener_var_cuymoviendo();
                this.detener_var_cuydudando();
                this.detener_var_cuychoque();
                this.CUY_CORRIENDO = true;
                this.mover_cuyrandom();
            }
        } 
        else 
        {
            cancelAnimationFrame(this.var_cuymoviendo);
        } 
    }
    mover_cuyrandom() {    ///var_cuymoviendo  => animationframe
        if (!this.CUY_CORRIENDO) {  return;}
        this.mostrar_cuymoviendo();
        // funcion_ease=EasingFunctions_array[0].funcion;//linear
        var funcion_ease = window.EasingFunctions_array[this.bfuncion_easing_indice].funcion;//usar random de generarrandompunto b
    
        var newX = this.lerp(this.a.x, this.b.x, funcion_ease(this.t));  
        var newY = this.lerp(this.a.y, this.b.y, funcion_ease(this.t));  
        var newZ = this.lerp(this.a.z, this.b.z, funcion_ease(this.t));  
        this.model.position.set( newX , 0 , newZ );
        //t += dt;
        this.t = parseFloat( this.t + this.dt).toFixed(5);
        this.t = parseFloat(this.t);
        //console.warn("x=> " + newX + "  y=>" + newY + "  z= " + newZ);
        this.mixer.update(this.clock.getDelta());
        this.renderer.render(this.scene, this.camera);
        this.var_cuymoviendo = requestAnimationFrame(this.mover_cuyrandom.bind(this));
        if(this.t >= 1)
        {
            // console.warn("LLEGÓ ccc");
            this.model.position.set(
                this.b.x,
                this.b.y,
                this.b.z)
            ; ///ajustar posición si no llegó exacto
            this.a = { 
                x: this.model.position.x,
                y: this.model.position.y,
                z: this.model.position.z 
            };   //////nueva posicion
            cancelAnimationFrame(this.var_cuymoviendo);
            this.detener_animacion();///ant
            this.detener_var_cuymoviendo();
            this.detener_var_cuy_rotando();
    
            this.actualizar_cuyes_posicion();
    
            var fin_tiempo = performance.now();
            var milisegundos = (fin_tiempo - this.inicio_tiempo);
          
            if (milisegundos > this.TIEMPO_RANDOM) {////tiempo de animacion cuy paso, ir a caja ganador posicion
                if(!this.mover_a_ganador){
                    this.mover_a_ganador = true;
                    // b = get_caja(GANADOR_DE_EVENTO).posicion;
                    if(this.GANADOR_DE_EVENTO == "x" || this.GANADOR_DE_EVENTO == "0"){
                        this.bfuncion_easing_indice = 7;//easeInQuart
                        console.log("X o O");
                        this.b = new THREE.Vector3();
                        this.getObjeto_caja("madera").getWorldPosition(b);
                        this.random_tiempo();
                    }
                    else
                    {
                        this.posicion_fin_caja = new THREE.Vector3();
                        this.getObjeto_caja(this.GANADOR_DE_EVENTO).getWorldPosition(this.posicion_fin_caja);
                        this.posicion_fin_caja.y = 0;

                        this.CUY_CORRIENDO = false;
                        var puntosspline = [];
                        this.posicionmodel = new THREE.Vector3();
                        this.model.getWorldPosition(this.posicionmodel);

                        this.puntootro.y = 0;
                        puntosspline.push(this.posicionmodel);
                        puntosspline.push(this.puntootro);
                        puntosspline.push(this.posicion_fin_caja);//ganador evento
                        // spline= new THREE.SplineCurve3(puntosspline);
                        this.spline =  new THREE.CatmullRomCurve3(puntosspline);
                        this.t_spline_ganador = 0;
                        this.dtSPLINE = 0.025;
                        var dist_spline = this.spline.getLength();
                        // console.info("dist_spline "+dist_spline);
                        if(dist_spline > 4){
                            this.dtSPLINE = 0.009;
                        }
                        console.log("INICIO SPLINE");
                        this.correr_spline();
                        console.log("FIN  SPLINE");

                    }
                }
                else 
                { //movera ganador true  => CUY EN POSICION DE CAJA, FINALIZAR ANIMACION
                    this.CUY_CORRIENDO = false;
                    if(this.model.position.x == this.posicionmadera.x && this.model.position.z == this.posicionmadera.z)
                    {
                        this.modelCuyChoque.position.y =-0.1;
                        this.cuychoque();
                        this.cajax_animacion();///caja x voltear
                    }
                    this.model.visible = false;
                    this.callback_ganador();
                    var fin_tiempof = performance.now();
                    var milisegundosf = (fin_tiempof - inicio_tiempo);
                    console.info("TIEMPO FINAL=> segundos: " +parseFloat(milisegundosf/1000).toFixed(2)+" ,  milliseconds : " + milisegundosf );
                   // delete funcion_callback;
                }
                console.info("fin");
                this.t = 1 ;
                this.t_portada  = 1 ;
            }///ms > tiempo
            else
            {
                var mostrar_cuydudando = this.b.mostrar_cuydudando;//Math.random()>=0.5?true:false;
                if(mostrar_cuydudando){
                    this.detener_var_cuydudando();
                    
                    this.cuydudando();
                    var tiempodudando = Math.random() * (10 - 1) + 1; 
                    setTimeout(() => {
                        this.generar_nueva_posicion_random();
                        this.random_tiempo();
                    },tiempodudando * 100);
                }
                else{
                    this.detener_var_cuydudando();
                    this.generar_nueva_posicion_random();
                    this.random_tiempo();
                }
            }  ///fin else ms >tiempo
        }  ///fin t>1
    }
    correr_spline(){
        this.var_correr = requestAnimationFrame(this.correr_spline.bind(this));
        this.pt = this.spline.getPoint( this.t_spline_ganador );
        //    console.log(pt)
        this.model.position.set( this.pt.x, this.pt.y, this.pt.z );
        this.tangent = this.spline.getTangent( this.t_spline_ganador ).normalize();
        this.mixer.update(this.clock.getDelta())
        this.axis.crossVectors(this.up, this.tangent).normalize();
        this.radians = Math.acos( this.up.dot( this.tangent ) );
        this.model.quaternion.setFromAxisAngle( this.axis, this.radians );
        this.t_spline_ganador = this.t_spline_ganador + this.dtSPLINE;
        console.log(this.t_spline_ganador);
        if(this.t_spline_ganador >= 1){
            this.model.position.copy(this.posicion_fin_caja);
            this.t_spline_ganador = 0;
            cancelAnimationFrame(this.var_correr);
                // console.info("FIN SPLINE");
            this.CUY_CORRIENDO = false;
            if( this.model.position.x == this.posicionmadera.x && 
                this.model.position.z == this.posicionmadera.z
            )
            {
                this.modelCuyChoque.position.copy(this.posicionmodel);
                this.modelCuyChoque.lookAt(this.getObjeto_caja("x").getWorldPosition());
                this.modelCuyChoque.position.y = -0.1;
                this.cuychoque();
                this.cajax_animacion();///caja x voltear
            }
            this.model.visible = false;
            this.callback_ganador();
            var fin_tiempof = performance.now();
            var milisegundosf = (fin_tiempof - this.inicio_tiempo);
            console.info("TIEMPO FINAL=> segundos: " +parseFloat(milisegundosf/1000).toFixed(2)+" ,  milliseconds : "+ milisegundosf );
        }
    }
    cuydudando() {
        this.cuy.mixerCuyDudando.update(this.cuy.clockCuyDudando.getDelta());
        this.var_cuydudando = requestAnimationFrame(this.cuydudando.bind(this));
        this.cuy.modelCuyDudando.visible = true;
        this.cuy.model.visible = false;
        this.cuy.modelCuyChoque.visible = false;
        this.cuy.renderer.render(this.cuy.scene, this.cuy.camera);
    }
    get_caja(numero){
        var cajaobjeto = {};
        if(numero == 0 || numero == "x"){
            numero = "x";
        }
        $(this.CAJAS_ARRAY).each(function(i,e){
            if(e.name == numero){
                cajaobjeto = e;
                return false;
            }
        })
        var worldposition = new THREE.Vector3();
        cajaobjeto.getWorldPosition(worldposition);
        var posicion = {
            nombre : numero,
            posicion:
            {
                x : worldposition.x,
                y : worldposition.y,
                z : worldposition.z
            }
        }
        return posicion;
    }
    getPositionOtroVector(ganador,otro){
        if( ganador == "0"){
            ganador = "x";
        }
        var vector_ganador = new THREE.Vector3();
        this.getObjeto_caja(ganador).getWorldPosition(vector_ganador);
        otro.position.copy(vector_ganador);
        otro.lookAt(0,0,0);
        otro.translateZ(1);
        var posicionnueva = new THREE.Vector3();
        otro.getWorldPosition(posicionnueva);
        var vector = new THREE.Vector3(posicionnueva.x,0,posicionnueva.z);
        return vector;
    }
    callback_ganador(){
        console.warn("CALLBACK CUY GANADOR  --------");//**/}
        this.reiniciar_termometro();
        var tiempo_cuychoque = this.TIEMPO_ESPERA_CASAGANADOR; ///por defecto 1 seg,al entrar en caja
        if(this.GANADOR_DE_EVENTO == "0" || this.GANADOR_DE_EVENTO == "x"){
            tiempo_cuychoque = this.TIEMPO_CUY_CHOQUE;
        }
        setTimeout(
            () => {
                self = this;
                this.mostrar_div_ganador();
                setTimeout( () => {
                    self.ocultar_div_ganador();
                    self.t = 0;
                    self.ANIMACION_CUY = false;
                    //iniciar_websocketservidor();
                    self.ANIMACION_CUY_PORTADA = false;
                    self.INICIO_ANIMACION_CUY_PORTADA();
                
                },this.TIEMPO_GANADOR_PORTADA);
                setTimeout(() =>{
                    // ultimos120eventos.splice(-1,1);
                    // ultimos120eventos.unshift({ganador:GANADOR_DE_EVENTO,idEvento:EVENTO_ID});
                    // calcular_estadisticas_nuevo();
                    // calcular_estadisticas(estadistica);
                    // this.agregar_ganador_estadistica(GANADOR_DE_EVENTO);
                    self.GANADOR_DE_EVENTO = "";
                    self.detener_var_animarcamara();
                    self.PUNTOS_CUY = null;
                    self.INDICE_PUNTOS_CUY = 0
                    self.reiniciar_cuy();
                    self.retornar_cajx();
                    self.bfuncion_easing_indice = 0;
                    self.detener_var_cuychoque();
                },1000);
            }, tiempo_cuychoque);
    }
    retornar_cajx(){
        this.cajax.position.y = -9.8808069229126;//9.932283401;//-993.228455; 
        this.cajax.rotation.x = 0;//-7.318557638911297e-33;
        this.maderas[0].visible = true;
        this.maderas[1].visible = true;
    }
    ocultar_div_ganador(){
        $("#DIV_GANADOR").removeClass("latido_animacion").addClass("off").addClass("SIN_ANIMACION_children");
        $("#contenedor_cubo_ganador").removeClass("latido_animacion").addClass("off").addClass("SIN_ANIMACION_children");;
       // $("#DIV_GANADOR").hide();
       self = this;
        $("#DIV_GANADOR")
           .off().on("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd",
            function(e){
               console.info("termino anim");
               // ocultar_div_tituloevento();
               self.mostrar_div_eventoesperando();
               $('#cubo_ganador img').data('shiningImage').stopshine();
               $("#imagen_nro_ganador").data("shiningImage").destruir();
   
               $(this).off(e);
            });
       if(typeof this.ganador_fireworks !== "undefined"){
           this.ganador_fireworks.destruir();
       }
       if(typeof this.intervalo_cubo !== "undefined"){
           clearInterval(this.intervalo_cubo);
       }
   }
    mostrar_div_ganador(){
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
   
        if(typeof this.ganador_fireworks !== "undefined"){
           this.ganador_fireworks.destruir();
       }
        if(typeof this.ganador_confeti !== "undefined"){
           this.ganador_confeti .destruir();
       }
   
       this.ganador_confeti = $('#DIV_GANADOR').confeti();
       this.ganador_fireworks = $('#DIV_GANADOR').fireworks({
            n_stars : 0, //num of stars
            twinkleFactor : .4, //how much stars 'twinkle'
            maxStarRadius  :  3,
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
      if(typeof this.intervalo_cubo !== "undefined"){
           clearInterval(this.intervalo_cubo);
       }
       //intervalo_cubo=setInterval(function(){toggleShape()},4000)
    }
    actualizar_div_ganador(nro_ganador){
        var GANADOR_DE_EVENTO = nro_ganador;
        var ganador_TEXTO = GANADOR_DE_EVENTO == 0 ? "x" : GANADOR_DE_EVENTO;
        $("#cubo_ganador img").attr("src","img/numeros/" + ganador_TEXTO + ".png");
        $("#span_idevento").text("#" + this.EVENTO_ID);
    }
    reiniciar_cuy(){
        this.model.position.set(0,0,0);
        this.a = {
            x : this.model.position.x,
            y : this.model.position.y,
            z : this.model.position.z
        }
        this.modelCuyDudando.position.set(0,0,0);
        this.modelCuyChoque.position.set(0,0,0);
        this.clock = new THREE.Clock();
        this.clockCuyDudando = new THREE.Clock();
        this.clockCuyChoque = new THREE.Clock();
        this.clockCajaGirando = new THREE.Clock();
        this.t = 0;
        $("#barra_loading_tpi").css("height","100%");
        // $("#barra_loading_tpi").css("width","0%");
        //PUNTOS_CUY=null;
        //INDICE_PUNTOS_CUY=0;
    }
    mostrar_cajagirando(){
        this.modelCajaGirando.visible = true;

        this.model.visible = false; 
        this.modelCuyDudando.visible = false;       
        this.modelCuyChoque.visible = false;
    }
    
    mostrar_div_eventoesperando(){
        $("#DIV_ESPERANDOEVENTO").removeClass("SIN_ANIMACION").fadeIn();//show();
    }
    puntos_azar_inicio(inicio){
        var arrayvector = [];
        arrayvector.push(new THREE.Vector3(inicio.x,0,inicio.z));
        for(var a = 0 ; a < 10 ; a++ ){
            let nuevo = this.generar_nueva_posicion_random2(2.35);
            arrayvector.push(new THREE.Vector3(nuevo.x,0,nuevo.z))
        }
        return arrayvector;
    }
    cuy_rotacionrandom() {//var_cuy_rotando
        if(!this.CUY_ROTANDO){return;}
        this.model.visible = true;
        this.modelCuyDudando.visible = false;
        this.modelCuyChoque.visible = false;

        this.timerotacion = parseFloat(this.timerotacion + this.dtrotacion).toFixed(5);
        this.timerotacion = parseFloat(this.timerotacion);

        this.var_cuy_rotando = requestAnimationFrame(this.cuy_rotacionrandom.bind(this));
        this.mixer.update(this.clock.getDelta());
        THREE.Quaternion.slerp(this.q1, this.q2, this.model.quaternion, this.timerotacion); // added
        this.renderer.render(this.scene, this.camera);
        if (this.timerotacion > 1) {
            this.model.lookAt(new THREE.Vector3(this.b.x,this.b.y,this.b.z))
            this.modelCuyDudando.lookAt(new THREE.Vector3(this.b.x,this.b.y,this.b.z))
            this.modelCuyChoque.lookAt(new THREE.Vector3(this.b.x,this.b.y,this.b.z))
    
            this.CUY_ROTANDO = false;
            this.timerotacion = 0; 
            cancelAnimationFrame(this.var_cuy_rotando) // changed
             if (typeof this.var_cuy_rotando != "undefined") {
                cancelAnimationFrame(this.var_cuy_rotando);
                delete this.var_cuy_rotando;
            }
            //console.info("acabo rotacion rand");
            this.modelCuyDudando.rotation.x = this.model.rotation.x;
            this.modelCuyDudando.rotation.y = this.model.rotation.y;
            this.modelCuyDudando.rotation.z = this.model.rotation.z;

            this.modelCuyChoque.rotation.x = this.model.rotation.x;
            this.modelCuyChoque.rotation.y = this.model.rotation.y;
            this.modelCuyChoque.rotation.z = this.model.rotation.z;

            this.modelCuyDudando.position.x = this.model.position.x;
            this.modelCuyDudando.position.y = this.model.position.y;
            this.modelCuyDudando.position.z = this.model.position.z;

            this.a = { 
                x: this.model.position.x,
                y: this.model.position.y,
                z: this.model.position.z 
            }; 
            //cuydudando();
            if (typeof this.callback_rotacion != "undefined") {
                this.callback_rotacion();
                delete this.callback_rotacion;
            }
        }
    }
    generar_nueva_posicion_random(){
        this.bfuncion_easing_indice = 0;//random_entero(0,EasingFunctions_array.length-1);
        //console.warn("i= "+bfuncion_easing_indice);
        this.b = this.PUNTOS_CUY[this.INDICE_PUNTOS_CUY];
        this.INDICE_PUNTOS_CUY++;
        if(this.INDICE_PUNTOS_CUY > this.PUNTOS_CUY.length){
            console.warn(this.INDICE_PUNTOS_CUY + " ---------Cuy pasó length del array PUNTOS_CUY  --- ")
            this.INDICE_PUNTOS_CUY = 0; 
            this.b = this.PUNTOS_CUY[this.INDICE_PUNTOS_CUY];
        }
        return this.b;
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

    detener_animacion(){
        if (typeof this.animacion !== "undefined") {
           cancelAnimationFrame(this.animacion);
           delete this.animacion;
           this.aumento = 0;
        }
    }
    detener_var_correr_spline_portada(){/*stop cuy en portada */
        if(typeof this.var_correr_spline_portada != "undefined"){
             cancelAnimationFrame(this.var_correr_spline_portada);
             this.t = 0;
             delete this.var_correr_spline_portada;
        }
    }
    detener_var_cuymoviendo(){
        if(typeof this.var_cuymoviendo != "undefined"){
            //CUY_CORRIENDO=false;
            cancelAnimationFrame(this.var_cuymoviendo);
            delete this.var_cuymoviendo;
            this.aumento = 0;
        }
    }
    detener_var_cuydudando(){
        if(typeof this.var_cuydudando != "undefined"){
             cancelAnimationFrame(this.var_cuydudando);
             delete this.var_cuydudando;
        }
    }
    detener_var_cuy_rotando(){
        if(typeof this.var_cuy_rotando != "undefined"){
           cancelAnimationFrame(this.var_cuy_rotando);
           delete this.var_cuy_rotando;
      }
    }
    detener_animacion(){
        if (typeof this.animacion !== "undefined") {
            cancelAnimationFrame(this.animacion);
            delete this.animacion;
            this.aumento = 0;
        }
    }
     detener_var_cuychoque(){
        if(typeof this.var_cuychoque != "undefined"){
             cancelAnimationFrame(this.var_cuychoque);
             delete this.var_cuychoque;
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
    ocultar_cuy_cargando(){//hide DIV img CUY CARGANDO
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

    lerp(a, b, t) {
        return a + (b - a) * t;
    }
    ease(t) {
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    }
}
export { Cuy }





