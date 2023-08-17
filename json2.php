<?php 
$json = json_decode('{
	"idUser": 134,
	"nombreUser": "Jesus Adrian",
	"apikey_ia": "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",
	"mod_ia": "anthropic/claude-instant-v1",
	"max_token_ia": 500,
	"temperatura_ia": 0.5,
	"admin_ia":1
}');
 echo json_encode($json); 
?>