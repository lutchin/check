<?php

namespace App;


class Payment {

    private $currency;

    private $amount;

    private $token;

    private $type;

    private $key;




    public function __construct($key)
    {
        $this->key = $key;
    }


    /**
     * @param mixed $currency
     */
    public function setCurrency($currency)
    {
        $this->currency = $currency;
    }

    /**
     * @param mixed $amount
     */
    public function setAmount($amount)
    {
        $this->amount = $amount;
    }

    /**
     * @param mixed $token
     */
    public function setToken($token)
    {
        $this->token = $token;
    }

    /**
     * @param mixed $type
     */
    public function setType($type)
    {
        $this->type = $type;
    }


    public function getParams($order)
    {
        $params = [
            "source" => [
                "type" =>"token",
                "token" => $this->token
                 ],
            "amount" => $this->amount,
            "currency" => $this->currency,
            "reference" => $order

        ];

        return json_encode($params);
    }


    public function send($order = "ORD-5023-4E89")
    {

        $curl = curl_init();

        curl_setopt_array($curl, [
            CURLOPT_URL => "https://api.sandbox.checkout.com/payments",
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => "",
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 0,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => "POST",
            CURLOPT_POSTFIELDS => $this->getParams($order),
            CURLOPT_HTTPHEADER => [
                "Authorization: ".$this->key,
                "Content-Type: application/json"
           ],
        ]);

        $response = curl_exec($curl);

        curl_close($curl);

        return $this->parseResponse($response);
    }


    public function parseResponse($response)
    {
        return $response;
    }

}