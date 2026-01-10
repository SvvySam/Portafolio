<?php

include("con_db.php");

if (isset($_POST['cliente'])){
   if(strlen($_POST['cliente']) >= 1 && strlen($_POST['correo']) < 1 && strlen($_POST['direccion']) >= 1 && strlen($_POST['numero']) < 1){
    $cliente = trim($_POST['cliente']);
    $correo = trim($_POST['correo']);
    $direccion = trim($_POST['direccion']);
    $numero = trim($_POST['numero']);
    $consulta = "INSERT INTO datos(cliente, correo, dirección, numero) VALUES ('$cliente','$correo','$direccion','$numero";
    $resultado = mysqli_query($conex,$consulta);
    if ($resultado) {
        ?>
        <h3 class="ok"> ¡Compra lista!</h3>
        <?php
    } else {
        ?>
        <h3 class="bad"> ¡Compra fallida!</h3>
        <?php
    }
}

}
?>