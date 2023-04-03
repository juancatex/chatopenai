<?php 
require_once(__DIR__ . '/vendor/autoload.php'); 
class Openai { 
    private $apisecret = '';
	private $maxtokens = 500;
	private $temperature = 0.5;
	private $modelo = 'text-davinci-003';  
	function __construct($api,$mod,$max,$tem){
		$this->apisecret = $api;
		$this->modelo = $mod;
		$this->maxtokens = $max;
		$this->temperature = $tem;		
    } 
    public function getCompletion($men){
        $openaiClient = \Tectalic\OpenAi\Manager::build(new \GuzzleHttp\Client(), new \Tectalic\OpenAi\Authentication($this->apisecret)); 
			$response = $openaiClient->completions()->create(
				new \Tectalic\OpenAi\Models\Completions\CreateRequest([
				'model'  => $this->modelo,
				'prompt' => $men,
				"max_tokens"=> $this->maxtokens,
				"temperature"=> $this->temperature,
				'n'=> 1,
				'stop'=> '\n'
				])
			)->toModel(); 
        return $response;
    }
}
?>