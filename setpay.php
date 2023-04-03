<?php 
 if ($_SERVER["REQUEST_METHOD"] == "POST") {  
  $idpay = $_POST['p'];  
  $monto = $_POST['n'];  
  if (!empty($idpay)&&!empty($monto)) {  
		require_once(__DIR__ . '/db/DbHandler.php');  
				$db = new DbHandler();      
				$db->addpaying($idpay,$monto); 
				echo json_encode(array("status"=>true, "data"=>"Datos registrados correctamente"));
   }
  else { 
	   echo json_encode(array("status"=>false, "data"=>'Error de ejecución: No data')); 
  } 
} 
?>