<?php 
 if ($_SERVER["REQUEST_METHOD"] == "POST") {  
  $iduser = $_POST['u']; 
  $sessions = $_POST['s']; 
  if (!empty($iduser)&&!empty($sessions)) {  
		require_once(__DIR__ . '/db/DbHandler.php');  
				$db = new DbHandler();     
				$idpay=$db->addPay($iduser); 
				$db->addpayCompletion($idpay,$sessions); 
				echo json_encode(array("status"=>true, "data"=>"Datos registrados correctamente"));
   }
  else { 
	   echo json_encode(array("status"=>false, "data"=>'Error de ejecución: No data')); 
  } 
} 
?>