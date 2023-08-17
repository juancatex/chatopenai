<?php  
class OpenaiChat { 
    private $apisecret = ''; 
	private $modelo = 'openai/gpt-4';  
	// private $modelo = 'openai/gpt-4-32k';  
	private $url = 'https://openrouter.ai/api/v1/chat/completions'; 
	private $urlkeys = 'https://openrouter.ai/api/v1/auth/key'; 
	function __construct($api,$mod){
		$this->apisecret = $api;
		$this->modelo = $mod; 	
    } 
    public function getChatCompletions($men){ 
		$data = array(
			'model' => $this->modelo,
			'messages' => $men
		); 
		$headers = array(
			'Content-Type: application/json',
			'Authorization: Bearer ' . $this->apisecret,
			'HTTP-Referer: http://vetsoft.com.bo/',
			'X-Title: VetSoft',
		); 
		$ch = curl_init( $this->url);
		curl_setopt($ch, CURLOPT_POST, 1);
		curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
		// curl_setopt($ch, CURLOPT_TIMEOUT_MS, 20000 );  
		$response = curl_exec($ch);  
			if (curl_errno($ch)) { 
			     $salida="(".curl_errno($ch)."):".curl_error($ch);
			     curl_close($ch);
				return $salida;
			} 
		curl_close($ch);  
        return json_decode($response,false);
    }
	public function getSaldo(){ 
	 
		$headers = array(
			'Content-Type: application/json',
			'Authorization: Bearer ' . $this->apisecret,
			'HTTP-Referer: http://vetsoft.com.bo/',
			'X-Title: VetSoft',
		); 
		$ch = curl_init( $this->urlkeys);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);  
		$response = curl_exec($ch);  
			if (curl_errno($ch)) { 
			     $salida="(".curl_errno($ch)."):".curl_error($ch);
			     curl_close($ch);
				return $salida;
			} 
		curl_close($ch);   
        return json_decode($response,false); 
    }
}
?>