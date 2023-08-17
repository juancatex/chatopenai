$(window).load(function () {
    window.mensajeDes="Quiero que respondas como una médico veterinario, te llamas Vet.y y actuaras como asistente, te daré los signos y síntomas de un paciente y tu tarea será proporcionar un diagnóstico exacto, y varios diagnósticos diferenciales, explicando el porqué de tu diagnóstico y también deberás ofrecer un tratamiento farmacológico con sus respectivas dosis y fuentes bibliográficas de donde extrajiste la información. De ser necesario deberás utilizar y pedir exámenes médicos, test de laboratorio, etc. Si estás listo, tu primera respuesta será ofreciendo tu ayuda brevemente de manera divertida en 1 línea de texto."; 
    window.mensajeDesRes=""; 
   window.getMonthName= function(monthNumber) {
        const date = new Date();
        date.setMonth(monthNumber - 1);
      
        return date.toLocaleString('es-ES', { month: 'long' });
      }
    function fillDecimals(number, length = 2) {
        function pad(input, length, padding) {
            var str = input + "";
            return (length <= str.length) ? str : pad(str + padding, length, padding);
        }
        var str = number + "";
        var dot = str.lastIndexOf('.');
        var isDecimal = dot != -1;
        var integer = isDecimal ? str.substr(0, dot) : str;
        var decimals = isDecimal ? str.substr(dot + 1) : "";
        decimals = pad(decimals, length, 0);
        return integer + '.' + decimals;
    }

    window.redondeo_valor = function (num, decimales = 2, redoncero = true) {
        var signo = (num >= 0 ? 1 : -1);
        num = num * signo;
        if (decimales === 0)
            return signo * Math.round(num);
        num = num.toString().split('e');
        num = Math.round(+(num[0] + 'e' + (num[1] ? (+num[1] + decimales) : decimales)));
        num = num.toString().split('e');
        if (redoncero) {
            return fillDecimals(signo * (num[0] + 'e' + (num[1] ? (+num[1] - decimales) : -decimales)), decimales);
        } else {
            return (signo * (num[0] + 'e' + (num[1] ? (+num[1] - decimales) : -decimales)));
        }

    }
    window.getPriceUSD = function (totaltoken = 0) {
        // var pricetokenUsd = 0.002;
        var pricetokenUsd = 0.12;
        return redondeo_valor(totaltoken > 0 ? ((pricetokenUsd / 1000) * totaltoken) : 0, 5);
    }
    window.getPriceBob = function (totaltoken = 0) {
        var pricetokenUsd = getPriceUSD(totaltoken);
        return redondeo_valor(pricetokenUsd * 6.96, 5);
    }

    function chatGptMain(usersData) {
        var modalPrincipal = null;
        var modalPagos = null;
        var modalpaying = null;
        /////////////////////////////////////////////class modal///////////////////////////////////////////////////
        function clearData(modalin) {
            if (modalin != null) {
                modalin.destroy();
            }
            modalin = null;
        }

        function openModalPrincipal() {
            modalPrincipal = new tingle.modal({
                closeMethods: [],
                footer: true,
                stickyFooter: true
            });
            var contentmodalpagos = $("<div>");
            contentmodalpagos.html($("<h1 style='margin: 37px 0 34px 0 !important;text-align: center;font-weight: bold;color: black;'>").html('Estado de pagos de los usuarios'));
            contentmodalpagos.append($("<div>").html('<table id="tableexample" class="display responsive nowrap" width="100%"></table>'));
            modalPrincipal.setContent(contentmodalpagos.html());
            $('#tableexample').DataTable({
                language: {
                    url: 'https://cdn.datatables.net/plug-ins/1.13.4/i18n/es-ES.json',
                },
                data: usersData,
                scrollY: 300,
                deferRender: true,
                scroller: true,
                select: false,
                responsive: true,
                processing: true,
                autoWidth: true,
                lengthChange: false,
                columns: [{
                        title: 'id'
                    },
                    {
                        title: 'Nombre Usuario',
                        width: "90%"
                    },
                    {
                        title: "Acciones",
                        width: "10%",
                        "render": function (data, type, full) {
                            return `<div class="btn-group"> 
                        <button type="button"  onclick=" eventBtug (${full[0]}) " class="tingle-btn tingle-btn--primary" style="padding: 0.5rem 1rem;">Notificar Pago</button>
                        <button type="button"  onclick=" eventBtup (${full[0]}) " class="tingle-btn tingle-btn--success" style="padding: 0.5rem 1rem;">Pagos</button>
                        </div>`
                        },
                    }
                ],
                columnDefs: [{
                    target: 0,
                    visible: false,
                    searchable: false,
                }]
            });

            window.eventBtug = function (object) {
                $.post("detailPay.php", {
                        u: object
                    },
                    function (data, status) {
                        var valores = JSON.parse(data);
                        if (valores.status) {
                            var outa = [];
                            for (let se of valores.data) {
                                var row = [];
                                row[0] = se.csession;
                                row[1] = se.fecha;
                                row[2] = parseInt(se.total);
                                row[3] = se.cidapi;
                                outa.push(row);
                            }
                            modalPrincipal.close();
                            openModalPagos(outa, object);
                        } else {
                            alert(valores.data);
                            modalPrincipal.open();
                        }
                    });
            }
            window.eventBtup = function (object) {
                $.post("detailPaying.php", {
                        u: object
                    },
                    function (data, status) {
                        var valores = JSON.parse(data);
                        if (valores.status) {
                            var outa = [];
                            for (let se of valores.data) {
                                var row = [];
                                row[0] = se.idpay;
                                row[1] = parseInt(se.cidapi);
                                row[2] = se.fechareg;
                                row[3] = parseInt(se.totaltoken);
                                row[4] = parseFloat(se.costoUSD);
                                row[5] = parseFloat(se.costoBOB);
                                row[6] = parseInt(se.status) == 1 ? 'Pendiente' : 'Pagado';
                                row[7] = se.fechastatus;
                                row[8] = parseInt(se.status);
                                outa.push(row);
                            }
                            modalPrincipal.close();
                            openModalPaying(object, outa);
                        } else {
                            alert(valores.data);
                            modalPrincipal.open();
                        }
                    });
            }
            modalPrincipal.addFooterBtn('Cerrar', 'tingle-btn tingle-btn--default tingle-btn--pull-right', function () {
                clearData(modalPrincipal);
            });

            modalPrincipal.open();
        }

        function openModalPagos(datasession, iduser) {
            var rowselected = '';
            modalPagos = new tingle.modal({
                closeMethods: [],
                footer: true,
                stickyFooter: true
            });
            var contentmodalpagos = $("<div>");
            contentmodalpagos.html($("<h1 style='margin: 37px 0 34px 0 !important;text-align: center;font-weight: bold;color: black;'>").html('Listado de recursos consumidos en la OpenAI'));
            contentmodalpagos.append($("<div>").html(`<table id="tablenotificacion" class="display responsive nowrap" width="100%"><tfoot> <tr>
             <th id="sumat" colspan="3" ><table>
            <tr><td>Tokens:</td><td style="font-weight: 100;">0</td> <td>Costo Aprox. ($us):</td><td style="font-weight: 100;">0.00000</td><td>Costo Aprox. (Bs):</td><td style="font-weight: 100;">0.00000</td></tr>
            </table></th>
        </tr></tfoot></table>`));
            modalPagos.setContent(contentmodalpagos.html());
            var tablenotificacion = $('#tablenotificacion').DataTable({
                language: {
                    url: 'https://cdn.datatables.net/plug-ins/1.13.4/i18n/es-ES.json',
                },
                data: datasession,
                select: {
                    style: 'multi',
                    info: false
                },
                searching: false,
                scrollY: 300,
                deferRender: true,
                scroller: true,
                responsive: true,
                processing: true,
                autoWidth: true,
                lengthChange: false,
                columns: [{
                        title: 'Sesion',
                        width: "25%"
                    },
                    {
                        title: 'Fecha de registro',
                        width: "25%"
                    },
                    {
                        title: 'Total token',
                        width: "25%"
                    },
                    {
                        title: "Costo $us",
                        width: "25%",
                        "render": function (data, type, full) {
                            return `<div> ${ getPriceUSD(full[2])}</div>`
                        },
                    }
                ]
            });
            tablenotificacion.on('select', function () {
                calsumto(tablenotificacion.rows({
                    selected: true
                }).data().toArray());
            });
            tablenotificacion.on('deselect', function () {
                calsumto(tablenotificacion.rows({
                    selected: true
                }).data().toArray());
            });

            function calsumto(rows) {
                var rowselectedin = [];
                var sum = 0;
                for (const element of rows) {
                    sum += element[2];
                    rowselectedin.push("'" + element[0] + "'");
                }
                rowselected = rowselectedin.join(',');
                $("#sumat").html(`<table>
                    <tr><td>Tokens:</td><td style="font-weight: 100;">${sum}</td> <td>Costo ($us):</td><td style="font-weight: 100;">${getPriceUSD(sum)}</td><td>Costo Aprox. (Bs):</td><td style="font-weight: 100;">${getPriceBob(sum)}</td></tr>
                    </table>`);
            }

            modalPagos.addFooterBtn('Volver', 'tingle-btn tingle-btn--default tingle-btn--pull-right', function () {
                clearData(modalPagos);
                modalPrincipal.open();
            });
            modalPagos.addFooterBtn('Notificar', 'tingle-btn tingle-btn--success tingle-btn--pull-right', function () {

                $.post("createpay.php", {
                        u: iduser,
                        s: rowselected,
                    },
                    function (data, status) {
                        var valores = JSON.parse(data);
                        alert(valores.data);
                        clearData(modalPagos);
                        modalPrincipal.open();
                    });
            });

            modalPagos.open();
        }

        function openModalPaying(iduser, datasession) {
            modalpaying = new tingle.modal({
                closeMethods: [],
                footer: true,
                stickyFooter: true
            });
            var contentmodalpagos = $("<div>");
            contentmodalpagos.html($("<h1 style='margin: 37px 0 34px 0 !important;text-align: center;font-weight: bold;color: black;'>").html('Listado de notificaciones'));
            contentmodalpagos.append($("<div>").html(`<table id="tablepayings" class="display responsive nowrap" width="100%"></table>`));
            modalpaying.setContent(contentmodalpagos.html());
            $('#tablepayings').DataTable({
                language: {
                    url: 'https://cdn.datatables.net/plug-ins/1.13.4/i18n/es-ES.json',
                },
                data: datasession,
                select: false,
                searching: false,
                scrollY: 300,
                deferRender: true,
                scroller: true,
                responsive: true,
                processing: true,
                autoWidth: true,
                lengthChange: false,
                columns: [{
                        title: 'idpago'
                    },
                    {
                        title: 'iduser'
                    },
                    {
                        title: 'Fecha',
                        width: "14%"
                    },
                    {
                        title: 'Total tokens',
                        width: "16%"
                    },
                    {
                        title: 'Costo $us',
                        width: "14%"
                    },
                    {
                        title: 'Costo Bs',
                        width: "14%"
                    },
                    {
                        title: 'Estado',
                        width: "14%"
                    },
                    {
                        title: 'Fecha Estado',
                        width: "14%"
                    },
                    {
                        title: "Acciones",
                        width: "14%",
                        "render": function (data, type, full) {
                            return full[8] == 1 ?
                                `<div class="btn-group">  
                        <button type="button"  onclick=" eventBtuppay (${full[0]}) " class="tingle-btn tingle-btn--success" style="padding: 0.5rem 1rem;">Pagar</button>
                        </div>` : '---'
                        },
                    }
                ],
                columnDefs: [{
                        target: 0,
                        visible: false,
                        searchable: false,
                    },
                    {
                        target: 1,
                        visible: false,
                        searchable: false,
                    }
                ]
            });

            window.eventBtuppay = function (object) {
                var number = (function ask() {
                    var n = prompt('Ingrese el importe a cancelar:');
                    return isNaN(n) || +n < 1 ? ask() : n;
                }());
                $.post("setpay.php", {
                        p: object,
                        n: number
                    },
                    function (data, status) {
                        var valores = JSON.parse(data);
                        alert(valores.data);
                        clearData(modalpaying);
                        modalPrincipal.open();
                    });
            }

            modalpaying.addFooterBtn('Volver', 'tingle-btn tingle-btn--default tingle-btn--pull-right', function () {
                clearData(modalpaying);
                modalPrincipal.open();
            });
            modalpaying.open();
        }
        /////////////////////////////////////////////class menu///////////////////////////////////////////////////
        var bloomingMenu = new BloomingMenu({
            startAngle: -90,
            endAngle: 0,
            radius: 70,
            itemsNum: 1,
            itemAnimationDelay: 0.08
        });
        bloomingMenu.render();
        bloomingMenu.props.elements.items.forEach(function (item, index) {
            item.addEventListener('click', function () {
                switch (index) {
                    case 0:
                        openModalPrincipal();
                        break;
                    case 1:
                        console.log("No submenu registrado");
                        break;
                    case 2:
                        console.log("No submenu registrado");
                        break;

                    default:
                        console.log("No submenu registrado");
                        break;
                }
            })
        });
        //////////////////////////////////////////////////////////////////////////////////////////////////////
    }

    function chatGpt(conten, dt) {
        $(document.body).append(conten);
        $(".chat_conversion").mCustomScrollbar();
        // setTimeout(function () {
        //     return setFakeMessage('Hola humano, estoy lista para ayudarte!');
        // }, 100);
         insertMessageini();
        $('#prime').click(function () {
            $('.prime').toggleClass('zmdi-comment-outline');
            $('.prime').toggleClass('zmdi-close');
            $('.prime').toggleClass('is-active');
            $('.prime').toggleClass('is-visible');
            $('#prime').toggleClass('is-float');
            $('.chat').toggleClass('is-visible');
            $('.fab').toggleClass('is-visible');
            updateScrollbar();
        });
        $('#chat_fullscreen_loader').click(function (e) {
            $('.fullscreen').toggleClass('zmdi-window-maximize');
            $('.fullscreen').toggleClass('zmdi-window-restore');
            $('.chat').toggleClass('chat_fullscreen');
            $('.fab').toggleClass('is-hide');
            $('.header_img').toggleClass('change_img');
            $('.img_container').toggleClass('change_img');
            $('.chat_header').toggleClass('chat_header2');
            $('.fab_field').toggleClass('fab_field2');
            $('.chat_converse').toggleClass('chat_converse2');
            updateScrollbar();
        });
        $('#chat_details').click(function (e) {
            $('#chat_fullscreen').toggleClass('is-hide');
            $('#chat_detail').toggleClass('is-hide');
            $('.fab_field').toggleClass('is-hide');

            /////spinner
            var chatcat = $("<div>").addClass("chat_category").css("text-align", "center");
            chatcat.html($("<div>").addClass("efectzoom").html(`<span class="spinner"></span><label class="chat_log ">Obteniendo datos...</label>`));
            $('#chat_detail').html(chatcat);
            ///////////

            $.post("detail.php", {
                    u: dt.i,
                    k: dt.k, 
                    o: dt.o,
                },
                function (data, status) {
                    var valores = JSON.parse(data);
                    if (valores.status) {
                        var chatcat = $("<div>").addClass("chat_category");
                        chatcat.css("padding", "2px"); 
                        const groupByCategory = valores.data.reduce((group, product) => {
                            const {
                                mes
                            } = product;
                            group[mes] = group[mes] ?? [];
                            group[mes].push(product);
                            return group;
                        }, {}); 
                        const keysSorted = Object.keys(groupByCategory).sort(function (a, b) {
                            return b - a
                        });
  

                        for (const keyyears in keysSorted) {
                            var cuerpocard = $("<div>");
                            if (keyyears == 0) {
                                cuerpocard.addClass('accordion active');
                            } else {
                                cuerpocard.addClass('accordion');
                            }
                            var cabesera = $("<div>");
                            if (keyyears == 0) {
                                cabesera.addClass('accordion_tab active');
                            } else {
                                cabesera.addClass('accordion_tab');
                            } 
                            var listado = $("<ul>");
                            var totalto=0;
                            var totalco=0;
                            //////////////////////////////////////////////////////////////
                        for (const se of groupByCategory[keysSorted[keyyears]]) { 
                            var listvalue = $("<li>");
                            // listvalue.html(` <table>
                            //        <tr><td><label class="chat_log">Fecha :</label></td><td style="color: darkblue;">${se.fecha}</td></tr>
                            //        <tr><td><label class="chat_log">Hora :</label></td><td>${se.hora}</td></tr>
                            //        <tr><td><label class="chat_log">Total token :</label></td><td>${se.total}</td></tr>
                            //        <tr><td><label class="chat_log">Costo :</label></td><td>${getPriceUSD(se.total)} $us</td></tr>
                            //        </table>`);
                            listvalue.html(` <table>
                                   <tr><td><label class="chat_log">Fecha :</label></td><td style="color: darkblue;">${se.fecha}</td></tr>
                                   <tr><td><label class="chat_log">Hora :</label></td><td>${se.hora}</td></tr> 
                                   </table>`);
                                   totalco+=parseFloat(getPriceUSD(se.total));
                                   totalto+=parseInt(se.total);
                            listvalue.click(function () {
                                gethistorychat(se.cidapi, se.csession, se.fecha + " " + se.hora);
                            });
                            listvalue.appendTo(listado); 
                        }
                            //////////////////////////////////////////////////////////////

                            var datoscabe=(keysSorted[keyyears]).split('.');
                            // cabesera.html(`${datoscabe[0]} - ${getMonthName(datoscabe[1])} <div style="       text-align: center;
                            // text-transform: capitalize; 
                            // font-weight: normal;
                            // font-size: 13px;
                            // max-width: 88%;
                            // margin: auto;"><b>Tokens:&nbsp;</b><div style="letter-spacing: normal;display: inline-block;">${totalto}</div>  &nbsp;&nbsp;&nbsp;  
                            // <b>Costo:&nbsp;</b><div style="letter-spacing: normal;display: inline-block;">${redondeo_valor(totalco,4)}$us</div></div><div class="accordion_arrow"> 
                            // <img src="./css/img/PJRz0Fc.png" alt="arrow"> </div>`);
                            cabesera.html(`${datoscabe[0]} - ${getMonthName(datoscabe[1])}  <div class="accordion_arrow"> 
                            <img src="./css/img/PJRz0Fc.png" alt="arrow"> </div>`);
                            cabesera.click(function () {
                                $(".accordion_tab").each(function () {
                                    $(this).parent().removeClass("active");
                                    $(this).removeClass("active");
                                });
                                $(this).parent().addClass("active");
                                $(this).addClass("active");
                            });
                            cabesera.appendTo(cuerpocard);

                            var contenido = $("<div>");
                            contenido.addClass('accordion_content'); 
                           

                            contenido.html(listado);
                            contenido.appendTo(cuerpocard);
                            cuerpocard.appendTo(chatcat);
                        }
                       



                        // $('#chat_detail').html(chatcat);

                        $('#chat_detail').html(`<div class="chat_category" style="background: rgb(42 2 163) !important;
                        color: #ffffff;
                        text-align: center;
                        font-size: larger;
                        margin: 6px 50px 27px 50px;
                        border-radius: 10px; ">  Saldo disponible: ${valores.saldo} Bs. </div>`);
                        $('#chat_detail').append(chatcat);
                    } else {
                        var chatcat = $("<div>").addClass("chat_category").css("text-align", "center");
                        chatcat.html($("<div>").addClass("efectzoom").html(`<span class="spinner"></span><label class="chat_log ">${valores.data}</label>`));
                        $('#chat_detail').html(chatcat);
                    }
                });

        });
        window.gethistorychat = function (idu, idse, iddate) {
            /////spinner
            var chatcat = $("<div>").addClass("chat_category").css("text-align", "center");
            chatcat.html($("<div>").addClass("efectzoom").html(`<span class="spinner"></span><label class="chat_log ">Obteniendo historico...</label>`));
            $('#chat_detail').html(chatcat);
            ///////////

            $.post("history.php", {
                    u: idu,
                    s: idse,
                },
                function (data, status) {
                    var valores = JSON.parse(data);
                    if (valores.status) {
                        $('#chat_detail').html(`                            
                            <span class="chat_msg_item ">
                            <ul class="tags">
                              <li><b>${iddate}</b></li> 
                            </ul>
                           </span>`);

                        for (let se of valores.data) {
                            setuserMessageh(se.cprompt, se.fcprompt);
                            setFakeMessageh(se.ccompletion, se.fccompletion);
                        }
                    } else {
                        var chatcat = $("<div>").addClass("chat_category").css("text-align", "center");
                        chatcat.html($("<div>").addClass("efectzoom").html(`<span class="spinner"></span><label class="chat_log ">${valores.data}</label>`));
                        $('#chat_detail').html(chatcat);
                    }
                });
        }


        function padTo2Digits(num) {
            return num.toString().padStart(2, '0');
        }

        function formatDate(date) {
            return (
                [
                    date.getFullYear(),
                    padTo2Digits(date.getMonth() + 1),
                    padTo2Digits(date.getDate()),
                ].join('-') +
                '  ' + [
                    padTo2Digits(date.getHours()),
                    padTo2Digits(date.getMinutes()),
                    padTo2Digits(date.getSeconds()),
                ].join(':')
            );
        }

        function setFakeMessage(mensaje) {
            mensaje = mensaje.trim();
            mensaje = mensaje.replace(/\n\n/g, "</br>");
            var msg;
            msg = $("<span>").addClass("chat_msg_item chat_msg_item_admin");
            msg.html(` <div class="chat_avatar"> <img src="logo.jpg" /> </div>${mensaje} <div class="status2">${formatDate(new Date())}</div>`);
            msg.appendTo($('.mCSB_container'));
            updateScrollbar();
        };

        function setFakeMessageh(mensaje, dateh) {
            mensaje = mensaje.trim();
            mensaje = mensaje.replace(/\n\n/g, "</br>");
            var msg;
            msg = $("<span>").addClass("chat_msg_item chat_msg_item_admin");
            msg.html(` <div class="chat_avatar"> <img src="logo.jpg" /> </div>${mensaje} <div class="status2">${dateh}</div>`);
            msg.appendTo($('.chat_body'));
        };

        function setuserMessageh(mensaje, dateh) {
            mensaje = mensaje.trim();
            mensaje = mensaje.replace(/\n\n/g, "</br>");
            var typing = $("<span>").addClass("chat_msg_item chat_msg_item_user");
            typing.html(`${mensaje}<div class="status">${dateh}</div>`);
            typing.appendTo($('.chat_body'));
        };

        window.insertMessage = function () {
            var typing, msgText;
            msgText = $("#chatSend").val();
            if ($.trim(msgText) === "") {
                return false;
            }
            typing = $("<span>").addClass("chat_msg_item chat_msg_item_user");
            typing.html(`${msgText}<div class="status">${formatDate(new Date())}</div>`);
            typing.appendTo($('.mCSB_container'));
            updateScrollbar();
            $("#chatSend").val(null);
            $(".typingchat").remove();
            $("#fab_send").hide();
            $("#chatSend").prop('disabled', true);
            setTimeout(function () {
                insertMessagetypingchat(); 
                $.post("ai.php", {
                        message: msgText,
                        session: $(".fabs").attr("sessionchat"),
                        iu: dt.i,
                        k: dt.k,
                        t: dt.t,
                        x: dt.x,
                        o: dt.o,
                        n: dt.n,
                        me:  window.mensajeDes,
                        res:  window.mensajeDesRes
                    },
                    function (data, status) {
                        var valores = JSON.parse(data);
                        $("#fab_send").show();
                        $("#chatSend").prop('disabled', false);
                        $(".typingchat").remove();
                        if (valores['status']) {
                            setFakeMessage(valores['data']['ccompletion']);
                        } else {
                            setFakeMessage(valores['data']);
                        }
                    });
            }, 300 + (Math.random() * 10) * 100);
        };
        function insertMessageini() {  
            $("#chatSend").val(null);
            $(".typingchat").remove();
            $("#fab_send").hide();
            $("#chatSend").prop('disabled', true);
            setTimeout(function () {
                insertMessagetypingchat();
                $.post("ai.php", {
                        message: '',
                        session: $(".fabs").attr("sessionchat"),
                        iu: dt.i,
                        k: dt.k,
                        t: dt.t,
                        x: dt.x,
                        o: dt.o,
                        n: dt.n,
                        me:  window.mensajeDes,
                        res:  window.mensajeDesRes
                    },
                    function (data, status) {
                        var valores = JSON.parse(data);
                        $("#fab_send").show();
                        $("#chatSend").prop('disabled', false);
                        $(".typingchat").remove();
                        window.mensajeDesRes=valores['data']; 
                        setFakeMessage(valores['data']);
                    });
            }, 300 + (Math.random() * 10) * 100);
        };

        function insertMessagetypingchat() {
            var typing;
            typing = $("<span>").addClass("chat_msg_item chat_msg_item_admin typingchat");
            typing.html(` <div class="chat_avatar"> <img src="logo.jpg" /> </div><div class="waviy"> <span style="--i:1">.</span> <span style="--i:2">.</span> <span style="--i:3">.</span> <span style="--i:4">.</span> </div>`);
            typing.appendTo($('.mCSB_container'));
            updateScrollbar();
        };

        function updateScrollbar() {
            $("#chat_fullscreen").mCustomScrollbar("update");
            $("#chat_fullscreen").mCustomScrollbar('scrollTo', 'bottom');
        };
    }
    $.post("statusIA.php",
        function (data, status) {
            var valores = JSON.parse(data);
            if (valores.status) {
                chatGpt(valores.data.uic, valores.data.vr);
                if (valores.data.vd) {
                    $.post("users.php",
                        function (data, status) {
                            var valores = JSON.parse(data);
                            if (valores.users != undefined) {
                                chatGptMain(valores.users);
                            } else {
                                console.log("No data users");
                            }
                        });
                }
            } else {
                console.log(valores.data);
            }
        });



});
