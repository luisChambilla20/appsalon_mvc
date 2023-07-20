<h1 class="nombre-pagina">Login</h1>
<p class="descripcion-pagina">Inicia sesion con tus datos</p>

<?php
include_once __DIR__ . '/../templates/alerta.php';
?>

<form action="/" method="post" class="formulario">
    <div class="campo">
        <label for="email">Email</label>
        <input type="email" id="email" placeholder="Tu email" name="email" value="<?= s($auth->email) ?>">
    </div>
    <div class="campo">
        <label for="password">Password</label>
        <input type="password" name="password" id="password" placeholder="Tu password">
    </div>
    <input type="submit" value="Iniciar Sesion" class="boton">
</form>

<div class="acciones">
    <a href="/crear-cuenta">¿Aun no tienes una cuenta? Crea una</a>
    <a href="/olvide-password">¿Olvidaste tu password?</a>
</div>


<?php
$script = "<script src='https://cdn.jsdelivr.net/npm/sweetalert2@11'></script>
           <script src='build/js/app.js'></script>";
?>