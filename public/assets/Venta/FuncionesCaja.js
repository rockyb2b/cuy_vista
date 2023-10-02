TIEMPO_INTERVALO_HISTORIALJACKPOT=14000;
DETENER_HISTORIALJACKPOT=false;
RECARGAR_TOMBOLA=true;////despues de acabado el conteo
////ajax_historial=> ajax de recarga de historialjackpot
OPCIONES_CAJA={
    TIENDA:$("#datoscaja #tienda").val(),
    CAJA:$("#datoscaja #caja").val(),
    FECHAOPERACION:$("#datoscaja #fechaOperacion").val(),
    TURNO:$("#datoscaja #turno").val(),
    idPuntoVenta:$("#datoscaja #turno").val(),
    idUbigeo:$("#datoscaja #idUbigeo").val(),
    idAperturaCaja:$("#datoscaja #idAperturaCaja").val(),
    cc_id:$("#datoscaja #idAperturaCaja").val(),
    imagen_loadingoverlay_contador:basePath+"img/loading/load.gif",
    ubicacion_imagenes_juego:basePath+"img/juegos/"
}

//////////////////BUSCADOR
/////////////////BOTONES
opciones_toast_mantener={
              timeOut: 0,
              extendedTimeOut: 0,
              tapToDismiss: false
              };



function mostrar_modal_pagados(){
    $("#modal_buscar_pagados").modal("show"); 
}
function mostrar_modal_cancelar_ticket(){
    $("#modal_buscar_cancelar_ticket").modal("show"); 
}
function mostrar_modal_reimprimir_ticket(){
    $("#modal_buscar_reimprimir_ticket").modal("show"); 
}

function mostrar_modal_buscar_para_reimprimir_cancelar_ticket(){
    $("#modal_buscar_para_reimprimir_cancelar_ticket").modal("show"); 
}


function CargarTabla() {
    $.ajax({
        type: 'POST',
        url: basePath + 'CajaTablaFk',
        data: {
            '_token': $('input[name=_token]').val(),
        },
        beforeSend:function(){
             // RECONECTAR_WEBSOCKET=false;socket.close();
                detenerHistorialJackpot();
                $.LoadingOverlay("show");
        },
        success: function (response) {
            $('.modal').modal('hide');
          //    RECONECTAR_WEBSOCKET=true;
            $(".content.container-fluid").html(response.html);
            if(response.error!=""){
                toastr.error(response.error);
            }
            INICIAR();
            $.LoadingOverlay("hide");
        },
       error: function (jqXHR, textStatus, errorThrown) {
                toastr.error("Error de Conexión a Servidor");
                $.LoadingOverlay("hide");
                setTimeout(function(){CargarTabla()},5000)
        
        }
    })
}

function CargarAperturaCaja(){
    window.location=basePath+"AperturaCajaListar";
}
function CargarCierreCaja(){
    window.location=basePath+"CierreCajaVista";
}


////BUSCARTICKET   E  IMPRIMIR PAGO
function BuscarTicket(ticketobjeto){
    $.ajax({
        type: 'POST',
        url: basePath + 'BuscarTicketFk',
         data: {
            '_token': $('input[name=_token]').val(),
            'datos':ticketobjeto
        },
        beforeSend:function(){
            toastr.options=opciones_toast_mantener;
            toastr_buscarticket_parapagar= toastr.info(" Buscando Ticket "+ticketobjeto.idTicket+" ...")
            toastr.options={};
        },
        success: function (response) {
            toastr_buscarticket_parapagar.hide();
            $("#modal_buscar #btn_buscar_ticket").LoadingOverlay("hide");
            $("#modal_buscar #btn_buscar_ticket").attr("disabled",false);
            $("#modal_imprimir_pago #imagen_apuestatotal").attr("src",basePath+"img/logoticket.png");

            ticketbuscado=response.ticketbuscado;
            ticketsganadores=response.tickets;
            resultados_evento=response.resultados_evento;
            apuestasticket=response.apuestas_ticket;
            idEvento_ticket=response.idEvento_ticket;
            conf_general=response.conf_general;
             ganadores="";
             if(apuestasticket.length==0){
                toastr.error("Ticket "+ ticketbuscado +" no está registrado");return;
             }
          

              if(apuestasticket[0].idPuntoVenta!=$("#idPuntoVenta").val()){

                if(conf_general.CobrarTicket==0){/*permitir cobrar ;  0=> no permitir cobrar en dif p venta al tick*/
                    toastr.error("Ticket de Diferente Punto de Venta :"+apuestasticket[0].PuntoVentaNombre);return;
                }
            }
            if(apuestasticket[0].estadoTicket===0){
                    toastr.error("Ticket "+apuestasticket[0].idTicket +" está Cancelado");return;
            }
             if(ticketsganadores.length>0){

                if(ticketsganadores[0].estadoTicket==0){toastr.error("Ticket"+ ticketbuscado+ " Anulado");return false;}
                if(ticketsganadores[0].estadoTicket==2){toastr.error("Ticket "+ ticketbuscado+" Pagado");return false;}
                if(ticketsganadores[0].estadoTicket==3){toastr.error("Ticket "+ ticketbuscado+" Suspendido");return false;}

                GuardarGanadorEvento(ticketsganadores,ticketsganadores[0].idTicket);//////////////////////////

                TICKET_IMPRIMIR_pago={};

                let imagen_juego=OPCIONES_CAJA.ubicacion_imagenes_juego+ticketsganadores[0].logo;
                TICKET_IMPRIMIR_pago.ImagenSrc=imagen_juego;
                TICKET_IMPRIMIR_pago.Id_Ticket=ticketsganadores[0].idTicket;
                TICKET_IMPRIMIR_pago.Id_Unidad=ticketsganadores[0].cc_id //eventoactual.IdEvento;
                TICKET_IMPRIMIR_pago.Nro_Evento=ticketsganadores[0].idEvento;
                TICKET_IMPRIMIR_pago.Desc=ticketsganadores[0].EventoNombre;
                TICKET_IMPRIMIR_pago.ImpresoEn=moment(new Date()).format("DD-MM-YYYY HH:mm a");
                TICKET_IMPRIMIR_pago.ImpresoPor=ticketsganadores[0].UsuarioCompra;
                TICKET_IMPRIMIR_pago.PremioMaximoAPagar=ticketsganadores[0].apuestaMaxima ;
                TICKET_IMPRIMIR_pago.puntoventanombre=ticketsganadores[0].puntoventanombre ;

                TICKET_IMPRIMIR_pago.CantidadGanada=0;

                TICKET_IMPRIMIR_pago.apuestaMinimaJuego=ticketsganadores[0].apuestaMinimaJuego;
                TICKET_IMPRIMIR_pago.apuestaMaximaJuego=ticketsganadores[0].apuestaMaximaJuego;
                TICKET_IMPRIMIR_pago.PremioMaximoPagar=ticketsganadores[0].PremioMaximoPagar;
                TICKET_IMPRIMIR_pago.PremiomaximoPotencial=ticketsganadores[0].PremiomaximoPotencial;
                TICKET_IMPRIMIR_pago.simbolo=ticketsganadores[0].simbolo;
                TICKET_IMPRIMIR_pago.cc_id=ticketsganadores[0].cc_id;

                apuestas=[];
                totalticket=0;
                $(ticketsganadores).each(function(i,e){
                        fila_apuesta={};
                        var tr=e;
                            fila_apuesta.evento=e.idEvento;
                            fila_apuesta.descripcion=e.TipoApuestaNombre;
                            var apuestafila=(parseFloat(e.multiplicadorApuestaGanada)*parseFloat(e.montoApostado));
                            fila_apuesta.apuesta=apuestafila.toFixed(2);
                            totalticket=totalticket+apuestafila;
                            apuestas.push(fila_apuesta);
                })

                TICKET_IMPRIMIR_pago.TotalTicket=parseFloat(totalticket).toFixed(2);
                TICKET_IMPRIMIR_pago.apuestas=apuestas;
                let divisa=TICKET_IMPRIMIR_pago.simbolo;
                var modal=$("#modal_imprimir_pago");

                $("#modal_imprimir_pago #divimpresion_pago #IDTique").text(TICKET_IMPRIMIR_pago.Id_Ticket)
                $("#modal_imprimir_pago #divimpresion_pago #IDUnidad").text(TICKET_IMPRIMIR_pago.Id_Unidad)
                $("#modal_imprimir_pago #divimpresion_pago #NroEvento").text(TICKET_IMPRIMIR_pago.Nro_Evento)
                $("#modal_imprimir_pago #divimpresion_pago #descripcion").text(TICKET_IMPRIMIR_pago.Desc)
                $("#modal_imprimir_pago #divimpresion_pago #datos_filas").empty();
                $(TICKET_IMPRIMIR_pago.apuestas).each(function(i,e){
                    $("#modal_imprimir_pago #divimpresion_pago #datos_filas").append($("<div>").attr("style","width:100%;display:table")
                            .append(
                            $("<div>").attr("style","width:38%;float:LEFT;text-align:left").text(e.evento)
                                )
                            .append(
                            $("<div>").attr("style","width:47%;float:LEFT;text-align:left").text(e.descripcion)
                                )
                              .append(
                            $("<div>").attr("style","width:15%;float:LEFT;text-align:left").text(e.apuesta)
                                )
                    )
                })

                var totalpagar_ticket=divisa+" "+TICKET_IMPRIMIR_pago.TotalTicket;
                // if(parseFloat(TICKET_IMPRIMIR_pago.TotalTicket)>parseFloat(eventoactual.apuestaMaxima)){
                //     totalpagar_ticket=eventoactual.apuestaMaxima;
                // }
                $("#modal_imprimir_pago #divimpresion_pago #total_ticket").text(totalpagar_ticket);
                let fecha_pago=moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
                $("#modal_imprimir_pago #divimpresion_pago #impreso_en").text(fecha_pago);
                $("#modal_imprimir_pago #divimpresion_pago #impreso_por").text(TICKET_IMPRIMIR_pago.ImpresoPor);
                $("#modal_imprimir_pago #divimpresion_pago #impreso_por2").text(TICKET_IMPRIMIR_pago.puntoventanombre);
                let PremioMaximoAPagar=divisa +" "+parseFloat(TICKET_IMPRIMIR_pago.PremioMaximoAPagar).toFixed(2)
                $("#modal_imprimir_pago #divimpresion_pago #PremioMaximoAPagar").text(PremioMaximoAPagar);
                $("#modal_imprimir_pago #divimpresion_pago .imagen img").attr("src",TICKET_IMPRIMIR_pago.ImagenSrc);

                $("#modal_imprimir_pago #btnimprimir").off("click").on("click",function(){
                    Imprimir($("#divimpresion_pago",modal));
                })
                setTimeout(function(){
                    $("#btnimprimir",modal).click();
                },1000);

                $("#modal_imprimir_pago").modal("show");//////////////////MOSTRAR MODAL

                let ganador_texto=resultados_evento[0].valorGanador=="0"?"x":resultados_evento[0].valorGanador;
                let resultado_evento="Evento "+" #"+idEvento_ticket+" - Nro Ganador: "+ganador_texto;
                $("#titulo_modal #resultado_evento").text(resultado_evento);

                let texto_ag=ticketsganadores.length==1?" Apuestas Ganadora":" Apuestas Ganadoras";
                let resultado_ticket=" Ticket "+ticketbuscado +" : "+(ticketsganadores.length)+texto_ag;
                $("#titulo_modal #resultado_ticket").text(resultado_ticket);

                toastr.success(resultado_evento+"<br>"+resultado_ticket);
                // toastr.success(" Ticket "+ticketbuscado +" : "+(ticketsganadores.length)+" Apuestas Ganadoras");
             }
             else{
                let ganador_texto=resultados_evento[0].valorGanador=="0"?"x":resultados_evento[0].valorGanador;
                let resultado_evento="Evento "+" #"+idEvento_ticket+" - Nro Ganador: "+ganador_texto;
                let resultado_ticket="Ticket "+ticketbuscado+ ": No hay Apuestas Ganadoras";
                toastr.error(resultado_evento+"<br>"+resultado_ticket);
             }
           
        },
         error:function(){
            toastr_buscarticket_parapagar.hide();
            
        },
        complete:function(){
            toastr_buscarticket_parapagar.hide();

        }
    })

}


function BuscarTicketPagado(ticketobjeto){
    $.ajax({
        type: 'POST',
        url: basePath + 'BuscarTicketFk',
         data: {
            '_token': $('input[name=_token]').val(),
            'datos':ticketobjeto
        },
        beforeSend:function(){
            toastr.options=opciones_toast_mantener;
            modal_buscarticket_parapagar= toastr.info(" Buscando Ticket "+ticketobjeto.idTicket+" ...")
            toastr.options={};
        },
        success: function (response) {
            modal_buscarticket_parapagar.hide();
            $("#modal_buscar_pagados #btn_buscar_ticket").LoadingOverlay("hide");
            $("#modal_buscar_pagados #btn_buscar_ticket").attr("disabled",false);
            $("#modal_buscar_pagados #modal_imprimir_pago #imagen_apuestatotal").attr("src",basePath+"img/logoticket.png");

            ticketbuscado=response.ticketbuscado;
            ticketsganadores=response.tickets;
            resultados_evento=response.resultados_evento;
            apuestasticket=response.apuestas_ticket;
            idEvento_ticket=response.idEvento_ticket;
            conf_general=response.conf_general;
             ganadores="";
             if(apuestasticket.length==0){
                toastr.error("Ticket "+ ticketbuscado +" no está registrado");return;
             }
            if(apuestasticket[0].idPuntoVenta!=$("#idPuntoVenta").val()){

                if(conf_general.CobrarTicket==0){/*permitir cobrar ;  0=> no permitir cobrar en dif p venta al tick*/
                    toastr.error("Ticket de Diferente Punto de Venta :"+apuestasticket[0].PuntoVentaNombre);return;
                }
            }
            if(apuestasticket[0].estadoTicket===0){
                    toastr.error("Ticket "+apuestasticket[0].idTicket +" está Cancelado");return;
            }
             if(ticketsganadores.length>0){

                if(ticketsganadores[0].estadoTicket==0){toastr.error("Ticket"+ ticketbuscado+ " Anulado");return false;}
                // if(ticketsganadores[0].estadoTicket==2){toastr.error("Ticket "+ ticketbuscado+" Pagado");return false;}
                if(ticketsganadores[0].estadoTicket==3){toastr.error("Ticket "+ ticketbuscado+" Suspendido");return false;}
                if(ticketsganadores[0].estadoTicket==1){toastr.error("Ticket "+ ticketbuscado+" No Cobrado");return false;}

                //GuardarGanadorEvento(ticketsganadores,ticketsganadores[0].idTicket);

                TICKET_IMPRIMIR_pago={};
                TICKET_IMPRIMIR_pago.ImagenSrc=eventoactual.Imagen;
                TICKET_IMPRIMIR_pago.Id_Ticket=ticketsganadores[0].idTicket;
                TICKET_IMPRIMIR_pago.Id_Unidad=CC_ID //eventoactual.IdEvento;
                TICKET_IMPRIMIR_pago.Nro_Evento=ticketsganadores[0].idEvento;
                TICKET_IMPRIMIR_pago.Desc=ticketsganadores[0].EventoNombre;
                totales=sacar_totales_y_maximo();
                TICKET_IMPRIMIR_pago.ImpresoEn=moment(new Date()).format("DD-MM-YYYY HH:mm a");
                TICKET_IMPRIMIR_pago.ImpresoPor=USUARIO;
                TICKET_IMPRIMIR_pago.PremioMaximoAPagar=ticketsganadores[0].apuestaMaxima ;
                TICKET_IMPRIMIR_pago.CantidadGanada=0;

                TICKET_IMPRIMIR_pago.apuestaMinimaJuego=eventoactual.apuestaMinimaJuego;
                TICKET_IMPRIMIR_pago.apuestaMaximaJuego=eventoactual.apuestaMaximaJuego;

                apuestas=[];
                totalticket=0;
                $(ticketsganadores).each(function(i,e){
                        fila_apuesta={};
                        var tr=e;
                            fila_apuesta.evento=e.idEvento;
                            fila_apuesta.descripcion=e.TipoApuestaNombre;
                            var apuestafila=(parseFloat(e.multiplicadorApuestaGanada)*parseFloat(e.montoApostado));
                            fila_apuesta.apuesta=apuestafila.toFixed(2);
                            totalticket=totalticket+apuestafila;
                            apuestas.push(fila_apuesta);
                })

                TICKET_IMPRIMIR_pago.TotalTicket=parseFloat(totalticket).toFixed(2);
                TICKET_IMPRIMIR_pago.apuestas=apuestas;
var modal=$("#modal_imprimir_pago");
                $("#modal_imprimir_pago #divimpresion_pago #IDTique").text(TICKET_IMPRIMIR_pago.Id_Ticket)
                $("#modal_imprimir_pago #divimpresion_pago #IDUnidad").text(TICKET_IMPRIMIR_pago.Id_Unidad)
                $("#modal_imprimir_pago #divimpresion_pago #NroEvento").text(TICKET_IMPRIMIR_pago.Nro_Evento)
                $("#modal_imprimir_pago #divimpresion_pago #descripcion").text(TICKET_IMPRIMIR_pago.Desc)
                $("#modal_imprimir_pago #divimpresion_pago #datos_filas").empty();
                $(TICKET_IMPRIMIR_pago.apuestas).each(function(i,e){
                    $("#modal_imprimir_pago #divimpresion_pago #datos_filas").append($("<div>").attr("style","width:100%;display:table")
                            .append(
                            $("<div>").attr("style","width:38%;float:LEFT;text-align:left").text(e.evento)
                                )
                            .append(
                            $("<div>").attr("style","width:47%;float:LEFT;text-align:left").text(e.descripcion)
                                )
                              .append(
                            $("<div>").attr("style","width:15%;float:LEFT;text-align:left").text(e.apuesta)
                                )
                    )
                })

                var totalpagar_ticket=TICKET_IMPRIMIR_pago.TotalTicket;
                if(parseFloat(TICKET_IMPRIMIR_pago.TotalTicket)>parseFloat(eventoactual.apuestaMaxima)){
                    totalpagar_ticket=eventoactual.apuestaMaxima;
                }
                $("#modal_imprimir_pago #divimpresion_pago #total_ticket").text(divisa +" "+totalpagar_ticket);
                $("#modal_imprimir_pago #divimpresion_pago #impreso_en").text(moment(new Date()).format("YYYY-MM-DD HH:mm:ss"));
                $("#modal_imprimir_pago #divimpresion_pago #impreso_por").text(TICKET_IMPRIMIR_pago.ImpresoPor);
                $("#modal_imprimir_pago #divimpresion_pago #impreso_por2").text($("#tienda").val());
                $("#modal_imprimir_pago #divimpresion_pago #PremioMaximoAPagar").text(divisa +" "+parseFloat(TICKET_IMPRIMIR_pago.PremioMaximoAPagar).toFixed(2));
                $("#modal_imprimir_pago #divimpresion_pago .imagen img").attr("src",TICKET_IMPRIMIR_pago.ImagenSrc);

                $("#modal_imprimir_pago #btnimprimir").off("click").on("click",function(){
                    Imprimir($("#divimpresion_pago",modal));

                })
                setTimeout(function(){
                    $("#modal_imprimir_pago #btnimprimir").click();
                },1000);

                $("#modal_imprimir_pago").modal("show");
                toastr.success(" Ticket "+ticketbuscado +" Evento "+" #"+idEvento_ticket);
             }
             else{
                toastr.error("Ticket "+ticketbuscado+ " Evento "+" #"+idEvento_ticket+"<br>No hay Apuestas Ganadoras");
             }
           
        },
         error:function(){
            modal_buscarticket_parapagar.hide();
            
        },
        complete:function(){
            modal_buscarticket_parapagar.hide();

        }
    })

}



function BuscarTicketparaCancelar(ticketobjeto){
     var modal=$("#modal_buscar_para_reimprimir_cancelar_ticket");

    $.ajax({
        type: 'POST',
        url: basePath + 'BuscarTicket_paraCancelarFk',
         data: {
            '_token': $('input[name=_token]').val(),
            'datos':ticketobjeto
        },
        beforeSend:function(){
            toastr.options=opciones_toast_mantener;
            modal_buscarticket_paracancelar= toastr.info("Buscando Ticket "+ticketobjeto.idTicket+" ...")
            toastr.options={};
        },
        success: function (response) {
            modal_buscarticket_paracancelar.hide();
            $("#btn_buscar_ticket",modal).LoadingOverlay("hide");
            $("#btn_buscar_ticket",modal).attr("disabled",false);
            $("#imagen_apuestatotal",modal).attr("src",basePath+"img/logoticket.png");
            mensaje=response.mensaje;
            ticketbuscado=response.ticketbuscado;
            TicketCabecera=response.TicketCabecera;
            TicketApuestas=response.TicketApuestas;
            conf_general=response.conf_general;

           if(mensaje!=""){
                    toastr.info(mensaje);
           }

             if(TicketCabecera!=null){
                if(TicketCabecera.idPuntoVenta!=$("#idPuntoVenta").val()){
                        if(conf_general.CobrarTicket==0){/*permitir cobrar ;  0=> no permitir cobrar en dif p venta al tick*/
                            toastr.error("Ticket de Diferente Punto de Venta : \n"+TicketCabecera.tienda);return;
                        }
                }

                TICKET={};
                TICKET.logo=TicketCabecera.logo;
                TICKET.Id_Ticket=TicketCabecera.idTicket;
                TICKET.Id_Unidad=TicketCabecera.IdUnidad //eventoactual.IdEvento;
                TICKET.ImpresoEnUbicacion=TicketCabecera.ImpresoEn
                TICKET.Nro_Evento=TicketCabecera.Nro_Evento;
                TICKET.Desc=TicketCabecera.Descr;
                TICKET.ImpresoEn=TicketCabecera.ImpresoEn
                TICKET.ImpresoPor=TicketCabecera.usuario;
                TICKET.PremioMaximoAPagar=TicketCabecera.apuestaMaxima ;
                TICKET.CantidadGanada=0;
                TICKET.premioMaximoPagar=TicketCabecera.PremioMaximoPagar;
                TICKET.premioMaximoPotencial=TicketCabecera.PremioMaximoPotencial;
                TICKET.codigo_barra_src=TicketCabecera.codigo_barra_src;
                TICKET.qrcode_src=TicketCabecera.qrcode_src;
                TICKET.simbolo=TicketCabecera.simbolo;
                apuestas=[];
                totalticket=0;
                $(TicketApuestas).each(function(i,e){
                        fila_apuesta={};
                        fila_apuesta.evento=e.idEvento;
                        fila_apuesta.descripcion=e.descripcion;
                        fila_apuesta.montoApostado=e.montoApostado;
                        fila_apuesta.multiplicadorDefecto=e.multiplicadorDefecto;
                        totalticket=parseFloat(totalticket)+parseFloat(e.montoApostado);
                        apuestas.push(fila_apuesta);
                })
                TICKET.TotalTicket=parseFloat(totalticket).toFixed(2);
                TICKET.apuestas=apuestas;

                GeneralTicketModal(TICKET);
             }
             else{
                var $botonbuscar_ticket=$("#modal_buscar_para_reimprimir_cancelar_ticket #btn_buscar_ticket");
                $botonbuscar_ticket.attr("disabled",false);
                $botonbuscar_ticket.LoadingOverlay("hide");

//                    toastr.info(response.mensaje);

             }
           
        },
        error: function (jqXHR, textStatus, errorThrown) {
            modal_buscarticket_paracancelar.hide();
            toastr.error("Error al Buscar Ticket");
        },
        complete:function(){

            $("#btn_buscar_ticket",modal).LoadingOverlay("hide");
            $("#btn_buscar_ticket",modal).attr("disabled",false);
        }
    })

}

function CancelarTicket(idTicket,idEvento){
    ticketobjeto={'idTicket':idTicket,
            'idEvento':idEvento};
    $.ajax({
        type: 'POST',
        url: basePath + 'Cancelar_TicketFk',
        beforeSend:function(){
            toastr.options = opciones_toast_mantener;
            modal_cancelar_ticket=toastr.info("Cancelando Ticket "+idTicket+" ...");
            toastr.options ={};

        },
         data: {
            '_token': $('input[name=_token]').val(),
            'datos':ticketobjeto
        },
        success: function (response) {
            modal_cancelar_ticket.hide();

            a=response;
            toastr[response.tipo](response.mensaje);
        },
        error:function(){
            modal_cancelar_ticket.hide();
            toastr.error("Error al Cancelar Ticket "+idTicket);
        }
        
    })

}

function GuardarGanadorEvento(apuestas_ganadoras,idTicket){/////GuardarGanadorEvento EN tabla Ganador_Evento
 $.ajax({
        type: 'POST',
        async:false,
        url: basePath + 'GuardarGanadorEventoFk',
         data: {
            '_token': $('input[name=_token]').val(),
            'apuestas':apuestas_ganadoras,
            'idTicket':idTicket,
            'idAperturaCaja':$("#idAperturaCaja").val()
        },
        success: function (response) {
            if(response.respuesta){
                toastr.success("Ticket Pagado");
            }
        },
    })

}

function GuardarTicket(ticketobjeto_imprimir){/////GUARDATICKET EN TICKET Y APUESTAS , ABRE MODAL
    TicketObjeto={};
    TicketObjeto.idAperturaCaja=IDAPERTURACAJA;
    TicketObjeto.idEvento=eventoactual.IdEvento;
    TicketObjeto.codigoQR=eventoactual.IdEvento;
    TicketObjeto.nroTicketParticipante=eventoactual.IdEvento
    TicketObjeto.ganador=0;
    TicketObjeto.estadoTicket=1;

    TicketObjeto.ApuestaMinimaJuego=eventoactual.apuestaMinimaJuego;
    TicketObjeto.ApuestaMaximaJuego=eventoactual.apuestaMaximaJuego;

    TicketObjeto.ApuestaMinima=eventoactual.apuestaMinima;
    TicketObjeto.ApuestaMaxima=eventoactual.apuestaMaxima;
    TicketObjeto.PremioMaximoPagar=eventoactual.apuestaMaxima;
    TicketObjeto.PremioMaximoPotencial=eventoactual.apuestaMaxima;


    TicketObjeto.PremioMaximoPotencial_guardar=ticketobjeto_imprimir.PremioMaximoPotencial_guardar;
    TicketObjeto.PremioMaximoPagar_guardar=ticketobjeto_imprimir.PremioMaximoPagar_guardar;


    Apuestas=[];
    $(ticketobjeto_imprimir.apuestas).each(function(i,e){
        ApuestaObjeto={}
        ApuestaObjeto.idTicket=null;
        ApuestaObjeto.idTipoApuesta=e.idtipoapuesta;
        ApuestaObjeto.idTipoPago=e.idtipopago;
        ApuestaObjeto.idMoneda=eventoactual.idMoneda;
        ApuestaObjeto.montoApostado=e.apuesta;
        ApuestaObjeto.montoAPagar=0;
        ApuestaObjeto.ganador=0;
        ApuestaObjeto.ZonaComercial=0;///en controlador
        ApuestaObjeto.multiplicadorDefecto=e.cuota;///en controlador
        Apuestas.push(ApuestaObjeto);
    })

    ticketobjeto_imprimir.ApuestaMinimaJuego=eventoactual.apuestaMinimaJuego;
    ticketobjeto_imprimir.ApuestaMaximaJuego=eventoactual.apuestaMaximaJuego;

    ticketobjeto_imprimir.ApuestaMinima=eventoactual.apuestaMinima;
    ticketobjeto_imprimir.ApuestaMaxima=eventoactual.apuestaMaxima;

    datosobjeto={};
    datosobjeto.TicketObjeto=TicketObjeto;
    datosobjeto.Apuestas=Apuestas;
    datosobjeto.idUbigeo=$("#idUbigeo").val();
    datosobjeto.idPuntoVenta=$("#idPuntoVenta").val();


    var totales_maximo=sacar_totales_y_maximo();
    TicketObjeto.montoTotal=totales_maximo.total;

    $.ajax({
        type: 'POST',
        url: basePath + 'GuardarTicketFk', 
         data: {
            '_token': $('input[name=_token]').val(),
            'datos':datosobjeto
        },
        beforeSend:function(){
            $.LoadingOverlay("show");
            detenerHistorialJackpot();
           // detenerContador();
            modalguardarticket=toastr.info("...Guardando Ticket");
        },
        success: function (response) {
            LimpiarApuestas()
            $.LoadingOverlay("hide");
            if(typeof response.id_ticketinsertado=="undefined" ){
                toastr.error(response.mensaje);return ;
            }
            ticketdata=response.id_ticketinsertado;
            idticket=ticketdata.idTicket;
            // ImprimirJson(ticketobjeto_imprimir,idticket);
            ///nuevo
            codigo_barrahtml=response.codigo_barrahtml;
            qrcode_src=response.qrcode_src;
            codigo_barra_src=response.codigo_barra_src;
            ImprimirJson2(ticketobjeto_imprimir,idticket,response);
            //
            $("#divimpresion #IDTique").text(idticket);
            $("#modal_imprimir").modal("show");
            // TICKET_IMPRIMIR={}
            toastr.success("Ticket Guardado");
            //$("#div_botones .cerrar").click();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            modalguardarticket.hide();
            toastr.error("Error al Guardar Ticket,  Recargar Página");
            $.LoadingOverlay("hide")
            $("#recargar_tabla").text("RECARGAR").show();
        }
    })
}

/////IMPRIMIR DEL NAVEGADOR
function ImprimirAnt($elem)
{
    //////CONFIGURAR NAVEGADOR   MARGENES =>  NINGUNO
    console.log("Imprimiendi")
    var mywindow = window.open('', 'PRINT', 'height=800,width=700');
     // mywindow.document.write('<html><head><title>' + document.title  + '</title>');
    mywindow.document.write('<html><head>');
    mywindow.document.write('</head><body>');
    //mywindow.document.write('<h1>' + document.title  + '</h1>');
    var oContent = $elem.html();//document.getElementById(elem).innerHTML;

    mywindow.document.write(oContent);
    mywindow.document.write('</body></html>');
    mywindow.document.close(); // necessary for IE >= 10
    mywindow.focus(); // necessary for IE >= 10*/
    mywindow.print();
    console.log("fin impresion");
     // setTimeout(function () { window.close();alert("termino imprimir") }, 100);
    mywindow.close();
    return true;
}

function Imprimir($elem){
   try{
       var oIframe = document.getElementById('ifrmPrint');
     if($("#iframeimpresion").length>0){
       $("#iframeimpresion").remove();
     }
     var oIframe = document.createElement("iframe");
        oIframe.setAttribute("id", "iframeimpresion");
    oIframe.style.display="none";   
     oIframe.style.width="800";   
     oIframe.style.height="700";   
     document.body.appendChild(oIframe);
     
        var oContent = $elem.html();//document.getElementById(elem).innerHTML;
        var oDoc = (oIframe.contentWindow || oIframe.contentDocument);
        if (oDoc.document) oDoc = oDoc.document;
        oDoc.write('<head><title>title</title>');
        oDoc.write('</head><body onload="this.focus(); this.print();">');
        oDoc.write(oContent + '</body>');
        oDoc.close();
      } catch(e){
        console.log(e)
        self.print();
      }

}
function LimpiarApuestas(){
    if($("#tabla_eventos tbody tr").length!="0"){
        $("#div_botones .cerrar").click();
    }
}

function EventoDatosJsonNuevo(divelemento,idEvento,idPuntoVenta,segundosantesbloqueo) {
    IDPUNTOVENTA=idPuntoVenta;
    IDEVENTO=idEvento;
    SEGBLOQUEOANTESEVENTO=segundosantesbloqueo;
            jugador=$(divelemento).attr("data-jugador");
            divisa=$(divelemento).attr("data-divisa");
            jackpotsuma=$(divelemento).attr("data-jackpotsuma");
            idevento=$(divelemento).attr("data-id");
            $("#row_datosevento #jugador").text(jugador);
            $("#row_datosevento #divisa").text(divisa);
            $("#row_datosevento #jackpotsuma").text(divisa+" "+jackpotsuma);

             $("#valor_total .val").text("0.00");
             $("#valor_total .div").text(divisa);
            $("#valor_maximo .val").text("0.00");
            $("#valor_maximo .div").text(divisa);

            $(".apuesta span").text("APUESTA "+divisa);
            LimpiarApuestas();
            if(socket!=null && socket.readyState==1){
                console.warn("YA CONECTADO, pedir hora")
                pedir_hora_server();
            }else{
                console.warn("INICIANDO CONEXIÓN ");
                connectarWebSockets(IPSERVIDOR_WEBSOCKETS,PUERTO_WEBSOCKETS);  ///en archivo ClaseWebSockets.js
            }
            // connectarWebSockets(IPSERVIDOR_WEBSOCKETS,PUERTO_WEBSOCKETS);  ///en archivo ClaseWebSockets.js
       
                eventoactual={};
                eventoactual.FechaEvento=$(divelemento).attr("data-FechaEvento");
                eventoactual.fechaFinEvento=$(divelemento).attr("data-fechaFinEvento");
                eventoactual.nombre=$(divelemento).attr("data-nombre");
                eventoactual.IdEvento=idevento;
                eventoactual.apuestaMinima=$(divelemento).attr("data-apuestaMinima");
                eventoactual.apuestaMaxima=$(divelemento).attr("data-apuestaMaxima");

                eventoactual.apuestaMinimaJuego=$(divelemento).attr("data-apuestaMinimaJuego");
                eventoactual.apuestaMaximaJuego=$(divelemento).attr("data-apuestaMaximaJuego");

                eventoactual.segBloqueoAntesEvento=$(divelemento).attr("data-segBloqueoAntesEvento");
                eventoactual.idMoneda=$(divelemento).attr("data-idMoneda");
                eventoactual.Imagen="img/juegos/"+$(divelemento).attr("data-logo");
                eventoactual.divisa=divisa;

                if(typeof ajax_historial!=="undefined"){ajax_historial.abort(); }
                ajax_historial=HistorialJackpotDatosJson($("#idPuntoVenta").val(),eventoactual.IdEvento);

                $("#modal_imprimir #imagen_evento").attr("src","img/juegos/"+$(divelemento).attr("data-logo"));
                    setTimeout(function(){
                                    $(".TOMBOLACUY").css("cursor","");
                                    $(".TOMBOLACUY").show();
                    },500);
                $("#modal_imprimir_cancelar #imagen_evento").attr("src","img/juegos/"+$(divelemento).attr("data-logo"));
                setTimeout(function(){
                                $(".TOMBOLACUY").css("cursor","");
                                $(".TOMBOLACUY").show();
                },500)
                    
        ///fin jackpot
   
}///FIN EventoDatosJson


function responsivetombola(){
    barralateral_visible=$(".sidebar .nav-sidebar").is(":visible");
    if(!barralateral_visible){
        $(".CONTENEDOR_TOMBOLACUY").css("padding-left","3px");
    }
    else{
        $(".CONTENEDOR_TOMBOLACUY").css("padding-left","53px");

    }
    heighttbody=$(".rowtablaeventos").outerHeight()-$("#tabla_eventos thead tr").height()
    $("#tabla_eventos tbody").attr("style","height:"+heighttbody+"px")

        $(".responsive").each(function(i,e){
            var height = $(e).height();
            $(e).css({
                'font-size': (height/2) + 'px',
                'line-height': height + 'px'
            })
        })
}

function detenerRelojServidor(){
     if(typeof intervalo_horaservidor!="undefined"){
        clearInterval(intervalo_horaservidor)
        delete intervalo_horaservidor;
    }
}
function detenerContador(){
     if(typeof intervalo_contador!="undefined"){
            clearInterval(intervalo_contador);
            delete intervalo_contador;
     }
}

function detenerHistorialJackpot(){
    DETENER_HISTORIALJACKPOT=true;
        if(typeof llamada_ajax!=="undefined"){
            llamada_ajax.abort();
        }
        if(typeof TIMEOUT_HistorialJackpotDatosJson!=="undefined"){
             clearInterval(TIMEOUT_HistorialJackpotDatosJson);
        }
    //  if(typeof intervaloihistorialjackpot!="undefined"){
    //         clearInterval(intervaloihistorialjackpot);
    //         delete intervaloihistorialjackpot;
    //  }
}

function activarBarraLoading(tiempo_total_en_seg){
        // $("#barra_loading").animate({width:"0"},(duration-segundosantesbloqueo)*1000);
        $("#barra_loading").animate({width:"0"},(tiempo_total_en_seg)*1000);
}
function crear_loadingoverlay_contador(){
      $.LoadingOverlay("show",{image:OPCIONES_CAJA.imagen_loadingoverlay_contador})
      $(".loadingoverlay").append($('<div id="contador_overlay" style="position: relative; left: 6%;width:7%;height: 10%; text-align:center;font-size:8vh;color:red">--</div>'))
}
function ocultar_loadingoverlay_contador(){
    $.LoadingOverlay("hide");
    $("#contador_overlay").remove();
}
function modal_abierto(){
    if($('.modal:visible').length && $('body').hasClass('modal-open')){
        return true;
    }
    return false;
}

function iniciarContador(duration, display,segundosantesbloqueo) {
    tiempototal=duration;
    var timer = duration, minutos, segundos;

    detenerContador();
    intervalo_contador=setInterval(function () {
        minutos = parseInt(timer / 60, 10);
        segundos = parseInt(timer % 60, 10);    
        minutos = minutos < 10 ? "0" + minutos : minutos;
        segundos = segundos < 10 ? "0" + segundos : segundos;
        display.text(minutos + ":" + segundos);
       // ///////segundos bloqueo
           segantesdebloque=segundosantesbloqueo;
        if(RECARGAR_TOMBOLA){
            if(minutos==0 && segundos<=segantesdebloque){
                detenerHistorialJackpot();
                if($("#contador_overlay").length==0){
                      crear_loadingoverlay_contador();
                }
                if($("#contador_overlay").length>0){
                        $("#contador_overlay").text(segundos)
                    }
            }
            else{
               segundostotales= parseInt((parseInt(minutos)*60))+parseInt(segundos);
              if(segundostotales==segantesdebloque){
                 $.LoadingOverlay("show",{image:OPCIONES_CAJA.imagen_loadingoverlay_contador})
              }
            }
            if(minutos==0 && segundos==0){
                detenerContador();
                  setTimeout(function(){
                    ocultar_loadingoverlay_contador();
                    CargarTabla();
                  },2000);
            }
        }

              //fin segundos bloqueo
            //  timer--;
            if (--timer < 0) {
                timer =0;// duration;
            }
    }, 1000);
    // console.info(" dura : "+duration);
    // console.info(" dura : "+segundosantesbloqueo);
    setTimeout(function(){
        activarBarraLoading(duration-segundosantesbloqueo);
    },1000);
}
function ContadorProximoEvento(horaserv,fechaFinEvento,segundosantesbloqueo){
    proxima_fecha=moment(fechaFinEvento, "YYYY-MM-DD HH:mm:ss a");
    ahora=moment(horaserv);
    segundos=proxima_fecha.diff(ahora,'seconds');
    $("#proximo_en2").text("--");
    if(segundos>0){
        iniciarContador(segundos, $("#proximo_en2"),segundosantesbloqueo) ;
    }
    else{
        if(typeof intervalo_contador!="undefined"){
            clearInterval(intervalo_contador) 
        }
    }
    //console.log("proximo_en2 ="+segundos);
    console.log(horaserv);
}
function reloj_websockets(horaserv,fechaFinEvento,segundosantesbloqueo){
    detenerRelojServidor();
    intervalo_horaservidor=setInterval(function(){
                            horaserv=new Date(horaserv);
                            horaserv=horaserv.setSeconds(horaserv.getSeconds()+1)
                            horaserv=new Date(horaserv);

                            hora=horaserv.getHours();
                            minutos=horaserv.getMinutes();
                            segundos=horaserv.getSeconds();
                            var dn = "PM";
                            if (hora < 12){
                                dn = "AM";
                            }
                            if (hora > 12){
                                hora = hora - 12;
                            }
                            if (hora == 0){
                                hora = 12;
                            }
                            if (minutos <= 9){
                                minutos = "0" + minutos;
                            }
                            if (segundos <= 9){
                                segundos = "0" + segundos;
                            }
                            hora_servidor_final=hora
                                                +":"+minutos
                                                +":"+segundos
                                                +" "+dn;
                            $('#fechaServidor').text(hora_servidor_final);
                        },1000)
}



function eventos_botones(){

    $(".eventos_fila_der #recargar_boton").off().on("click",function(){
            CargarTabla();
    })

    $(".eventos_fila_der #reimprimir").off().on("click",function(){

            mostrar_modal_reimprimir_ticket();
            // mostrar_modal_pagados();
    })

 

     $(".eventos_fila_der #reimprimir_o_cancelar").off().on("click",function(){
            mostrar_modal_buscar_para_reimprimir_cancelar_ticket();
    })
    
    $(".eventos_fila_der #cancelar").off().on("click",function(){
         if(typeof eventoactual=="undefined"){toastr.error("No hay Evento");return;}
            if(typeof intervalo_contador=="undefined"){
                toastr.error("Evento Actual "+eventoactual.IdEvento+" Ya Finalizó,   Recargar Página");
                return;
            }

            mostrar_modal_cancelar_ticket();
           
    })

    /////botones numeros  SELECCIONADO CLASE
    $(".apuestasadicionalescontenedor .apuestacondicional_fila .apuestacondicional_fila_datos div")
        .off()
        .on("click",function(e){ 
            var idtipo_ap=$(this).data("idtipoapuesta");
            apu=get_apuestas();
            ESTA=esta_ingresado(apu,idtipo_ap);
            if(!ESTA){
                $(this).css("cursor","pointer")
                $(this).toggleClass("seleccionado") ;
            }
            else{
                $(this).css("cursor","not-allowed")
            }
            //$(this).toggleClass("seleccionado") ;

        })
    /////finbotones numeros

    ///nuevo
    $("#numeros_tabla2 .numeros_rect2 div")
        .off()
        .on("click",function(e){ 
            var idtipo_ap=$(this).data("idtipoapuesta");
            apu=get_apuestas();
            ESTA=esta_ingresado(apu,idtipo_ap);
            if(!ESTA){
                $(this).css("cursor","pointer")
                $(this).toggleClass("seleccionado") ;
            }
            else{
                $(this).css("cursor","not-allowed")
            }
               // $(this).toggleClass("seleccionado") ;
    })
    ///fin nueo

    //////botones apuesta  1 2 5  10 50 100
       $("#div_apuestas [data-tipo='apuesta']").off().on("click",function(e){

            if(typeof eventoactual!="undefined"){ 
                $(this).toggleClass("seleccionadoapuesta") ;
                var SUMAAPUESTAS=0;
                $("#div_apuestas .seleccionadoapuesta").each(function(ii,ee){
                SUMAAPUESTAS=SUMAAPUESTAS+$(ee).data("valor");
                })
                divisa=divisa.toString()=="[object HTMLSpanElement]"?" ":divisa;
                $(".rowtableeventos_footer_apuesta").text("APUESTA "+divisa+" "+SUMAAPUESTAS);
            }
            else{
                toastr.error("No hay evento,  Recargar")
            }
        })

    /////BOTONESSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS  DINERODEFAULT

    ///boton check
    $("#div_botones .check").off().on("click",function(){
            ID_EVENTO=$(".id_tituloconfiguracionevento").text();
            if(ID_EVENTO==""){
                toastr.error("No hay Evento");return;
            }
            cantidadapuesta=$("#div_apuestas .seleccionadoapuesta").length;
             SUMAAPUESTAS=0;
            $("#div_apuestas .seleccionadoapuesta").each(function(i,e){
                SUMAAPUESTAS=SUMAAPUESTAS+$(e).data("valor");
            })
            if(cantidadapuesta==0){
                toastr.error("Seleccione Apuesta")
                return false;
            }
            cantidadnumeros=$(".apuestacondicional_fila_datos .seleccionado,#numeros_tabla2 .seleccionado,#numeros_tabla .seleccionado, .rectangulo_izquierda.seleccionado").length;
            if(cantidadnumeros==0)
            {
                toastr.error("Seleccione Número")
                return false;
            }
    //        apuesta_fila=parseFloat(SUMAAPUESTAS/cantidadnumeros).toFixed(2);
            apuesta_fila=parseFloat(SUMAAPUESTAS).toFixed(2);
            if(apuesta_fila<1){
                toastr.error("La apuesta no puede ser mínima al menor");
                 apuesta_fila=1;
            }
            array_apuestas_json=generar_json_apuestas();
            FILA_PARA_TABLA={};
            //$("#numeros_tabla .seleccionado , .rectangulo_izquierda.seleccionado")
            $(".apuestacondicional_fila_datos .seleccionado,#numeros_tabla2 .seleccionado,#numeros_tabla .seleccionado, .rectangulo_izquierda.seleccionado")
            // $("#numeros_tabla .seleccionado")
            .each(function(i,e){
               array_apuestas_json=generar_json_apuestas();
                valornumero=$(e).data("valor");
                tiponumero=$(e).data("tipo");
                idTipoPago=$(e).data("idtipopago");
                colornumero=$(e).data("color");
                color2=$(e).data("color2");
                descripcion=$(e).data("descripcion");
                valornumero=$(e).data("valor");
                idtipopago=$(e).data("idtipopago");
                idtipoapuesta=$(e).data("idtipoapuesta");
                if(idtipopago.toString()=="2"){
                    valornumero=colornumero;
                }
                cuota=$(e).data("cuota");
                apostado=false;
                //console.log(array_apuestas_json);
                $(array_apuestas_json).each(function(ii,ee){
                    if((ee.SELECCION).toString()==valornumero.toString()){
                        apostado=true;
                    }
                })
                console.log("apostado "+apostado+" "+valornumero)
                if(!apostado){   ////*SI NO FUE APOSTADO AUN SE  AGREGA TR A TABLA */
                    //cuota=tiponumero=="numero"?10:tiponumero=="rango"?10:tiponumero=="pares"?11:tiponumero=="impares"?14:15;
                    FILA_PARA_TABLA.ID_EVENTO=ID_EVENTO;
                    FILA_PARA_TABLA.SELECCION= valornumero;
                    FILA_PARA_TABLA.CUOTA= cuota;
                    FILA_PARA_TABLA.APUESTA= apuesta_fila;

                    var tr_tabla=$("#tabla_eventos tbody tr td:first-child:contains('-')").eq(0);
                    if(tr_tabla.length==0){

                         $("#tabla_eventos tbody").append(
                                $("<tr>")
                                    .attr("data-tipo",tiponumero)
                                    .attr("data-color",colornumero)
                                    .attr("data-color2",color2)
                                    .attr("data-descripcion",descripcion)
                                    .attr("data-valor",valornumero)
                                    .attr("data-idTipoPago",idTipoPago)
                                    .attr("data-idtipoapuesta",idtipoapuesta)
                                    .append(
                                            $("<td>").text(FILA_PARA_TABLA.ID_EVENTO)
                                            )
                                    .append(
                                            $("<td>").text(FILA_PARA_TABLA.SELECCION)
                                            )
                                    .append(
                                            $("<td>").text(FILA_PARA_TABLA.CUOTA)
                                            )
                                    .append(
                                            $("<td>").text(parseFloat(FILA_PARA_TABLA.APUESTA).toFixed(2))
                                                    .append($("<div>").addClass("divcerrarfila").append($('<i class="icon  fa fa-close" style="display:inline"></i>')))
                                            )
                            )
                         $(".divcerrarfila").off("click").on("click",function(){

                                var idtip=$(this).closest("tr").data("idtipoapuesta");
                                $(".apuestasadicionalescontenedor .apuestacondicional_fila .apuestacondicional_fila_datos div[data-idtipoapuesta="+idtip+"],#numeros_tabla2 .numeros_rect2 div[data-idtipoapuesta="+idtip+"]")
                                    .css("cursor","pointer");
                                $(this).closest("tr").remove();
                                var totales_maximo=sacar_totales_y_maximo();
                                $(".apuesta .rowtableeventos_footer_apuesta").text();
                                $("#valor_total .val").text(parseFloat(totales_maximo.total).toFixed(2));
                                $("#valor_total .div").text(divisa);

                                $("#valor_maximo .val").text(parseFloat(totales_maximo.maximo).toFixed(2));
                                $("#valor_maximo .div").text(divisa);

                         });
                    }
                    else{
                        tr_tabla=tr_tabla.parent();
                        tr_tabla.attr("data-tipo",tiponumero)       ;                 
                        tr_tabla.attr("data-color",colornumero)       ;   
                        tr_tabla.attr("data-valor",valornumero)       ;   

                        $("td",tr_tabla).eq(0).text(FILA_PARA_TABLA.ID_EVENTO)
                        $("td",tr_tabla).eq(1).text(FILA_PARA_TABLA.SELECCION)
                        $("td",tr_tabla).eq(2).text(FILA_PARA_TABLA.CUOTA)
                        $("td",tr_tabla).eq(3).text(parseFloat(FILA_PARA_TABLA.APUESTA).toFixed(2))
                    }
                    var totales_maximo=sacar_totales_y_maximo();

                    $("#valor_total .val").text(parseFloat(totales_maximo.total).toFixed(2));
                    $("#valor_total .div").text(divisa);
                    $("#valor_total .div").text(divisa);

                     $("#valor_maximo .val").text(parseFloat(totales_maximo.maximo).toFixed(2));
                    $("#valor_maximo .div").text(divisa);

                }
                else{
                    toastr.error("Ya ingresó  "+valornumero);
                }
            })///fin numerotabla seleccionados

            $(".apuestacondicional_fila_datos .seleccionado,#numeros_tabla2 .seleccionado,#numeros_tabla .seleccionado, .rectangulo_izquierda.seleccionado")
                .removeClass("seleccionado")
                

        $("#numeros_tabla .seleccionado").removeClass("seleccionado");

    })////FINNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNN on click boton check

        ///BOTON CERRAR  -- BORRAR
        $("#div_botones .cerrar").off().on("click",function(){
                     $(".apuestacondicional_fila_datos div")
                    .css("cursor","pointer");
                    $("#numeros_tabla2 .numeros_rect2 div")
                    .css("cursor","pointer");

            if($("#tabla_eventos tbody tr").length=="0"){
                toastr.error("No hay Apuestas");
            }else{
                idtabla="tabla_eventos";
                $("tbody","#"+idtabla).empty();
                var totales_maximo=sacar_totales_y_maximo();
                $("#valor_total .val").text(parseFloat(totales_maximo.total).toFixed(2));
                $("#valor_total .div").text(divisa);
                $("#valor_maximo .val").text(parseFloat(totales_maximo.maximo).toFixed(2));
                $("#valor_maximo .div").text(divisa);

            }
        // $("#numeros_tabla .apostado").removeClass("apostado");
        })

           ///BOTON BUSCAR
        $("#div_botones .barcode").off().on("click",function(){
             $("#modal_buscar").modal("show"); 
        })

        ///BOTON IMPRIMIR
        $("#div_botones .print").off().on("click",function(){
            if(typeof eventoactual=="undefined"){toastr.error("No hay Evento");return;}
            if(typeof intervalo_contador=="undefined"){
                toastr.error("Evento Actual "+eventoactual.IdEvento+" Ya Finalizó,   Recargar Página");
                return;
            }

            if($("#tabla_eventos tbody tr").length=="0"){
                toastr.error("No hay Apuestas");
            }
            else{
                 $("#imagen_qrcode").attr("src","");
                $("#imagen_codigobarra").attr("src","");

                TICKET_IMPRIMIR={};
                TICKET_IMPRIMIR.ImagenSrc=eventoactual.Imagen
                TICKET_IMPRIMIR.Id_Ticket=0;
                TICKET_IMPRIMIR.Id_Unidad=CC_ID //eventoactual.IdEvento;
                TICKET_IMPRIMIR.Nro_Evento=eventoactual.IdEvento;
                TICKET_IMPRIMIR.Desc=eventoactual.nombre;

                totales=sacar_totales_y_maximo();
                TICKET_IMPRIMIR.TotalTicket=totales.total;
                TICKET_IMPRIMIR.ImpresoEn=moment(new Date()).format("DD-MM-YYYY HH:mm a");//new Date().toLocaleString();
                TICKET_IMPRIMIR.ImpresoPor=USUARIO;
                TICKET_IMPRIMIR.PremioMaximoAPagar=divisa+" "+parseFloat(totales.maximo).toFixed(2);
                TICKET_IMPRIMIR.PremioMaximoPotencial=divisa+" "+parseFloat(totales.total).toFixed(2);

                TICKET_IMPRIMIR.PremioMaximoPotencial_guardar=parseFloat(totales.maximo).toFixed(2);
                TICKET_IMPRIMIR.PremioMaximoPagar_guardar=eventoactual.apuestaMaximaJuego;


                TICKET_IMPRIMIR.apuestaMinimaJuego=eventoactual.apuestaMinimaJuego;
                TICKET_IMPRIMIR.apuestaMaximaJuego=eventoactual.apuestaMaximaJuego;

                apuestas=[];
                $("#tabla_eventos tbody tr").each(function(i,e){
                        fila_apuesta={};
                        var tr=e;
                        if($("td:eq(1)",tr).text()!=""){
                            tipo= $(tr).data("tipo");
                            idtipopago= $(tr).data("idtipopago");
                            idtipoapuesta= $(tr).data("idtipoapuesta");
                            valor= $(tr).data("valor");
                            evento=$("td:eq(0)",tr).text();
                            seleccion=$("td:eq(1)",tr).text();
                            cuota=$("td:eq(2)",tr).text();
                            apuesta=$("td:eq(3)",tr).text();
                            fila_apuesta.evento=eventoactual.IdEvento;
                            fila_apuesta.descripcion=seleccion;
                            fila_apuesta.cuota=cuota;
                            fila_apuesta.idtipopago=idtipopago;
                            fila_apuesta.idtipoapuesta=idtipoapuesta;
                            fila_apuesta.apuesta=apuesta;
                            apuestas.push(fila_apuesta);
                        }
                })
                TICKET_IMPRIMIR.apuestas=apuestas;

                GuardarTicket(TICKET_IMPRIMIR);
            }
        })
///////////////////////////FIN BOTONESSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS



//////MODALES
        $(".modal").off("hidden.bs.modal").on("hidden.bs.modal", function () {
            // CargarTabla();
            RECARGAR_TOMBOLA=true;
            if(typeof eventoactual!="undefined"){
            HistorialJackpotDatosJson(OPCIONES_CAJA.idPuntoVenta,eventoactual.IdEvento);
            }else{
                CargarTabla();
            }
        })

         $(".modal").off("shown.bs.modal").on("shown.bs.modal", function () {
            // CargarTabla();
            $(".modal:visible input").focus();
            detenerHistorialJackpot();
            RECARGAR_TOMBOLA=false;
        })
        
}


function eventos_botones_modalbuscar(){


    /////modal_buscar ticket para pagar
        $('#modal_buscar .digitador .digito').off().on('click',function(){
             valor=$(this).text();
             valortxt=$("#modal_buscar #ticket_txt").val();
             valortxt=valortxt+valor;
             $("#modal_buscar #ticket_txt").val(valortxt);
        })

        $('#modal_buscar .digitador .borrar').off().on('click',function(){
            var valortxt=$("#modal_buscar #ticket_txt").val();
            valortxt=valortxt.substring(0,valortxt.length-1);
            $("#modal_buscar #ticket_txt").val(valortxt);
        })

        $("#modal_buscar #btn_buscar_ticket").off().on("click",function(e){
            e.preventDefault(); 
            if( $("#modal_buscar #ticket_txt").val().trim()!=""){
                $("#modal_buscar #btn_buscar_ticket").attr("disabled",true);
                $("#modal_buscar #btn_buscar_ticket").LoadingOverlay("show");
                objetobuscar={};
                //objetobuscar.idEvento=eventoactual.IdEvento;
                //objetobuscar.nombre=eventoactual.nombre;
                objetobuscar.idTicket=$("#modal_buscar #ticket_txt").val().trim();
                // objetobuscar.idTipoApuesta=eventoactual.idTipoApuesta;
                BuscarTicket(objetobuscar);
                $("#modal_buscar #ticket_txt").val("");
            }else{
                toastr.error("Ingrese Número Ticket para pagar");
                $("#modal_buscar #btn_buscar_ticket").LoadingOverlay("hide");
                $("#modal_buscar #btn_buscar_ticket").attr("disabled",false);
            }
        })

         $("#buscar_div",$("#modal_buscar")).off().on("click",function(e){
              e.preventDefault(); 
                $("#btn_buscar_ticket",$("#modal_buscar")).click();
        })

///////fin modal buscar ticket para pagar


    /////modal_buscar pagados para pagar

      $('#modal_buscar_pagados .digitador .digito').off().on('click',function(){
             valor=$(this).text();
             valortxt=$("#modal_buscar_pagados #ticket_txt").val();
             valortxt=valortxt+valor;
             $("#modal_buscar_pagados #ticket_txt").val(valortxt);
        })

        $('#modal_buscar_pagados .digitador .borrar').off().on('click',function(){
            var valortxt=$("#modal_buscar_pagados #ticket_txt").val();
            valortxt=valortxt.substring(0,valortxt.length-1);
            $("#modal_buscar_pagados #ticket_txt").val(valortxt);
        })
        $("#modal_buscar_pagados #btn_buscar_ticket").off().on("click",function(e){
                e.preventDefault(); 
                if( $("#modal_buscar_pagados #ticket_txt").val().trim()!=""){
                    $("#modal_buscar_pagados #btn_buscar_ticket").attr("disabled",true);
                    $("#modal_buscar_pagados #btn_buscar_ticket").LoadingOverlay("show");
                    objetobuscar={};
                    objetobuscar.idTicket=$("#ticket_txt").val().trim();
                    BuscarTicketPagado(objetobuscar);
                    $("#modal_buscar_pagados #ticket_txt").val("");
                }else{
                    toastr.error("Ingrese Número Ticket  pagado");
                    $("#modal_buscar_pagados #btn_buscar_ticket").LoadingOverlay("hide");
                    $("#modal_buscar_pagados #btn_buscar_ticket").attr("disabled",false);
                }
        });

        $("#buscar_div",$("#modal_buscar_pagados")).off().on("click",function(e){
              e.preventDefault(); 
                $("#btn_buscar_ticket",$("#modal_buscar_pagados")).click();
        })

    /////fin modal_buscar pagados para pagar


    /////fin modal_buscar  para cancelar
    var modal=$("#modal_buscar_cancelar_ticket");
      $('.digitador .digito',modal).off().on('click',function(){
             valor=$(this).text();
             valortxt=$("#ticket_txt",modal).val();
             valortxt=valortxt+valor;
             $("#ticket_txt",modal).val(valortxt);
        })

        $('.digitador .borrar',modal).off().on('click',function(){
            var valortxt=$("#ticket_txt",modal).val();
            valortxt=valortxt.substring(0,valortxt.length-1);
            $("#ticket_txt",modal).val(valortxt);
        })
        $("#btn_buscar_ticket",modal).off().on("click",function(e){
                e.preventDefault(); 
                if( $("#ticket_txt",modal).val().trim()!=""){
                    $("#btn_buscar_ticket",modal).attr("disabled",true);
                    $("#btn_buscar_ticket",modal).LoadingOverlay("show");
                    objetobuscar={};
                    objetobuscar.idTicket=$("#ticket_txt",modal).val().trim();
                    BuscarTicketparaCancelar(objetobuscar);
                    $("#ticket_txt",modal).val("");
                }else{
                    toastr.error("Ingrese Número Ticket para cancelar");
                    $("#btn_buscar_ticket",modal).LoadingOverlay("hide");
                    $("#btn_buscar_ticket",modal).attr("disabled",false);
                }
        })



        $("#buscar_div",modal).off().on("click",function(e){
              e.preventDefault(); 
                $("#btn_buscar_ticket",modal).click();
        })



            /////fin modal_buscar  para re imprimir
    var modal=$("#modal_buscar_reimprimir_ticket");
      $('.digitador .digito',modal).off().on('click',function(){
             valor=$(this).text();
             valortxt=$("#ticket_txt",modal).val();
             valortxt=valortxt+valor;
             $("#ticket_txt",modal).val(valortxt);
        })

        $('.digitador .borrar',modal).off().on('click',function(){
            var valortxt=$("#ticket_txt",modal).val();
            valortxt=valortxt.substring(0,valortxt.length-1);
            $("#ticket_txt",modal).val(valortxt);
        })
        $("#btn_buscar_ticket",modal).off().on("click",function(e){
                e.preventDefault(); 
                if( $("#ticket_txt",modal).val().trim()!=""){
                    $("#btn_buscar_ticket",modal).attr("disabled",true);
                    $("#btn_buscar_ticket",modal).LoadingOverlay("show");
                    objetobuscar={};
                    objetobuscar.idTicket=$("#ticket_txt",modal).val().trim();
                    BuscarTicketparaCancelar(objetobuscar);
                    $("#ticket_txt",modal).val("");
                }else{
                    toastr.error("Ingrese Número Ticket para Reimprimir");
                    $("#btn_buscar_ticket",modal).LoadingOverlay("hide");
                    $("#btn_buscar_ticket",modal).attr("disabled",false);
                }
        })

        $("#buscar_div",modal).off().on("click",function(e){
              e.preventDefault(); 
                $("#btn_buscar_ticket",modal).click();
        })

//////
    var modal=$("#modal_buscar_para_reimprimir_cancelar_ticket");
      $('.digitador .digito',modal).off().on('click',function(){
             valor=$(this).text();
             valortxt=$("#ticket_txt",modal).val();
             valortxt=valortxt+valor;
             $("#ticket_txt",modal).val(valortxt);
        })

        $('.digitador .borrar',modal).off().on('click',function(){
            var valortxt=$("#ticket_txt",modal).val();
            valortxt=valortxt.substring(0,valortxt.length-1);
            $("#ticket_txt",modal).val(valortxt);
        })
        $("#btn_buscar_ticket",modal).off().on("click",function(e){
                e.preventDefault(); 
                if( $("#ticket_txt",modal).val().trim()!=""){
                    $("#btn_buscar_ticket",modal).attr("disabled",true);
                    $("#btn_buscar_ticket",modal).LoadingOverlay("show");
                    objetobuscar={};
                    objetobuscar.idTicket=$("#ticket_txt",modal).val().trim();
                    BuscarTicketparaCancelar(objetobuscar);
                    $("#ticket_txt",modal).val("");
                }else{
                    toastr.error("Ingrese Número Ticket para Buscar");
                    $("#btn_buscar_ticket",modal).LoadingOverlay("hide");
                    $("#btn_buscar_ticket",modal).attr("disabled",false);
                }
        })

        $("#buscar_div",modal).off().on("click",function(e){
              e.preventDefault(); 
                $("#btn_buscar_ticket",modal).click();
        })


}

function generar_json_apuestas(){
    idtabla="tabla_eventos";
    array_apuestas=[];
    $("tbody tr","#"+idtabla).each(function(i,e){
        var tr =e;
        if($("td:eq(0)",tr).text()!="-"){
        filaapuesta={};
            filaapuesta.ID_EVENTO=$("td:eq(0)",tr).text();
            filaapuesta.SELECCION=$("td:eq(1)",tr).text();
            filaapuesta.CUOTA=$("td:eq(2)",tr).text();
            filaapuesta.APUESTA=$("td:eq(3)",tr).text().trim();
            array_apuestas.push(filaapuesta)
        }
    })
    return array_apuestas;
}
function sacar_totales_y_maximo(){
     idtabla="tabla_eventos";
    array_apuestas=[];
    var total=0;
    var maximo=0;var tipo="";
    var tr_maximo=null;
    $("tbody tr","#"+idtabla).each(function(i,e){
         var tr =e;
        if($("td:eq(0)",tr).text()!="-"){
            max_fila=parseFloat($("td:eq(2)",tr).text())*parseFloat($("td:eq(3)",tr).text().trim());
            total=total+parseFloat($("td:eq(3)",tr).text().trim());//SUMA col APUESTA
            if(max_fila>maximo){
                tr_maximo=tr;
                maximo=max_fila;
                tipo=$("tr").attr("data-tipo");
            }
        }
    });
  
    if($(tr_maximo).data("tipo")=="numero"){  /////SI TR MAXIMO ES NUMERO, REVISAR SI HAY APUESTA EN RANGO,PAR,IMPAR,COLOR

        ///RANGO
            tr_rangos=$("#tabla_eventos tbody tr[data-tipo='rango']");
            $(tr_rangos).each(function(a,b){
                var trrango=b;
                var rango=$(trrango).data("valor"); ///*1-12 ,13-24*/
                rangos_array=rango.split("-");
                valor_trmaximo=$(tr_maximo).data("valor");
                var rangoinicio=rangos_array[0];
                var rangofin=rangos_array[1];
                if(valor_trmaximo>=rangoinicio &&  valor_trmaximo<=rangofin){
                    maximo=maximo+(parseFloat($("td:eq(2)",trrango).text())*parseFloat($("td:eq(3)",trrango).text().trim()));
                }
            })
            //

        ///PAR IMPAR
            tr_pares=$("#tabla_eventos tbody tr[data-valor='PAR']");
            if(tr_pares.length){
                valor_trmaximo=$(tr_maximo).data("valor");
                var trpar=tr_pares;
                if(parseInt(valor_trmaximo)%2==0){///es par
                    maximo=maximo+(parseFloat($("td:eq(2)",trpar).text())*parseFloat($("td:eq(3)",trpar).text().trim()));
                }
            }
            tr_impares=$("#tabla_eventos tbody tr[data-valor='IMPAR']");
            if(tr_impares.length){
                valor_trmaximo=$(tr_maximo).data("valor");
                var trimpar=tr_impares;
                if(parseInt(valor_trmaximo)%2!=0){///es impar
                    maximo=maximo+(parseFloat($("td:eq(2)",trimpar).text())*parseFloat($("td:eq(3)",trimpar).text().trim()));
                }
            }
            //
        ///COLOR
          tr_color1=$("#tabla_eventos tbody tr[data-descripcion='COLOR 1']");
            if(tr_color1.length){
                color_trmaximo=$(tr_maximo).data("color");
                var trcolor1=tr_color1;
                if(color_trmaximo.toUpperCase()==(trcolor1.data("color2")).toUpperCase()){///es color1
                    maximo=maximo+(parseFloat($("td:eq(2)",trcolor1).text())*parseFloat($("td:eq(3)",trcolor1).text().trim()));
                }
            }
            tr_color2=$("#tabla_eventos tbody tr[data-descripcion='COLOR 2']");
            if(tr_color2.length){
                color_trmaximo=$(tr_maximo).data("color");
                var trcolor2=tr_color2;
                if(color_trmaximo.toUpperCase()==(trcolor2.data("color2")).toUpperCase()){///es color2
                    maximo=maximo+(parseFloat($("td:eq(2)",trcolor2).text())*parseFloat($("td:eq(3)",trcolor2).text().trim()));
                }
            }

    }////fin tr maximo es numero

/// SI TRMAXIMO  ES RANGO
    if($(tr_maximo).data("tipo")=="rango"){  /////SI TR MAXIMO ES RANGO,  REVISAR SI HAY APUESTA EN ALGUN NUMERO DEL RANGO
                var rango=$(tr_maximo).data("valor");
                var rangos_array=rango.split("-");
                var rangoinicio=rangos_array[0];
                var rangofin=rangos_array[1];

            tr_numeros=$("#tabla_eventos tbody tr[data-tipo='numero']");
            $(tr_numeros).each(function(iii,eee){
                var trnum=eee;
                var valornumero=$(eee).data("valor");
                if(valornumero>=rangoinicio && valornumero<=rangofin){ ////numero fila esta en rango 
                    maximo=maximo+(parseFloat($("td:eq(2)",trnum).text())*parseFloat($("td:eq(3)",trnum).text().trim()));
                }
            })
    }
    datos={}
    datos.total=total;
    datos.maximo=maximo;
    return datos;
}  ///FIN sacar_totales_y_maximo();

function GeneralTicketModal(ticketobjeto_imprimir){
//////mostar codigoqr y codigo de barras para ticket en modal
    TICKET_IMPRIMIR=ticketobjeto_imprimir;
    Id_Ticket=TICKET_IMPRIMIR.Id_Ticket;
    codigo_barrahtml=TICKET_IMPRIMIR.codigo_barrahtml;
    qrcode_src=TICKET_IMPRIMIR.qrcode_src;
    codigo_barra_src=TICKET_IMPRIMIR.codigo_barra_src;
    var divisa=TICKET_IMPRIMIR.simbolo;
    var modal=$("#modal_imprimir_cancelar");

    let imagen_juego=OPCIONES_CAJA.ubicacion_imagenes_juego+TICKET_IMPRIMIR.logo
    $("#divimpresion #imagen_evento",modal).attr("src",imagen_juego);

    $("#divimpresion #IDTique",modal).text(Id_Ticket);
    $("#divimpresion #IDUnidad",modal).text(TICKET_IMPRIMIR.Id_Unidad)
    $("#divimpresion #NroEvento",modal).text(TICKET_IMPRIMIR.Nro_Evento)
    $("#divimpresion #descripcion",modal).text(TICKET_IMPRIMIR.Desc)
    $("#divimpresion #datos_filas",modal).empty()
    $(TICKET_IMPRIMIR.apuestas).each(function(i,e){
        $("#divimpresion #datos_filas",modal).append($("<div>").attr("style","width:100%;display:table")
                .append(
                $("<div>").attr("style","width:30%;float:LEFT;text-align:left").text(e.evento)
                    )
                .append(
                $("<div>").attr("style","width:30%;float:LEFT;text-align:left").text(e.descripcion)
                    )
                .append(
                $("<div>").attr("style","width:25%;float:LEFT;text-align:left").text(e.multiplicadorDefecto)
                    )

                  .append(
                $("<div>").attr("style","width:15%;float:LEFT;text-align:left").text(e.montoApostado)
                    )
        )
    })
    $("#divimpresion #total_ticket",modal).text(divisa+" "+parseFloat(TICKET_IMPRIMIR.TotalTicket).toFixed(2) );
    $("#divimpresion #impreso_en",modal).text(moment(new Date()).format("YYYY-MM-DD HH:mm:s"));
    $("#divimpresion #impreso_por",modal).text(TICKET_IMPRIMIR.ImpresoPor);
    $("#divimpresion #impreso_por2",modal).text($("#tienda").val());
    $("#divimpresion #PremioMaximoPotencial",modal).text(divisa+" "+TICKET_IMPRIMIR.premioMaximoPagar);
    $("#divimpresion #PremioMaximoAPagar",modal).text(divisa+" "+TICKET_IMPRIMIR.premioMaximoPotencial);
    $("#imagen_qrcode",modal).attr("src","data:image/png;base64,"+qrcode_src);
    $("#imagen_codigobarra",modal).attr("src","data:image/png;base64,"+codigo_barra_src);

     $("#btnCancelar",modal).off("click").on("click",function(){
              var js = $.confirm({
                        icon: 'fa fa-spinner fa-spin',
                        title: 'Cancelar Ticket',
                        theme: 'black',
                        animationBounce: 1.5,
                        columnClass: 'col-md-6 col-md-offset-3',
                        confirmButtonClass: 'btn-info',
                        cancelButtonClass: 'btn-warning',
                        confirmButton: "CONFIRMAR", 
                        cancelButton: 'CERRAR',
                        content: "Está seguro de Cancelar Ticket " + TICKET_IMPRIMIR.Id_Ticket+" ?",
                        confirm: function () {
                             CancelarTicket(TICKET_IMPRIMIR.Id_Ticket,TICKET_IMPRIMIR.Nro_Evento);
                        },
                        cancel: function () {
                        }
    });
               


        // CancelarTicket(TICKET_IMPRIMIR.Id_Ticket,TICKET_IMPRIMIR.Nro_Evento);
    })

     $("#btnReImprimir",modal).off("click").on("click",function(){
                    Imprimir($("#divimpresion",modal));
    })

     $("#modal_imprimir_cancelar").modal("show");
    // setTimeout(function(){
    //     $("#btnimprimir").click()
    // },1000)
}

function ImprimirJson2(ticketobjeto_imprimir,idTicket,response){
//////mostar codigoqr y codigo de barras para ticket en modal
   TICKET_IMPRIMIR=ticketobjeto_imprimir;
        ticketobjeto_imprimir.Id_Ticket=idTicket;
            modalguardarticket.hide();
                codigo_barrahtml=response.codigo_barrahtml;
                qrcode_src=response.qrcode_src;
                codigo_barra_src=response.codigo_barra_src;
                var modal=$("#modal_imprimir");
                $("#divimpresion_guardarticket #IDTique",modal).text(idTicket)
                $("#divimpresion_guardarticket #IDUnidad",modal).text(TICKET_IMPRIMIR.Id_Unidad)
                $("#divimpresion_guardarticket #NroEvento",modal).text(TICKET_IMPRIMIR.Nro_Evento)
                $("#divimpresion_guardarticket #descripcion",modal).text(TICKET_IMPRIMIR.Desc)
                $("#divimpresion_guardarticket #datos_filas",modal).empty()
                $(TICKET_IMPRIMIR.apuestas).each(function(i,e){
                    $("#divimpresion_guardarticket #datos_filas",modal).append($("<div>").attr("style","width:100%;display:table")
                            .append(
                            $("<div>").attr("style","width:30%;float:LEFT;text-align:left").text(e.evento)
                                )
                            .append(
                            $("<div>").attr("style","width:30%;float:LEFT;text-align:left").text(e.descripcion)
                                )

                            .append(
                            $("<div>").attr("style","width:25%;float:LEFT;text-align:left").text(e.cuota)
                                )

                              .append(
                            $("<div>").attr("style","width:15%;float:LEFT;text-align:left").text(e.apuesta)
                                )
                    )
                })
                $("#divimpresion_guardarticket #total_ticket",modal).text(divisa+" "+TICKET_IMPRIMIR.TotalTicket.toFixed(2) );
                $("#divimpresion_guardarticket #impreso_en",modal).text(moment(new Date()).format("YYYY-MM-DD HH:mm:s"));
                $("#divimpresion_guardarticket #impreso_por",modal).text(TICKET_IMPRIMIR.ImpresoPor);
                $("#divimpresion_guardarticket #impreso_por2",modal).text($("#tienda").val());
                $("#divimpresion_guardarticket #PremioMaximoPotencial",modal).text(TICKET_IMPRIMIR.PremioMaximoAPagar);
                $("#divimpresion_guardarticket #PremioMaximoAPagar",modal).text(divisa+" "+TICKET_IMPRIMIR.ApuestaMaxima);
                $("#imagen_qrcode",modal).attr("src","data:image/png;base64,"+qrcode_src);
                $("#imagen_codigobarra",modal).attr("src","data:image/png;base64,"+codigo_barra_src);        
                $("#btnimprimir",modal).off("click").on("click",function(){
                    Imprimir($("#divimpresion_guardarticket",modal));

                })
                setTimeout(function(){
                    $("#btnimprimir",modal).click()
                },1000)
                
}

function HistorialJackpotDatosJson(puntoventa,idev){
        llamada_ajax=$.ajax({
                type: 'POST',
                url: basePath + 'HistorialJackpotDatosJsonFk',
                data: {
                    'idPuntoVenta': puntoventa,
                    'idEvento':idev,
                    '_token': $('input[name=_token]').val(),
                },
                beforeSend:function(){
                },
                success: function (response) {
                    jackpotsuma=response.jackpotsuma;
                    jugadores=response.jugadores;

                    $("#row_datosevento #jugador").text(jugadores);
                    $("#row_datosevento #jackpotsuma").text(divisa+" "+jackpotsuma);

                    historialdatos=response.historial;
                    $(".historial_numeros").empty();
                    $(historialdatos).each(function(i,e){
                        var valor=e.valorGanador=="0"?"x":e.valorGanador;
                          $(".historial_numeros").append(
                            $("<div>")
                            .attr("data-idEvento",e.idEvento)
                            .text(valor)
                            .css("background-color",e.color)
                            .css("color",e.rgbLetra)
                        )
                    });
                    TIMEOUT_HistorialJackpotDatosJson=setTimeout(function(){
                        if(!DETENER_HISTORIALJACKPOT){
                            HistorialJackpotDatosJson($("#idPuntoVenta").val(),eventoactual.IdEvento);
                        }
                        else{
                            console.warn("DETENER_HISTORIALJACKPOT "+DETENER_HISTORIALJACKPOT);
                        }
                    },TIEMPO_INTERVALO_HISTORIALJACKPOT);
                },
                error:function(){

                }
        });
        return llamada_ajax;
}

function get_apuestas(){
     apuestas=[];
                $("#tabla_eventos tbody tr").each(function(i,e){
                        fila_apuesta={};
                        var tr=e;
                        if($("td:eq(1)",tr).text()!=""){
                            tipo= $(tr).data("tipo");
                            idtipopago= $(tr).data("idtipopago");
                            idtipoapuesta= $(tr).data("idtipoapuesta");
                            valor= $(tr).data("valor");
                            evento=$("td:eq(0)",tr).text();
                            seleccion=$("td:eq(1)",tr).text();
                            cuota=$("td:eq(2)",tr).text();
                            apuesta=$("td:eq(3)",tr).text();
                            fila_apuesta.evento=eventoactual.IdEvento;//evento;
                            fila_apuesta.descripcion=seleccion;
                            fila_apuesta.cuota=cuota;
                            fila_apuesta.idtipopago=idtipopago;
                            fila_apuesta.idtipoapuesta=idtipoapuesta;
                            fila_apuesta.apuesta=apuesta;
                            apuestas.push(fila_apuesta);
                        }
                });
    return apuestas;

}
function esta_ingresado(ap_array,buscar){
  encontro=false;
  $(ap_array).each(function(i,e){
    if(e.idtipoapuesta==buscar){
      encontro=true;
      return false;
    }
  })
  return encontro;
  
}




