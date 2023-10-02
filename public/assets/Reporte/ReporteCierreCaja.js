$(document).ready(function () {

    $("#modal_imprimir_cierre").off("shown.bs.modal").on("shown.bs.modal", function () {
        CargarDatosCierre();
    });
    $("#modal_imprimir_cierre #btnimprimir").off("click").on("click",function(){
         modal=$("#modal_imprimir_cierre");
        Imprimir($("#divimpresion_pago",modal));
    })

    $("#btnImprimir").on("click",function(){
        $("#modal_imprimir_cierre").modal("show");
    });

    MostrarDataCierreCaja();
    $(document).on('click', '#btnCierreCaja', function () {
        $("#ModalConfirmacion").modal({
            backdrop: 'static',
            keyboard: false
        });
    });

    $(document).on('click','#btnConfirmar',function () {
        var idAperturacaja = $("#idAperturaCaja").val();
        if (idAperturacaja !== "") {
            var dataForm = {
                'idAperturaCaja': idAperturacaja
            };
            $.ajax({
                type: 'POST',
                url: basePath + "AperturaCajaCerrarFk",
                data: dataForm,
                success: function (response) {
                    var respuesta = response.respuesta;
                    if (respuesta) {
                        toastr.success('Se ha cerrado la caja exitosamente');
                        $("#ModalConfirmacion").modal("hide");
                        MostrarDataCierreCaja();
                    } else {
                        toastr.warning(response.mensaje, '');
                    }
                }
            })
        }
    })
});

function MostrarDataCierreCaja() {
    var url = basePath + "ReporteCierreCajaFk";
    $.ajax({
        url: url,
        type: "POST",
        beforeSend: function () {
            $.LoadingOverlay("show");
        },
        complete: function () {
            $.LoadingOverlay("hide");
        },
        success: function (response) {
            var data = response.data;
             CAJA_ACTIVA=data[0];
            if (data.length > 0) {
                $("#btnCierreCaja").attr('disabled', false);
                $("#idAperturaCaja").val(data[0].idAperturaCaja);
            } else {
                $("#btnCierreCaja").attr('disabled', true);
            }

            $("#table").DataTable({
                "bDestroy": true,
                "bSort": true,
                "scrollCollapse": true,
                "scrollX": false,
                "paging": true,
                "autoWidth": false,
                "bProcessing": true,
                "bDeferRender": true,
                data: data,
                columns: [
                    {data: "caja", title: "Caja"},
                    {data: "puntoventa", title: "Punto de Venta"},
                    {data: "fechaOperacion",title:"Fecha Registro"},
                    {
                        data: "fechaCierre",title:"Fecha Cierre",
                        "render":function (o) {
                            var fechaCierre = o == null ? '--' : o;
                            return fechaCierre;
                        },class:"text-center"
                    },
                    {data: "Venta", title: "Venta"},
                    {data: "Pagado", title: "Pagado"},
                    {
                        data: null, title: "Utilidad",
                        "render": function (value) {
                            return value.Venta - value.Pagado;
                        }
                    }
                ],

            });
        },
        error: function (jqXHR, textStatus, errorThrown) {
        }
    });
}


function CargarDatosCierre() {
    var url = basePath + "CargarDatosCierreFk";
    $.ajax({
        url: url,
        type: "POST",
        beforeSend: function () {
            $.LoadingOverlay("show");
        },
        complete: function () {
            $.LoadingOverlay("hide");
        },
        success: function (response) {
            var data = response.data;
                $("#IDUnidad").text(data.cc_id);
                $("#Impreso_en").text(data.Impreso_en);
                $("#Impreso_por").text(data.Impreso_por);
                $("#Moneda_valor").text(data.Moneda_valor);
                $("#IdInforme").text(data.IdInforme);
                
                // venta=0;
                // cancelar=0;
                // netoventas=0;
                // $(CAJA_ACTIVA).each(function(i,e){
                //     venta=venta+parseFloat(e.Venta);
                //     cancelar=cancelar+parseFloat(e.Pagado);
                // })
                // var venta=venta.toFixed(2);
                // var cancelar=cancelar.toFixed(2);
                // var netoventas=(venta-cancelar).toFixed(2);
                var venta=parseFloat(CAJA_ACTIVA.Venta).toFixed(2);
                var cancelar=parseFloat(CAJA_ACTIVA.Pagado).toFixed(2);
                var netoventas=(venta-cancelar).toFixed(2);
                $("#venta_valor").text(venta);
                $("#cancelar_valor").text(cancelar);
                $("#netoventas_valor").text(netoventas);
                
                $("#saldoneto_valor").text(netoventas);


        },
        error: function (jqXHR, textStatus, errorThrown) {
            $.LoadingOverlay("hide");
        }
    });
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