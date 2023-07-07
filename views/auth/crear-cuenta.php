<h1 class="nombre-pagina">Crear cuenta</h1>
<p class="descripcion-pagina">Crea una cuenta con tus datos</p>

<?php
include_once __DIR__ . '/../templates/alerta.php';
?>

<form action="/crear-cuenta" method="post" class="formulario">
    <div class="campo">
        <label for="nombre">Nombre</label>
        <input type="nombre" id="nombre" placeholder="Tu nombre" name="nombre" value="<?php echo s($usuario->nombre); ?>">
    </div>
    <div class="campo">
        <label for="apellido">Apellido</label>
        <input type="apellido" name="apellido" id="apellido" placeholder="Tu apellido" value="<?php echo s($usuario->apellido); ?>">
    </div>
    <div class="campo">
        <label for="telefono">Telefono</label>
        <input type="telefono" name="telefono" id="telefono" placeholder="Tu telelefono" value="<?php echo s($usuario->telefono); ?>">
    </div>
    <div class="campo">
        <label for="email">Email</label>
        <input type="email" name="email" id="email" placeholder="Tu email" value="<?php echo s($usuario->email); ?>">
    </div>
    <div class="campo">
        <label for="password">Password</label>
        <input type="password" name="password" id="password" placeholder="Tu password">
    </div>
    <input type="submit" value="Crear cuenta" class="boton">
</form>

<div class="acciones">
    <a href="/">¿Ya tienes una cuenta? Inicia sesion</a>
    <a href="/olvide-password">¿Olvidaste tu password?</a>
</div>