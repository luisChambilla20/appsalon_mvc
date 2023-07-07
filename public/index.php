<?php

require_once __DIR__ . '/../includes/app.php';

use Controllers\CitaController;
use Controllers\LoginController;
use MVC\Router;

$router = new Router();

/*=============================================
RUTAS PUBLICAS
=============================================*/
//LOGIN
$router->get('/', [LoginController::class, 'login']);
$router->post('/', [LoginController::class, 'login']);
$router->get('/logout', [LoginController::class, 'logout']);

//OLVIDE PASSWORD
$router->get('/olvide-password', [LoginController::class, 'olvide']);
$router->post('/olvide-password', [LoginController::class, 'olvide']);

//RECUPERAR PASSWORD
$router->get('/recuperar', [LoginController::class, 'recuperar']);
$router->post('/recuperar', [LoginController::class, 'recuperar']);

//CREAR CUENTAS
$router->get('/crear-cuenta', [LoginController::class, 'crear']);
$router->post('/crear-cuenta', [LoginController::class, 'crear']);

//VERFICIAR TOKEN
$router->get('/confirmar-cuenta', [LoginController::class, 'confirmar']);

//VISTA PARA CONFIRMAR
$router->get('/mensaje', [LoginController::class, 'mensaje']);




/*=============================================
RUTAS PRIVADAS
=============================================*/
$router->get('/cita', [CitaController::class, 'index']);






// Comprueba y valida las rutas, que existan y les asigna las funciones del Controlador
$router->comprobarRutas();
