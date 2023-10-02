IPSERVIDOR_WEBSOCKETS=$("#IPSERVIDOR_WEBSOCKETS").val();
PUERTO_WEBSOCKETS=$("#PUERTO_WEBSOCKETS").val();

USUARIO=$(".user-name").text();
CC_ID=$("#cc_id").val();
IDAPERTURACAJA=$("#idAperturaCaja").val();

$(document).ready(function () {
  $("body").css("overflow","hidden")
    INICIAR();
       // main=$(".TOMBOLACUY").closest(".container-fluid")
       //  $(window).scrollTop(
       //    $(".TOMBOLACUY").offset().top 
       //     - 
       //      (
       //        main.offset().top
       //      - main.scrollTop()
       //      ) 
       //  );

        // main=$(".TOMBOLACUY").closest(".main-container").find(".row").eq(0)
        // $(window).scrollTop(
        //   $(".TOMBOLACUY").offset().top 
        //    - 
        //     (
        //       main.offset().top
        //     - main.scrollTop()
        //     ) 
        // );

});

function INICIAR(){
    /////////onClick de Juegos/Eventos 
    $("#div_configuracioneventos .configuracioneventosdiv").off("click").on("click",function(){
        $(".TOMBOLACUY").css("cursor","wait");
                $("#div_configuracioneventos .configuracioneventosdiv").removeClass("seleccionadoevento");
                $(this).addClass("seleccionadoevento");
                detenerHistorialJackpot();
                DETENER_HISTORIALJACKPOT=false;
                $(".nombre_tituloconfiguracionevento ").text($(this).data("nombre"));
                $(".id_tituloconfiguracionevento ").text("#"+$(this).data("id"));
                EventoDatosJsonNuevo(this,$(this).data("id"),$("#idPuntoVenta").val(),$(this).data("segbloqueoantesevento"));
                $("#modal_imprimir #divimpresion .imagen img").attr("src","img/juegos/"+$(this).data("logo"))
    })
    //// FIN  Onclick eventos
    setTimeout(function(){
        $("#div_configuracioneventos .eventos_fila_izq>div").eq(0).click();
    },5)

    eventos_botones(); ////botones 1-22, rangos, colores ,  botones apuestas(1,2,4,5,10,20,50,100)  , botones check, x, buscar,imprimir
    eventos_botones_modalbuscar(); ///botones del modal buscar=>  1-9 , buscar
    $(".TOMBOLACUY").show();
    responsivetombola();
    $(window).resize(function () {
            responsivetombola();
            heighttbody=$(".rowtablaeventos").height()-$("#tabla_eventos thead").height();
            $("#tabla_eventos tbody").height(heighttbody);
    }).trigger('resize');

} ////*Fin INICIAR*/





