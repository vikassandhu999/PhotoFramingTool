<?php

$name = $_POST['name'];
$email = $_POST['email'];
$subject = $_POST['subject'];
$body = $_POST['body'];


$url = 'https://api.sendgrid.com/';
$user = 'vikassandhu999@gmail.com';
$pass = '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';


$params = array(
    'api_user' => $user , 
    'api_key'   => $pass,
    'to'        => 'vikassandhu999@gmail.com',
    'subject'   => $subject,
    'html'      => $body,
    'text'      => 'plain text',
    'from'      => $email,
);


$request =  $url.'api/mail.send.json';

// Generate curl request
$session = curl_init($request);
// Tell curl to use HTTP POST
curl_setopt ($session, CURLOPT_POST, true);
// Tell curl that this is the body of the POST
curl_setopt ($session, CURLOPT_POSTFIELDS, $params);
// Tell curl not to return headers, but do return the response
curl_setopt($session, CURLOPT_HEADER, false);
// Tell PHP not to use SSLv3 (instead opting for TLS)
curl_setopt($session, CURLOPT_SSLVERSION, CURL_SSLVERSION_TLSv1_2);
curl_setopt($session, CURLOPT_RETURNTRANSFER, true);

// obtain response
$response = curl_exec($session);
curl_close($session);

// print everything out
echo $response;

?>
