<?php 
require_once(__DIR__ . '/vendor/autoload.php'); 
class OpenaiChat { 
    private $apisecret = ''; 
	private $modelo = 'gpt-3.5-turbo';  
	function __construct($api,$mod){
		$this->apisecret = $api;
		$this->modelo = $mod; 	
    } 
    public function getChatCompletions($men){ 
			$openaiClient = \Tectalic\OpenAi\Manager::build(new \GuzzleHttp\Client(), new \Tectalic\OpenAi\Authentication($this->apisecret));
			$response = $openaiClient->chatCompletions()->create(
				new \Tectalic\OpenAi\Models\ChatCompletions\CreateRequest([
					'model' =>$this->modelo,
					'messages' => $men,
				])
			)->toModel();
        return $response;
    }
}
?>