<?php 
$openai_secret = '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';
$url = 'https://api.openai.com/v1/chat/completions'; 
$model = 'gpt-3.5-turbo';
 $datar=[];
 $d1['role']='user';
 $d1['content']='cuales son los indicadores que se toman en cuenta para analisis de perfil hepatico en colestasis canina';
 $datar[]=$d1;
$data = array(
    'model' => $model,
    'messages' => $datar
); 
$headers = array(
    'Content-Type: application/json',
    'Authorization: Bearer ' . $openai_secret,
); 
$ch = curl_init($url);
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

$response = curl_exec($ch);
 

if (curl_errno($ch)) {
    echo 'Error:' . curl_error($ch);
} else { 
	$jsonData = json_decode($response,false);
	
	print_r($jsonData->choices);
} 
curl_close($ch);
?>