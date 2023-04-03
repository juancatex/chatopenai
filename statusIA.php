<?php
 if ($_SERVER["REQUEST_METHOD"] == "POST") {
	require_once(__DIR__ . '/openai/GetCredentials.php');
	 $db = new GetCredentials('http://localhost/ai/json2.php');
			    try {
					$outrerult=$db->get();
					if(!is_object($outrerult)){
						 throw new Exception($outrerult);
					}
					if(empty($outrerult->apikey_ia)||
					!is_numeric($outrerult->admin_ia)||
					!is_numeric($outrerult->max_token_ia)||
					empty($outrerult->mod_ia)||
					!((($outrerult->temperatura_ia))>=0)){
							throw new Exception('Requiere configuración completa de la Openai');  
					}
				    echo json_encode(array("status"=>true, "data"=>array("vd"=>$outrerult->admin_ia,
									"uic"=>'<div class="fabs" sessionchat="'.$db->getkey().'">
										<div class="chat">
											<div class="chat_header">
												<div class="chat_option">
													<div class="header_img">
													<img src="logo.jpg" />
													</div>
													<span id="chat_head">Asistente</span> <br> <span class="agent"></span> <span class="online">(Online)</span>
													<span id="chat_fullscreen_loader" class="chat_fullscreen_loader"><i
														class="fullscreen zmdi zmdi-window-maximize"></i></span>
													<span id="chat_details"  class="chat_fullscreen_loader" style="margin-right: 3px !important;"><i
														class=" zmdi zmdi-dns"></i></span>
													
												</div>
											</div>

											<div id="chat_fullscreen" class="chat_conversion chat_converse">
											</div>

											<div id="chat_detail" class="chat_body chat_converse is-hide" > 
											</div> 
										 
											<div class="fab_field">
												<a id="fab_send" class="fab" onclick="insertMessage()" style="border: 0px;font-size: 16px;"><i
													class="zmdi zmdi-mail-send"></i></a>
												<textarea id="chatSend" placeholder="Escribir mensaje.." class="chat_field chat_message"></textarea>
											</div>
									</div>
							<a id="prime" class="fab"><i class="prime zmdi zmdi-comment-outline"></i></a>
						</div>',
					"vr"=>array(
						"k"=>$outrerult->apikey_ia,
						"o"=>$outrerult->mod_ia,
						"i"=>$outrerult->idUser,
						"x"=>$outrerult->max_token_ia,
						"t"=>$outrerult->temperatura_ia,
						"n"=>$outrerult->nombreUser
						)
					)));
				} catch (Exception $e) {
					echo json_encode(array("status"=>false, "data"=>'Error de ejecución: '.$e->getMessage()));
				}
}
?>