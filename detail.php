<?php 
 if ($_SERVER["REQUEST_METHOD"] == "POST") {  
  $iduser = $_POST['u'];
  if (!empty($iduser)) {  
		require_once(__DIR__ . '/db/DbHandler.php');  
				$db = new DbHandler();     
				$outrerult=$db->getsessions($iduser); 
				 if(count($outrerult)>0){    
					echo json_encode(array("status"=>true, "data"=>$outrerult));  
				 }else{  
					echo json_encode(array("status"=>false, "data"=>'El usuario no cuenta con sesiones registradas.')); 
				 } 
   }
  else { 
	   echo json_encode(array("status"=>false, "data"=>'Error de ejecución: No data')); 
  } 
} 
?>