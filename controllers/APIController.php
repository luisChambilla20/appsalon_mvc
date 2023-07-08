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
}
