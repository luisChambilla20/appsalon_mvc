<h1 class="nombre-pagina">Olvide password</h1>
<p class="descripcion-pagina">Reestablece tu password escribiendo tu email a continuacion</p>

<?php
include_once __DIR__ . '/../templates/alerta.php';
?>

<form action="/olvide-password" method="post" class="formulario">
    <div class="campo">
        <label for="email">Email</label>
        <input type="email" name="email" id="email" placeholder="Tu email">
    </div>
    <input type="submit" value="Recuperar password" class="boton">
</form>

<div class="acciones">
    <a href="/">¿Ya tienes una cuenta? Inicia sesion</a>
    <a href="/crear-cuenta">¿Aun no tienes una cuenta? Crea una</a>
</div>