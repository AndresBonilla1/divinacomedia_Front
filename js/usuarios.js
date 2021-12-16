/**
 * Función que carga los datos de la tabla administración de usuarios
 * al cargar la pagina.
 */
$(document).ready(function () {
    obtenerUsuarios();
});

/**
 * Funcion que obtiene a todos los usuarios mediante una petición
 * GET usando ajax.
 */
function obtenerUsuarios() {
    $.ajax({
        url: "http://localhost:8080/api/user/all",
        method: "GET",
        dataType: "json",
        success: function (response) {
            pintarDatos(response);
        }, error: function () {
            alert("Usuarios no encontrados");
        }
    });
}
/**
 * Función que agrega los registros encontrados en la tabla de
 * administración de usuarios.
 * 
 * @param {Usuarios encontrados} response 
 */
function pintarDatos(response) {
    let tabla = "";
    for (i = 0; i < response.length; i++) {
        tabla += "<tr>";
        tabla += "<td>" + '<button type="button" class="btn btn-outline-primary" onclick="almacenarId(' + response[i].id + ')" data-bs-toggle="modal" data-bs-target="#modalUsuarioE">Editar</button>' + "</td>";
        tabla += "<td>" + '<button type="button" class="btn btn-outline-danger" onclick="eliminarUsuario(' + response[i].id + ')">Eliminar</button>' + "</td>";
        tabla += "<td>" + response[i].identification + "</td>";
        tabla += "<td>" + response[i].name + "</td>";
        tabla += "<td>" + response[i].email + "</td>";
        tabla += "<td>" + response[i].type + "</td>";
        tabla += "<td>" + response[i].zone + "</td>";
        tabla += "</tr>";
    }
    $("#tablaUsuariosBody").html(tabla);
}

/**
 * Función que limita la cantidad de caracteres ingresados a un input
 * tipo number, usandolo con el método oninput en la etiqueta HTML.
 * 
 * @param {*} object El objeto input number
 * @param {*} cantidad El limite de caracteres
 */
function limitandoCaracteres(object, cantidad) {
    if (object.value.length > cantidad) {
        object.value = object.value.slice(0, cantidad);
    }
}

/**
 * Función que cambia el color del borde de los input de las contraseñas
 * cuando se crea un usuario a rojo si no coincide, si coinciden cambia
 * a verde.
 */
$("#contrasenaRegistro2").change(function () {
    if ($("#contrasenaRegistro").val() != $("#contrasenaRegistro2").val()) {
        $("#contrasenaRegistro2").css("border-color", "red");
        $("#contrasenaRegistro").css("border-color", "red");
    } else {
        $("#contrasenaRegistro2").css("border-color", "green");
        $("#contrasenaRegistro").css("border-color", "green");
    }
});

/**
 * Función que cambia el color del borde de los input de las contraseñas
 * cuando se crea un usuario a rojo si no coincide, si coinciden cambia
 * a verde.
 */
$("#contrasenaRegistro2E").change(function () {
    if ($("#contrasenaRegistroE").val() != $("#contrasenaRegistro2E").val()) {
        $("#contrasenaRegistro2E").css("border-color", "red");
        $("#contrasenaRegistroE").css("border-color", "red");
    } else {
        $("#contrasenaRegistro2E").css("border-color", "green");
        $("#contrasenaRegistroE").css("border-color", "green");
    }
});

/**
 * Función que hace las validaciones requeridas para poder registrar
 * a un usuario nuevo desde la tabla de administración de usuarios.
 */
$("#btnRegistrarUsuario").click(function () {
    //Validando los campos vacios
    if ($.trim($("#nombreRegistro").val()) == "" || $.trim($("#emailRegistro").val()) == "" || $.trim($("#contrasenaRegistro").val()) == "" || $.trim($("#contrasenaRegistro2").val()) == "") {
        alert("Por favor diligencie los campos obligatorios");
    } else {

        //Validando que las contraseñas coincidan
        if ($("#contrasenaRegistro").val() != $("#contrasenaRegistro2").val()) {
            alert("Las contraseñas no coinciden");
        } else {

            //Validando que el nombre de usuario no exista en la base de datos
            let name = $("#nombreRegistro").val();
            $.ajax({
                url: "http://localhost:8080/api/user/nameexist/" + name,
                method: "GET",
                dataType: "json",
                success: function (responseName) {
                    if (responseName) {
                        alert("El nombre de usuario ingresado ya existe, por favor digite otro");
                    } else {

                        //Validando que el email no exista en la base de datos
                        let email = $("#emailRegistro").val();
                        $.ajax({
                            url: "http://localhost:8080/api/user/emailexist/" + email,
                            method: "GET",
                            dataType: "json",
                            success: function (responseEmail) {
                                if (responseEmail) {
                                    alert("El correo ingresado ya existe, por favor digite otro");
                                } else {

                                    //Guardando al usuario
                                    let datos = {
                                        identification: $("#identificacionRegistro").val(),
                                        name: $("#nombreRegistro").val(),
                                        address: $("#direccionRegistro").val(),
                                        cellPhone: $("#celularRegistro").val(),
                                        email: $("#emailRegistro").val(),
                                        password: $("#contrasenaRegistro").val(),
                                        zone: $("#zonaRegistro").val(),
                                        type: $("#tipoRegistro").val()
                                    };

                                    $.ajax({
                                        url: "http://localhost:8080/api/user/new",
                                        method: "POST",
                                        dataType: "json",
                                        data: JSON.stringify(datos),
                                        contentType: "application/json",
                                        Headers: {
                                            "Content-Type": "application/json"
                                        },
                                        statusCode: {
                                            201: function (response) {
                                                console.log(response);
                                                alert("Cuenta creada de forma correcta");
                                                obtenerUsuarios();
                                            },
                                            400: function () {
                                                console.log("Bad Request. No fue posible crear la cuenta");
                                                alert("No fue posible crear la cuenta");
                                            },
                                            500: function () {
                                                console.log("Error server. No fue posible crear la cuenta");
                                                alert("No fue posible crear la cuenta");
                                            }
                                        }
                                    });
                                }
                            }, error: function () {
                                alert("Hubo un error al validar la existencia del email")
                            }
                        });
                    }
                }, error: function () {
                    alert("Hubo un error al validar la existencia del nombre")
                }
            });
        }
    }
});

/**
 * Función que valida la existencia del email de un usuario,
 * si existe el email o hubo un error devuelve true, sino
 * devuelve false
 */
function validarEmail(email) {
    $.ajax({
        url: "http://localhost:8080/api/user/emailexist/" + email,
        method: "GET",
        dataType: "json",
        success: function (response) {
            return response;
        }, error: function () {
            alert("Hubo un error al validar la existencia del email")
            return true;
        }
    });
}

/**
 * Función que valida la existencia del nombre de un usuario,
 * si existe el nombre o hubo un error devuelve true, sino
 * devuelve false
 */
function validarName(name) {
    console.log("Entre a la funcion, antes de validar nombre");
    $.ajax({
        url: "http://localhost:8080/api/user/nameexist/" + name,
        method: "GET",
        dataType: "json",
        success: function (response) {
            console.log(response);
            return response;
        }, error: function () {
            alert("Hubo un error al validar la existencia del nombre")
            return true;
        }
    });
}

/**
 * Función que almacena en el local storage el id del usuario.
 */
function almacenarId(id) {
    localStorage.setItem('userId', id);
    console.log(localStorage.getItem('userId'));
}

/**
 * Función que hace las validaciones requeridas en el formulario
 * de editar usuario y guarda las actualizaciones del usuario.
 */
$("#btnEditarUsuario").click(function () {
    //Validando los campos vacios
    if ($.trim($("#nombreRegistroE").val()) == "" || $.trim($("#emailRegistroE").val()) == "" || $.trim($("#contrasenaRegistroE").val()) == "" || $.trim($("#contrasenaRegistro2E").val()) == "") {
        alert("Por favor diligencie los campos obligatorios");
    } else {

        //Validando que las contraseñas coincidan
        if ($("#contrasenaRegistroE").val() != $("#contrasenaRegistro2E").val()) {
            alert("Las contraseñas no coinciden");
        } else {

            //Validando que el nombre de usuario no exista en la base de datos
            let name = $("#nombreRegistroE").val();
            $.ajax({
                url: "http://localhost:8080/api/user/nameexist/" + name,
                method: "GET",
                dataType: "json",
                success: function (responseName) {
                    if (responseName) {
                        alert("El nombre de usuario ingresado ya existe, por favor digite otro");
                    } else {

                        //Validando que el email no exista en la base de datos
                        let email = $("#emailRegistroE").val();
                        $.ajax({
                            url: "http://localhost:8080/api/user/emailexist/" + email,
                            method: "GET",
                            dataType: "json",
                            success: function (responseEmail) {
                                if (responseEmail) {
                                    alert("El correo ingresado ya existe, por favor digite otro");
                                } else {

                                    console.log("guardando usuario");
                                    //Guardando al usuario
                                    let datos = {
                                        id: localStorage.getItem('userId'),
                                        identification: $("#identificacionRegistroE").val(),
                                        name: $("#nombreRegistroE").val(),
                                        address: $("#direccionRegistroE").val(),
                                        cellPhone: $("#celularRegistroE").val(),
                                        email: $("#emailRegistroE").val(),
                                        password: $("#contrasenaRegistroE").val(),
                                        zone: $("#zonaRegistroE").val(),
                                        type: $("#tipoRegistroE").val()
                                    };

                                    $.ajax({
                                        url: "http://localhost:8080/api/user/update",
                                        method: "PUT",
                                        dataType: "json",
                                        data: JSON.stringify(datos),
                                        contentType: "application/json",
                                        Headers: {
                                            "Content-Type": "application/json"
                                        },
                                        statusCode: {
                                            201: function (response) {
                                                console.log(response);
                                                alert("Usuario editado");
                                                obtenerUsuarios();
                                            },
                                            400: function () {
                                                console.log("Bad Request. Usuario no editado");
                                                alert("Usuario no editado");
                                            },
                                            500: function () {
                                                console.log("Error server. Usuario no editado");
                                                alert("Usuario no editado");
                                            }
                                        }
                                    });
                                }
                            }, error: function () {
                                alert("Hubo un error al validar la existencia del email")
                            }
                        });
                    }
                }, error: function () {
                    alert("Hubo un error al validar la existencia del nombre")
                }
            });
        }
    }
});

/**
 * Función que borra a un usuario de la tabla de administración
 * de usuarios con una petición DELETE con ajax.
 */
function eliminarUsuario(id) {
    console.log("id: " + id);
    $.ajax({
        url: "http://localhost:8080/api/user/" + id,
        method: "DELETE",
        dataType: "json",
        success: function (response) {
            console.log("Usuario con id " + id + " borrado de la BD");
            alert("Usuario borrado de la BD");
            obtenerUsuarios();
        }, error: function () {
            alert("Hubo un error borrar el usuario");
        }
    });

}
