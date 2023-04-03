<?php 
 if ($_SERVER["REQUEST_METHOD"] == "POST") {  
  $iduser = $_POST['u'];
  $idsession = $_POST['s'];
  if (!empty($iduser)&&!empty($idsession)) {  
		require_once(__DIR__ . '/db/DbHandler.php');  
				$db = new DbHandler();     
				$outrerult=$db->getsessionHistory($iduser,$idsession); 
				 if(count($outrerult)>0){    
					echo json_encode(array("status"=>true, "data"=>$outrerult));  
				 }else{  
					echo json_encode(array("status"=>false, "data"=>'Error al obtener el historial')); 
				 } 
   }
  else { 
	   echo json_encode(array("status"=>false, "data"=>'Error de ejecución: No data')); 
  } 
} 
?>