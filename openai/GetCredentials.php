<?php  
class GetCredentials {   
	private $url ='http://localhost/ai/json.php'; 
	function __construct($uu){
		$this->url = $uu; 	
    } 
    public function get(){ 
		$ch = curl_init();
		curl_setopt($ch, CURLOPT_URL,$this->url ); 
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true); 
		curl_setopt($ch, CURLOPT_HEADER, 0); 
		curl_setopt($ch, CURLOPT_TIMEOUT_MS, 20000 );  
		$response = curl_exec($ch);  
			if (curl_errno($ch)) { 
			     $salida="(".curl_errno($ch)."):".curl_error($ch);
			     curl_close($ch);
				return $salida;
			} 
		curl_close($ch); 
        return json_decode($response,false);
    }
	public function getkey()
	{
		$caracteres = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
		$longitud = 12;
		$longitud_caracteres = strlen($caracteres);
		$cadena_aleatoria = '';
		for ($c = 0; $c < $longitud; $c++) {
			$cadena_aleatoria .= $caracteres[random_int(0, $longitud_caracteres - 1)];
		}
		
		return $cadena_aleatoria;
	} 
}
?>