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
  if (!empty($mensaje)&&!empty($iduser)&&!empty($session)&&!empty($idapi)&&!empty($temperature)&&!empty($maxtoken)&&!empty($modelo)&&!empty($nombreuser)) { 
		require_once(__DIR__ . '/openai/OpenaiChat.php'); 
		require_once(__DIR__ . '/db/DbHandler.php');  
				        $db = new DbHandler();   
						$openai=new OpenaiChat($idapi,$modelo);
						$cdatavalue =$db->getCdata($session);
							$cdata =[];
							$mensajerol =[];
							$mensajerol['role']='user';
							$mensajerol['content']=$mensaje;
								if(count($cdatavalue)>0){
									$cdata=json_decode($cdatavalue[0]['cdata'],true); 
									$cdata[]=$mensajerol;
								}else{ 
									$cdata[]=$mensajerol;
								}
					 
						$idcompletions=$db->addPrompt($nombreuser,$iduser,$session,$mensaje,$temperature,$maxtoken,$modelo,json_encode($cdata)); 
						try {
							$response=$openai->getChatCompletions($cdata); 
							 if(!is_object($response)){
								$db->addCompletionError($idcompletions,$response);
								 throw new Exception($response);
							}
							if(property_exists($response, 'error')){ 
								$db->addCompletionError($idcompletions,$response->error->message);
								throw new Exception($response->error->message);
							} 
							$completionout= $response->choices[0]->message->content; 
							$mensajerolassit =[];
							$mensajerolassit['role']='assistant';
							$mensajerolassit['content']=$completionout;
							$cdata[]=$mensajerolassit;
							$db->addCompletion($idcompletions,$completionout,$response->usage->prompt_tokens,$response->usage->completion_tokens,$response->usage->total_tokens,$response->id,json_encode($cdata)); 
							$listacompletion=$db->getcompletion($idcompletions);  
							echo json_encode(array("status"=>true, "data"=>$listacompletion)); 
						} catch (Exception $e) { 
							echo json_encode(array("status"=>false, "data"=>'Error de ejecución: '.$e->getMessage())); 
						} 
				 
   }
  else { 
	   echo json_encode(array("status"=>false, "data"=>'Error de ejecución: No data')); 
  } 
} 
?>