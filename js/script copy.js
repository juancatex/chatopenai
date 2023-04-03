$(window).load(function () {
    $.post("ia.php", 
    function (data, status) {
        var valores = JSON.parse(data);  
       console.log(valores.data);
       if(valores.status){

       }else{
        console.log('error');
       }
    });

    var modalPagos =null;
/////////////////////////////////////////////class modal///////////////////////////////////////////////////
        function clearData() {
            if (modalPagos != null) {
                modalPagos.destroy();
            }
            modalPagos = null;
            $('.prueba').off("click");
        }

        function openModalPagos() {
            modalPagos = new tingle.modal({
                closeMethods: [],
                footer: true,
                stickyFooter: true
            });
            var contentmodalpagos = $("<div>");
            contentmodalpagos.html($("<h1>").html('Forcing the user to use the close button'));
            contentmodalpagos.append($("<p>").html('Aepruebactetur. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.'));
            modalPagos.setContent(contentmodalpagos.get(0).outerHTML);
            modalPagos.addFooterBtn('Cerrar', 'tingle-btn tingle-btn--default tingle-btn--pull-right', function () {
                clearData();
            });
            $(".prueba").click(function () {
                alert("The paragraph was clicked.");
            });


            modalPagos.open();
        }
/////////////////////////////////////////////class menu///////////////////////////////////////////////////
    var bloomingMenu = new BloomingMenu({
      startAngle: -90,
      endAngle: 0,
      radius: 70,
      itemsNum: 3,
      itemAnimationDelay: 0.08
    });
    bloomingMenu.render();
	bloomingMenu.props.elements.items.forEach(function (item, index) {
	  item.addEventListener('click', function () { 
        switch (index) {
            case 0:
                openModalPagos();
              break;
            case 1:
              console.log("1was");
              break;
  
            default:
              console.log("No submenu registrado");
              break;
          }
	  })
	});
  //////////////////////////////////////////////////////////////////////////////////////////////////////
 
  
    function getidChat() {
        return Math.random().toString(30).substring(2);
    }
    $(document.body).append(`<div class="fabs" sessionchat="${getidChat()}">
              <div class="chat">
              <div class="chat_header">
                <div class="chat_option">
                  <div class="header_img">
                    <img src="logo.jpg" />
                  </div>
                  <span id="chat_head">Asistente</span> <br> <span class="agent"></span> <span class="online">(Online)</span>
                  <span id="chat_fullscreen_loader" class="chat_fullscreen_loader"><i
                      class="fullscreen zmdi zmdi-window-maximize"></i></span>
                </div>
              </div>

            <div id="chat_fullscreen" class="chat_conversion chat_converse"> 
            </div>

                <div class="fab_field">
                  <a id="fab_send" class="fab" onclick="insertMessage()" style="border: 0px;font-size: 16px;"><i
                      class="zmdi zmdi-mail-send"></i></a>
                  <textarea id="chatSend" placeholder="Escribir mensaje.." class="chat_field chat_message"></textarea>
                </div>
          </div>
      <a id="prime" class="fab"><i class="prime zmdi zmdi-comment-outline"></i></a>
    </div>`);
    $(".chat_conversion").mCustomScrollbar();
    setTimeout(function () {
        return setFakeMessage('¡Hola! ¿Cómo estás? ¿En qué puedo ayudarte hoy?');
    }, 100);
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
    ///////////////////////////////////////////////
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



    window.setFakeMessage = function (mensaje) {
		mensaje = mensaje.trim();
		mensaje = mensaje.replace(/\n\n/g,"</br>");
        var msg;
        msg = $("<span>").addClass("chat_msg_item chat_msg_item_admin");
        msg.html(` <div class="chat_avatar">
                        <img src="logo.jpg" />
                              </div>${mensaje}
                        <div class="status2">${formatDate(new Date())}</div>`);
        msg.appendTo($('.mCSB_container'));
        updateScrollbar();
    };

    window.insertMessage = function () {
        var typing, msgText;
        msgText = $("#chatSend").val();
        if ($.trim(msgText) === "") {
            return false;
        }
        typing = $("<span>").addClass("chat_msg_item chat_msg_item_user");
        typing.html(`  ${msgText}
                  <div class="status">${formatDate(new Date())}</div>`);
        typing.appendTo($('.mCSB_container'));
        updateScrollbar();
        $("#chatSend").val(null);
        $(".typingchat").remove(); 
        //////////
        $("#fab_send").hide();
        $("#chatSend").prop('disabled', true);
        /////////////////////////////////////////////////////////////////////////////////////
        setTimeout(function () {
            insertMessagetypingchat();
            $.post("ai.php", {
                    message: msgText,
                    session: $(".fabs").attr("sessionchat"),
                    iduser: $("#userId").val()
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

        //////////
    };



    window.insertMessagetypingchat = function () {
        var typing;
        typing = $("<span>").addClass("chat_msg_item chat_msg_item_admin typingchat");
        typing.html(` <div class="chat_avatar">
                              <img src="logo.jpg" />
                        </div><div class="waviy">
                        <span style="--i:1">.</span>
                        <span style="--i:2">.</span>
                        <span style="--i:3">.</span>
                        <span style="--i:4">.</span> 						
                              </div>`);
        typing.appendTo($('.mCSB_container'));
        updateScrollbar();
    };

    function updateScrollbar() {
        $("#chat_fullscreen").mCustomScrollbar("update");
        $("#chat_fullscreen").mCustomScrollbar('scrollTo', 'bottom');
    };

});
