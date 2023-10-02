var socket;
var url = null;
var host= null;
var port=null;
var path=null;

RECONECTAR_WEBSOCKET=true;

function connectarWebSockets(ipservidor,puerto)
{
  host=ipservidor;
  port=puerto;
  init(host,port);
}
function init(host,port){
  //* host="wss://sorteoat.local/wss2/";//host="wss://192.168.1.60:89/wss2/"*/
   var protocol = 'ws://'; 
  if (window.location.protocol === 'https:') {
         protocol = 'wss://';
         host=protocol+window.location.host+"/ws_cuy/";
  }
  else{
      host="ws://"+host+":"+port;
  }
  console.info("CONECTANDO A "+host);
  url=host;
  try{
    socket = new WebSocket(host);
    //log('WebSocket - status '+socket.readyState);
    socket.onopen    = function(msg){
                logwarn("Conectado a "+url +" ; estado= "+this.readyState);
                setTimeout(function(){
                    pedir_hora_server();
                },50)
     };
    socket.onmessage = function(msg){ 
           aaaaa=msg;
           mensaje=msg.data;
          if(mensaje=="ACTUALIZAR"){
          }
          else{
               proxima_fecha=moment(eventoactual.fechaFinEvento, "YYYY-MM-DD HH:mm:ss a");
               ahora=moment(msg.data);
               segundos=proxima_fecha.diff(ahora,'seconds');
              reloj_websockets(msg.data,eventoactual.fechaFinEvento,eventoactual.segBloqueoAntesEvento);

               if(segundos<1){
                    console.warn("Evento "+eventoactual.IdEvento+" con fecha fin= "+proxima_fecha.format("YYYY-MM-DD HH:mm:ss")+" menor a hora actual="+ahora.format("YYYY-MM-DD HH:mm:ss")+", recargando....");
                    toastr.error("Evento #"+eventoactual.IdEvento+" ya finalizó, Recargar")
                    detenerContador();
                    $("#proximo_en2").text("--");
                    $("#barra_loading").css("width","100%");
                    $.LoadingOverlay("hide");
                    $("#contador_overlay").remove();
                    $("#recargar_tabla").text("Recargar");
                    $("#recargar_tabla").show();
                   //CargarTabla();
               } else {
                  $("#recargar_tabla").hide();
                  $("#recargar_tabla").text("");
                  // console.info("Iniciando Reloj serv "+msg.data); 
                  ContadorProximoEvento(msg.data,eventoactual.fechaFinEvento,eventoactual.segBloqueoAntesEvento);
               }
          }
	 };
  socket.onerror=function(msg){
        logwarn("error sockets");
   };
  socket.onclose   = function(msg){ 
       if(typeof intervalohora!="undefined"){
            clearInterval(intervalohora);
        }
        if(RECONECTAR_WEBSOCKET){
          logwarn("Desconectado - status "+this.readyState+" ;Reintentando conectar en 2 segundos");
          setTimeout(function(){
            connectarWebSockets(IPSERVIDOR_WEBSOCKETS,PUERTO_WEBSOCKETS)
          },400);
        }

                         
     };
                 
  }
  catch(ex){ 
    logerror(ex); 
  }
}
function pedir_hora_server(){
  msg = "date";
  try
  {
      socket.send(msg); 
  } 
  catch(ex)
  { 
    logerror(ex);  
  }
}

function quit(){
  log("Goodbye! "+url);
  socket.close();
  socket=null;
}
// Utilities
function log(msg){ 
  console.info(msg);
}
function logwarn(msg){ 
  console.warn(msg);
}
function logerror(msg){ 
   console.error(msg);
}
//function onkey(event){ if(event.keyCode==13){ send(); } }
