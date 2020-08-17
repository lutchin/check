<?php

require __DIR__ . '/vendor/autoload.php';

use App\Payment;


$payment = new Payment('sk_test_ed731653-cb51-487b-a120-899c3d3f3aa9');

$data = json_decode(file_get_contents('php://input'));



$payment->setAmount($data->data->amount);
$payment->setCurrency($data->data->currency);
$payment->setToken($data->data->token);
$payment->setType('card');

print_r($payment->send());


