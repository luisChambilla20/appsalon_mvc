<?php

namespace Controllers;

use Model\Servicios;

class APIController
{
    public static function index()
    {
        $servicios = Servicios::all();
        echo json_encode($servicios);
    }

    public static function envio()
    {
        $respuesta = [
            'datos' => $_POST
        ];

        echo json_encode($respuesta);
    }
}
