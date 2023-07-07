<?php

namespace Controllers;

use Model\Usuario;
use MVC\Router;
use Classes\Email;

class LoginController
{
    public static function login(Router $router)
    {
        $alertas = [];
        $auth = new Usuario;

        if ($_POST) {
            $auth = new Usuario($_POST);

            $alertas = $auth->ValidarLogin();

            if (empty($alertas)) {
                //VERIFICAMOS SI EXISTE EL EMAIL
                $usuario = Usuario::where('email', $auth->email);

                if ($usuario) {
                    //VERIFICAMOS EL PASSWORD
                    if ($usuario->comprobarPasswordAndVerificado($auth->password)) {
                        //SE VERIFICO TODO 
                        session_start();

                        $_SESSION['id'] = $usuario->id;
                        $_SESSION['nombre'] = $usuario->nombre . ' ' . $usuario->apellido;
                        $_SESSION['email'] = $usuario->email;
                        $_SESSION['login'] = true;

                        if ($usuario->admin === '1') {
                            //ES ADMINISTRADOR
                            $_SESSION['admin'] = $usuario->admin ?? null;
                            header('Location: /admin');
                        } else {
                            //ES USUARIO
                            header('Location: /cita');
                        }
                    }
                } else {
                    Usuario::setAlerta('error', 'No exite el usuario');
                }
            }
        }

        $alertas = Usuario::getAlertas();

        $router->render('auth/login', [
            'alertas' => $alertas,
            'auth' => $auth
        ]);
    }
    public static function logout()
    {
        echo "DESDE LOHOUT";
    }
    public static function olvide(Router $router)
    {
        $alertas = [];

        if ($_POST) {
            $auth = new Usuario($_POST);

            $alertas = $auth->validarEmail();

            if (empty($alertas)) {
                //ENVIO EMAIL CORRECTAMENTA
                $usuario = $auth->where('email', $auth->email);

                if ($usuario && $usuario->confirmado === "1") {
                    //USUSARIO EXISTE Y ESTA CONFIRMADO
                    $usuario->createToken();
                    $usuario->guardar();

                    //ENVIAMOS CORREO DE RECUPERACION
                    $email = new Email($usuario->nombre, $usuario->email, $usuario->token);
                    $email->recuperarPassword();

                    Usuario::setAlerta('exito', 'Revisa tu email');
                } else {
                    Usuario::setAlerta('error', 'El usuario no existe o no esta verificado');
                }
            }
        }

        $alertas = Usuario::getAlertas();

        $router->render('auth/olvide-password', [
            'alertas' => $alertas
        ]);
    }
    public static function recuperar(Router $router)
    {
        $alertas = [];
        $error = false;
        $token = s($_GET['token']);

        //METODO QUE BUSCA POR COLUMNA Y VALOR
        $usuario = Usuario::where('token', $token);

        if (empty($usuario)) {
            Usuario::setAlerta('error', 'Token no valido');
            $error = true;
        }

        //VERIFICAMOS EL POST
        if ($_POST) {
            $auth = new Usuario($_POST);

            $alertas = $auth->validarPassword();

            if (empty($alertas)) {
                $usuario->password = $auth->password;
                $usuario->token = null;

                $usuario->hashPassword();
                $resultado = $usuario->guardar();

                if ($resultado) {
                    header('Location: /');
                }
            }
        }

        $alertas = Usuario::getAlertas();

        $router->render('auth/recuperar', [
            'alertas' => $alertas,
            'error' => $error
        ]);
    }
    public static function crear(Router $router)
    {
        $alertas = [];
        $usuario = new Usuario();
        if ($_POST) {
            $usuario->sincronizar($_POST);
            $alertas = $usuario->validarNuevaCuenta();

            if (empty($alertas)) {
                $resultado = $usuario->existeUsuario();
                if ($resultado->num_rows) {
                    $alertas = Usuario::getAlertas();
                } else {
                    //HASHEAMOS EL PASSWORD
                    $usuario->hashPassword();

                    //CREAMOS EL TOKEN DE VERIFICACION
                    $usuario->createToken();

                    //PHP MAILER PARA VERIFICAR TOKEN
                    $email = new Email($usuario->nombre, $usuario->email, $usuario->token);
                    $email->enviarConfirmacion();

                    //GUARDAMOS USUARIO
                    $resultado = $usuario->guardar();

                    if ($resultado) {
                        header('Location: /mensaje');
                    }
                }
            }
        }

        $router->render('auth/crear-cuenta', [
            'usuario' => $usuario,
            'alertas' => $alertas
        ]);
    }

    public static function confirmar(Router $router)
    {
        $alertas = [];

        //RECOGEMOS EL TOKEN DEL GET
        $token = s($_GET['token']);

        //METODO QUE BUSCA POR COLUMNA Y VALOR
        $usuario = Usuario::where('token', $token);

        if (empty($usuario)) {
            Usuario::setAlerta('error', 'Token no valido');
        } else {
            // Modificar a usuario confirmado
            $usuario->confirmado = "1";
            $usuario->token = null;
            $usuario->guardar();
            Usuario::setAlerta('exito', 'Cuenta Comprobada Correctamente');
        }

        $alertas = Usuario::getAlertas();

        $router->render('auth/confirmar-cuenta', [
            'alertas' => $alertas
        ]);
    }

    public static function mensaje(Router $router)
    {
        $router->render('auth/mensaje');
    }
}
