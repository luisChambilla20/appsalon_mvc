<?php

namespace Controllers;

use Model\Cita;
use Model\Servicios;

class APIController
{
    public static function index()
    {
        $servicios = Servicios::all();
        echo json_encode($servicios);
    }

    public static function guardar()
    {
        $servicio = new Cita($_POST);
        $respuesta = $servicio->guardar();
        echo json_encode($respuesta);
    }
}
