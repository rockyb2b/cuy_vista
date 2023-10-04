var socket;
var url = null;
var host = null;
var port = null;
var path = null;

var logueo_websockets = true;
RECONECTAR_WEBSOCKET = true;

opciones_toast_mantener = {
    timeOut: 0,
    extendedTimeOut: 0,
    tapToDismiss: false
};

function crear_toasr_websockets_error() {
    if (typeof toasr_websockets_error == "undefined") {
        toastr.options = {
            timeOut: 0,
            extendedTimeOut: 0,
            tapToDismiss: false
        };
        toastr_errorconexion = toastr.error("Error de Conexión al Servidor");
    } else {
        toasr_websockets_error.show();
    }
}

function crear_toastr_eventofinalizo() {
    if (typeof toastr_eventofinalizo == "undefined") {
        toastr.options = {
            timeOut: 0,
            extendedTimeOut: 0,
            tapToDismiss: false
        };
        toastr_eventofinalizo = toastr.warn("Evento actual ya finalizó");
    } else {
        toastr_eventofinalizo.show()
    }
}

function ocultar_toastr_eventofinalizo() {
    if (typeof toastr_eventofinalizo != "undefined") {
        toastr_eventofinalizo.hide();
    }
}
function connectarWebSockets(ipservidor, puerto) {
    host = ipservidor;
    port = puerto;
    init(host, port);
}
function init(host, port) {
    // host="wss://sorteoat.local/wss2/";
    //host="wss://192.168.1.60:89/wss2/"
    var protocol = 'ws://';
    if (window.location.protocol === 'https:') {
        protocol = 'wss://';
        host = protocol + window.location.host + "/ws_cuy/";
    } else {
        host = "ws://" + host + ":" + port;
    }
    console.info("CONECTANDO A " + host);
    url = host;
    try {
        console.log(performance.now() + " CREANDO SOCKET " + url);
        socket = new WebSocket(host);
        console.log(performance.now() + " " + socket.readyState);
        socket.onopen = function(msg) {
            if (typeof timeout_eventofinalizo != "undefined") {
                console.log("DETENIENDO timeout_eventofinalizo");
                clearTimeout(timeout_eventofinalizo);
            }
            if (typeof timeout_nohayevento != "undefined") {
                console.log("DETENIENDO timeout_nohayevento");
                clearTimeout(timeout_nohayevento);
            }
            if (typeof toastr_errorconexion != "undefined") {
                toastr_errorconexion.hide();
            }

            detener_timeout_conexionwebsockets()
            if (typeof toasr_websockets_error != "undefined") {
                toasr_websockets_error.hide();
            }
            logwarn(performance.now() + " Conectado a " + url + " ; estado= " + this.readyState); /////3  => desconectado    0  no conectado,   1  conectado
            // setTimeout(function(){
            //pedir_evento()
            //console.info("pidiendo horaaaaaaaaaaaaaaaaaaaaaaaa despues de onopen");
            intentando_conectarwebsocket = false;
            CONECTADO__A_SERVIDORWEBSOCKET = true;
            // pedir_hora_server();
            pedir_eventoJSON();
            //          },1)
        };
        socket.onmessage = function(msg) {
            aaaaa = msg;
            try {
                jsondecode = JSON.parse(msg.data);
                id = jsondecode.id;
                this.id = id;
                mensaje = jsondecode.mensaje;
                tipo = jsondecode.tipo;
                console.log("ID SOCKET  ==========" + id);
            } catch (ex) {
                mensaje = msg.data;
                tipo = "date";
            }
            // mensaje=msg.data;
            if (typeof toastr_errorconexion != "undefined") {
                toastr_errorconexion.hide();
            }
            if (typeof toasr_websockets_error != "undefined") {
                toasr_websockets_error.hide();
            }

            switch (tipo) {
                case "eventoJSON":
                    pedir_hora = false;
                    //console.info(jsondecode);
                    EVENTO_DATOS = JSON.parse(jsondecode.mensaje);
                    accion_evento(EVENTO_DATOS); /////////////////////////////////////////******//////////////////
                    break;
                    //reloj_websockets(msg.data,eventoactual.fechaFinEvento,eventoactual.segBloqueoAntesEvento);
            }

        };
        socket.onerror = function(msg) {
            socket.close();
            intentando_conectarwebsocket = false;
            console.log(performance.now() + " on error " + " SOCKET STATE=" + socket.readyState);

            //socket=null;
            CONECTADO__A_SERVIDORWEBSOCKET = false;
            // logwarn("on error sockets");
        };
        socket.onclose = function(msg) {
            ////////////socket readystate = 3  CLOSED

            if (typeof timeout_eventofinalizo != "undefined") {
                console.log("DETENIENDO timeout_eventofinalizo");
                clearTimeout(timeout_eventofinalizo);
            }
            console.log(performance.now() + "  on close " + " SOCKET STATE=" + socket.readyState);
            if (typeof socket != "undefined" && socket != null) {
                socket.close();
            }
            socket = null;
            yahay_timeourparareconexion = false;
            if (typeof timeout_reconectar != "undefined") {
                console.warn("ya hay timeout_reconectar");
                yahay_timeourparareconexion = true;
            }

            if (yahay_timeourparareconexion == false) {
                console.info("declarando  timeout_reconectar")
                timeout_reconectar = setTimeout(function() {

                    intentando_conectarwebsocket = false;
                    CONECTADO__A_SERVIDORWEBSOCKET = false;

                    if (RECONECTAR_WEBSOCKET) {
                        crear_toasr_websockets_error();
                        logwarn(performance.now() + " Desconectado-status " + this.readyState + " ;Reintentando conectar en 2 segundos");
                        console.log("reconectar socket "); //+socket.readyState);
                        intentando_conectarwebsocket = true;
                        socket = null;
                        clearTimeout(timeout_reconectar);
                        delete timeout_reconectar;

                        if (ANIMACION_CUY == false) {
                            iniciar_websocketservidor();
                            // timeout_conexionwebsockets();
                        }
                    }
                }, 5000);
            }
        }; ///fin on close
    } //fin try
    catch (ex) {
        CONECTADO__A_SERVIDORWEBSOCKET = false;
        console.warn("try catch error")
        logerror(ex);
    }
}

function pedir_hora_server() {
    msg = "date";
    try {
        socket.send(msg);
    } catch (ex) {
        logerror(ex);
    }
}

function pedir_eventoJSON() {
    msg = "eventoJSON";
    try {
        console.info(performance.now() + " eventoJSON ,estado=" + socket.readyState);
        socket.send(msg);
    } catch (ex) {
        console.info(performance.now() + " eventoJSON");
        logerror(ex);
    }
}

function quit() {
    log("Goodbye! " + url);
    socket.close();
    socket = null;
}

function log(msg) {
    console.info(msg);
}

function logwarn(msg) {
    console.warn(msg);
}

function logerror(msg) {
    console.error(msg);
}

//function onkey(event){ if(event.keyCode==13){ send(); } }


//////////////////////////////////////////NUEVO ULTIMO///////////////////////////////////////////////////////////

function accion_evento(DATOS) {
    var  EVENTO_ACTUAL = DATOS.evento;
    EVENTO_ID = EVENTO_ACTUAL.evento_id_actual;
    hora_servidor = DATOS.hora_servidor;
    if (EVENTO_ID != "") {
        pedir_hora = false;
        GANADOR_DE_EVENTO = EVENTO_ACTUAL.evento_valor_ganador;
        if (GANADOR_DE_EVENTO == null) {
            console.warn(" ---  NO HAY GANADOR_DE_EVENTO " + EVENTO_ID);
        }
        $("#evento_actual_portada").text("#" +EVENTO_ID);
        TIEMPO_GANADOR_PORTADA=10000;

        TIEMPO_GIRO_CAJA = (EVENTO_ACTUAL.segCajaGirando) * 1000;
        TIEMPO_CUY = (EVENTO_ACTUAL.segBloqueoAntesAnimacion * 1000) - TIEMPO_GIRO_CAJA; //EVENTO_ACTUAL.tiempo_cuy_moviendo;
        TIEMPO_CUY_CHOQUE=5000;///tiempo espera cuy en estado de choque
        TIEMPO_ESPERA_CASAGANADOR=1000; ///tiempo espera luego q cuy entra en casa
        PUNTOS_CUY = JSON.parse(EVENTO_ACTUAL.puntos_cuy);

        FECHA_INICIO_EVENTO = EVENTO_ACTUAL.fecha_evento_ini_actual;
        FECHA_INICIO_EVENTO = moment(FECHA_INICIO_EVENTO, "YYYY-MM-DD HH:mm:ss a");

        FECHA_FIN_EVENTO = EVENTO_ACTUAL.fecha_evento_fin_actual;
        FECHA_FIN_EVENTO = moment(FECHA_FIN_EVENTO, "YYYY-MM-DD HH:mm:ss a");

        FECHA_ANIMACION = EVENTO_ACTUAL.fecha_animacion;
        FECHA_ANIMACION = moment(FECHA_ANIMACION, "YYYY-MM-DD HH:mm:ss a");

        segundos_total_espera_evento=FECHA_ANIMACION.diff(FECHA_INICIO_EVENTO, 'seconds');

        ahora = moment(hora_servidor); //.format("YYYY-MM-DD HH:mm:ss a");
        segundos_para_fin_evento = FECHA_FIN_EVENTO.diff(ahora, 'seconds');
        segundos_para_animacion = FECHA_ANIMACION.diff(ahora, 'seconds');


         //   TIEMPO_GIRO_CAJA=1000;
         // TIEMPO_GANADOR_PORTADA=10000;
         //   TIEMPO_CUY = 2000;
         //   segundos_para_animacion=1;
          // segundos_para_animacion=1000002;

        //  porcentaje_barra=0;
        //  if(segundos_para_animacion>0){
        //      porcentaje_barra=((segundos_total_espera_evento-segundos_para_animacion)*100)/segundos_total_espera_evento;
        //  }
        // if(segundos_para_fin_evento>0){
        //     porcentaje_barra=((segundos_total_espera_evento-segundos_para_fin_evento)*100)/segundos_total_espera_evento;
        // }
        // // var tiempo_fin_evento=segundos_para_fin_evento;
        // // INTERVAL_fin_evento=setInterval(function(){
        // //     tiempo_fin_evento--;
        // //     if(tiempo_fin_evento<=0){
        // //         EVENTO_YA_PASO = true;
        // //         clearInterval(INTERVAL_fin_evento);
        // //     }
        // // },1000);
        // $("#barra_loading_tpi").css("height",porcentaje_barra+"%");
        accion_cuy(EVENTO_ACTUAL,segundos_para_animacion,segundos_para_fin_evento); //////////////////////////////////////////////////
    } else {
        crear_toasr_nohay_evento();
        console.warn("No hay evento activo");
        if (typeof timeout_nohayevento != "undefined") {
            //clearTimeout(timeout_eventofinalizo);
        } else {
            timeout_nohayevento = setTimeout(function() {
                iniciar_websocketservidor();
                clearTimeout(timeout_nohayevento);
                delete timeout_nohayevento;
            }, 3000)
        }
    }
}

function accion_cuy2(evento_valor_ganador,seg_para_animacion,seg_para_finevento) {
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
           mostrar_div_eventoesperando();
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
          ///fin barra cuy
          ///contador inicio cuy
          actualizar_contador_texto_latido(seg_para_animacion,TEXTO_CONTADOR);
          ////fin contador inicio cuy
      }, 1000);
  } else { //////seg animacionm else
      toastr.options = opciones_toast_mantener;
      console.log(performance.now() + " esperando fecha fin evento actual " + id_evento + ",para recargar " + fecha_fin_ev);
      if (seg_para_finevento > 0) {
          mostrar_div_eventoesperando();
          toast_eventoterminar = toastr.info("Esperando que termine evento actual");
          $("#barra_loading_tpi").animate({
              height: "0%"
          }, (seg_para_finevento) * 1000, function() {
              callback_esperar_termino_evento(ganador_evento);
          });
          actualizar_contador_texto(seg_para_finevento,TEXTO_ESPERAR_TERMINO_EVENTO);
      } else {
          toastr_eventofinalizo = toastr.info(" Evento actual ya finalizó")
          if (typeof timeout_eventofinalizo != "undefined") {
              //clearTimeout(timeout_eventofinalizo);
          } else {
              timeout_eventofinalizo = setTimeout(function() {
                  toastr_eventofinalizo.hide();
                  clearTimeout(timeout_eventofinalizo);
                  delete timeout_eventofinalizo;
                  iniciar_websocketservidor();
              }, 4000)
          }
      } ///else segundos_para_fin_evento >0
  } //fin else
} ///fin accion cuy2

function accion_cuy(evento,seg_para_animacion,seg_para_finevento) {
      var id_evento=evento.evento_id_actual;
      var ganador_evento = evento.evento_valor_ganador;
      var fecha_fin = evento.fecha_evento_fin_actual;
      var fecha_fin_ev = moment(fecha_fin, "YYYY-MM-DD HH:mm:ss a");
    // if (ANIMACION_CUY_PORTADA == false) {
    //     INICIO_ANIMACION_CUY_PORTADA(); /*CUY PORTADA*/ ;
    // }
    if (seg_para_animacion > 0) { ///EN rango animacion
        setTimeout(function() {
            ///barra carga cuy
             mostrar_div_eventoesperando();
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
            ///fin barra cuy
            ///contador inicio cuy
            actualizar_contador_texto_latido(seg_para_animacion,TEXTO_CONTADOR);
            ////fin contador inicio cuy
        }, 1000);
    } else { //////seg animacionm else
        toastr.options = opciones_toast_mantener;
        console.log(performance.now() + " esperando fecha fin evento actual " + id_evento + ",para recargar " + fecha_fin_ev);
        if (seg_para_finevento > 0) {
            mostrar_div_eventoesperando();
            toast_eventoterminar = toastr.info("Esperando que termine evento actual");
            $("#barra_loading_tpi").animate({
                height: "0%"
            }, (seg_para_finevento) * 1000, function() {
                callback_esperar_termino_evento(ganador_evento);
            });
            actualizar_contador_texto(seg_para_finevento,TEXTO_ESPERAR_TERMINO_EVENTO);
        } else {
            toastr_eventofinalizo = toastr.info(" Evento actual ya finalizó")
            if (typeof timeout_eventofinalizo != "undefined") {
                //clearTimeout(timeout_eventofinalizo);
            } else {
                timeout_eventofinalizo = setTimeout(function() {
                    toastr_eventofinalizo.hide();
                    clearTimeout(timeout_eventofinalizo);
                    delete timeout_eventofinalizo;
                    iniciar_websocketservidor();
                }, 4000)
            }
        } ///else segundos_para_fin_evento >0
    } //fin else
} ///fin accion cuy

function callback_animacion(EVENTO_ID){
    detener_var_correr_spline_portada();
    ocultar_termometro_contador();
    ocultar_div_eventoesperando(
            function(){
                    actualizar_evento_titulo(EVENTO_ID);
                    buscando_evento = false;
                    INICIO_ANIMACION_CUY(); ////////////////////////////////////////
            }

        );
}
function callback_esperar_termino_evento(GANADOR_DE_EVENTO){
        reiniciar_termometro();

        ultimos120eventos.splice(-1,1);
        ultimos120eventos.unshift({ganador:GANADOR_DE_EVENTO,idEvento:EVENTO_ID});
        calcular_estadisticas_nuevo();
        agregar_ganador_estadistica(GANADOR_DE_EVENTO);
        toast_eventoterminar.hide();
        iniciar_websocketservidor(); //////////////////////////////
}
function actualizar_contador_texto_latido(tiempo_en_segundos,texto){
            $("#contador_para_activar").text(texto + " " + tiempo_en_segundos +" seg.");
            var conta = tiempo_en_segundos - 1;
           // $("#termotetro_para_iniciar").removeClass("latido_animacion_2");
            conteo_ = setInterval(function() {
                $("#contador_para_activar").text(texto + " " + conta +" seg. ");
                if (conta < 1) {
                 // $("#termotetro_para_iniciar").removeClass("latido_animacion_2");
                    clearInterval(conteo_);
                }else if(conta<11){
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
function actualizar_contador_texto(tiempo_en_segundos,texto){
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
function actualizar_evento_titulo(EVENTO_ID){
    $("#idevento_titulo").css("font-size", "7vh")
    $("#idevento_titulo").html('<div style="font-size: 5vh">#</div>' + EVENTO_ID);
    mostrar_div_tituloevento();
}

function logueo_opcional(mensaje) {
    if (LOGUEO) {
        console.log(mensaje)
    }
}

function getColor(array_estadistica, buscar) {
    obj = {};
    $(array_estadistica).each(function(i, e) {
        if (e.valorapuesta == buscar) {
            obj = e;
            return false;
        }

    });
    return obj;
}
function log_eventofechas(){
    if (logueo_websockets) {
      console.info("INI= "+FECHA_INICIO_EVENTO.format("YYYY-MM-DD HH:mm:ss a") + " - FIN="+FECHA_FIN_EVENTO.format("YYYY-MM-DD HH:mm:ss a")
                  +" ACTUAL=  "+ ahora.format("YYYY-MM-DD HH:mm:ss a")
                  +" - ANIMACIÓN= "+moment(FECHA_ANIMACION).format("YYYY-MM-DD HH:mm:ss a")
                  +"--SEG. PARA ANIMACIÓN= "+segundos_para_animacion
                  +" segBloqueoAntesAnimacion="+EVENTO_ACTUAL.segBloqueoAntesAnimacion
                  +" segCajaGirando="+EVENTO_ACTUAL.segCajaGirando

           );
  }
}