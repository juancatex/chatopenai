<?php  
class OpenaiChat { 
    private $apisecret = ''; 
	private $modelo = 'gpt-3.5-turbo';  
	private $url = 'https://api.openai.com/v1/chat/completions'; 
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
		); 
		$ch = curl_init( $this->url);
		curl_setopt($ch, CURLOPT_POST, 1);
		curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
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
}
?>