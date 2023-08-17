<?php 
 if ($_SERVER["REQUEST_METHOD"] == "POST") {  
  $iduser = $_POST['u'];
  $modelo = $_POST['o'];
  $idapi = $_POST['k'];
  if (!empty($iduser)&&!empty($idapi)&&!empty($modelo)) {  
		require_once(__DIR__ . '/db/DbHandler.php');  
		require_once(__DIR__ . '/openai/OpenaiChat.php'); 
		        $openai=new OpenaiChat($idapi,$modelo);
				$db = new DbHandler();     
				$outrerult=$db->getsessions($iduser); 
				$response=$openai->getSaldo(); 
				if(!is_object($response)){
					echo json_encode(array("status"=>false, "data"=>'Error al momento de obtener el saldo.'));  
				}
				 
				if(property_exists($response, 'error')){ 
					echo json_encode(array("status"=>false, "data"=>'Error al momento de obtener el saldo  Cod.:'.$response->error->code));   
				} 

				
				if(count($outrerult)>0){    
					echo json_encode(array("status"=>true, "data"=>$outrerult, "saldo"=>round($response->data->limit_remaining*6.96,2)));  
				 }else{  
					echo json_encode(array("status"=>false, "data"=>'El usuario no cuenta con sesiones registradas.')); 
				 } 
   }
  else { 
	   echo json_encode(array("status"=>false, "data"=>'Error de ejecución: No data')); 
  } 
} 
?>