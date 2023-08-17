<?php 
 if ($_SERVER["REQUEST_METHOD"] == "POST") { 
  $mensaje = $_POST['message'];
  $session = $_POST['session'];
  $iduser = $_POST['iu'];
  $idapi = $_POST['k'];
  $temperature = $_POST['t'];
  $maxtoken = $_POST['x'];
  $modelo = $_POST['o'];
  $nombreuser = $_POST['n'];
  $mensajeini = $_POST['me'];
  $respuestaini = $_POST['res'];
  if (!empty($iduser)&&!empty($session)&&!empty($idapi)&&!empty($temperature)&&!empty($maxtoken)&&!empty($modelo)&&!empty($nombreuser)) { 
		require_once(__DIR__ . '/openai/OpenaiChat.php'); 
		require_once(__DIR__ . '/db/DbHandler.php');  
					try { 
						 $db = new DbHandler();   
						$openai=new OpenaiChat($idapi,$modelo);
						$cdatavalue =$db->getCdata($session);
							$cdata =[];
							$cdataux =[];
							$mensajerol =[];
							
						 if ($mensaje === null || $mensaje === '') {
								$mensajerol['role']='user';
								$mensajerol['content']=$mensajeini;
								$cdata[]=$mensajerol;
								$response=$openai->getChatCompletions($cdata); 
								if(!is_object($response)){ 
									throw new Exception($response);
								}
								if(property_exists($response, 'error')){ 
									$mensaje='';
									switch ($response->error->code) {
										
										case 400:
											$mensaje='Error 400 - CORS, contactese con el administrador del sistema.';
											break;
										case 401:
											$mensaje='Credenciales no válidas (401), contactese con el administrador del sistema.';
											break;
										case 402:
											$mensaje='Te quedaste sin credito (402), contactese con el administrador del sistema.';
											break;	
										case 403:
											$mensaje='Errorde modelo (403), contactese con el administrador del sistema.';
											break;	
										case 408:
											$mensaje='Se agotó el tiempo de espera de su solicitud (408), contactese con el administrador del sistema.';
											break;	
										case 429:
											$mensaje='Cuentas con una tarifa limitada (429), contactese con el administrador del sistema.';
											break;	
										case 502:
											$mensaje='Error del modelo elegido (502), contactese con el administrador del sistema.';
											break;	
										default:
										$mensaje='Error del servidor, contactese con el administrador del sistema.';
									} 
									throw new Exception($mensaje);
								}   
								$listacompletion=$response->choices[0]->message->content; 
							 
							 }else{
												$mensajerol['role']='user';
												$mensajerol['content']=$mensaje;
												if(count($cdatavalue)>0){
													$cdata=json_decode($cdatavalue[0]['cdata'],true); 
													$cdata[]=$mensajerol;
													$resultado = str_replace("[", '[{"role":"user","content":"'.$mensajeini.'"},{"role":"assistant","content":"'.$respuestaini.'"},',$cdatavalue[0]['cdata']);
													$cdataux=json_decode($resultado,true); 
													$cdataux[]=$mensajerol;
													
												}else{ 
													$cdata[]=$mensajerol; 
													$cdataux=json_decode('[{"role":"user","content":"'.$mensajeini.'"},{"role":"assistant","content":"'.$respuestaini.'"}]',true); 
													$cdataux[]=$mensajerol;
												}
									
											$idcompletions=$db->addPrompt($nombreuser,$iduser,$session,$mensaje,$temperature,$maxtoken,$modelo,json_encode($cdataux)); 
									
											$response=$openai->getChatCompletions($cdata); 
											if(!is_object($response)){
												$db->addCompletionError($idcompletions,$response);
												throw new Exception($response);
											}
											
											if(property_exists($response, 'error')){ 
												$mensaje='';
												switch ($response->error->code) {
													
													case 400:
														$mensaje='Error 400 - CORS, contactese con el administrador del sistema.';
														break;
													case 401:
														$mensaje='Credenciales no válidas (401), contactese con el administrador del sistema.';
														break;
													case 402:
														$mensaje='Te quedaste sin credito (402), contactese con el administrador del sistema.';
														break;	
													case 403:
														$mensaje='Errorde modelo (403), contactese con el administrador del sistema.';
														break;	
													case 408:
														$mensaje='Se agotó el tiempo de espera de su solicitud (408), contactese con el administrador del sistema.';
														break;	
													case 429:
														$mensaje='Cuentas con una tarifa limitada (429), contactese con el administrador del sistema.';
														break;	
													case 502:
														$mensaje='Error del modelo elegido (502), contactese con el administrador del sistema.';
														break;	
													default:
													$mensaje='Error del servidor, contactese con el administrador del sistema.';
												}
												$db->addCompletionError($idcompletions,$mensaje);
												throw new Exception($mensaje);
											} 
											$completionout= $response->choices[0]->message->content; 
											$mensajerolassit =[];
											$mensajerolassit['role']='assistant';
											$mensajerolassit['content']=$completionout;
											$cdata[]=$mensajerolassit;
											$response->id = 0;
											if($modelo!='openai/gpt-4'){ 
												$response->usage = new stdClass();
												$response->usage->prompt_tokens=1;
												$response->usage->completion_tokens=1;
												$response->usage->total_tokens=2;
											}   
											$db->addCompletion($idcompletions,$completionout,$response->usage->prompt_tokens,$response->usage->completion_tokens,$response->usage->total_tokens,$response->id,json_encode($cdata)); 
											$listacompletion=$db->getcompletion($idcompletions); 
							  }	
							  
							 

							echo json_encode(array("status"=>true, "data"=>$listacompletion)); 
						} catch (Exception $e) { 
							echo json_encode(array("status"=>false, "data"=>$e->getMessage())); 
						} 
				 
   }
  else { 
	   echo json_encode(array("status"=>false, "data"=>'Error de ejecución: No data')); 
  } 
} 
?>