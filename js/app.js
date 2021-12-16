/**
 * Función que valida el inicio de sesión de un usuario
 * con su usuario y contraseña.
 */
$("#btnLogin").click(function () {
    if ($("#email").val() == "" || $.trim($("#contrasena").val()) == "") {
        alert("Por favor ingrese el correo y/o la contraseña");
    } else {
        let data = {
            email: $("#email").val(),
            password: $("#contrasena").val()
        };
        $.ajax({
            url: "http://localhost:8080/api/user/" + data.email + "/" + data.password,
            method: "GET",
            dataType: "json",
            success: function (response) {
                alert("Bienvenido " + response.name);
                localStorage.setItem("idUser", response.id);
                window.location.href = "./pages/inventario.html";

            }, error: function () {
                alert("No existe el usuario");
            }
        });
    }
});

/**
 * Función que registra a un nuevo usuario desde la pagina del login,
 * verificando que los campos no esten vacios y que las contraseñas
 * coincidan.
 */
 $("#btnRegistrarUsuarioLogin").click(function () {
    //Validando los campos vacios
    if ($.trim($("#nombreRegistroLogin").val()) == "" || $.trim($("#emailRegistroLogin").val()) == "" || $.trim($("#contrasenaRegistroLogin").val()) == "" || $.trim($("#contrasenaRegistro2Login").val()) == "") {
        alert("Por favor diligencie los campos obligatorios");
    } else {

        //Validando que las contraseñas coincidan
        if ($("#contrasenaRegistroLogin").val() != $("#contrasenaRegistro2Login").val()) {
            alert("Las contraseñas no coinciden");
        } else {

            //Validando que el nombre de usuario no exista en la base de datos
            let name = $("#nombreRegistroLogin").val();
            $.ajax({
                url: "http://localhost:8080/api/user/nameexist/" + name,
                method: "GET",
                dataType: "json",
                success: function (responseName) {
                    if (responseName) {
                        alert("El nombre de usuario ingresado ya existe, por favor digite otro");
                    } else {

                        //Validando que el email no exista en la base de datos
                        let email = $("#emailRegistroLogin").val();
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
                                        identification: $("#identificacionRegistroLogin").val(),
                                        name: $("#nombreRegistroLogin").val(),
                                        address: $("#direccionRegistroLogin").val(),
                                        cellPhone: $("#celularRegistroLogin").val(),
                                        email: $("#emailRegistroLogin").val(),
                                        password: $("#contrasenaRegistroLogin").val(),
                                        zone: $("#zonaRegistroLogin").val(),
                                        type: $("#tipoRegistroLogin").val()
                                    };
                                    console.log(datos);

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
 * Funcion que cambia el color del borde de los input de las contraseñas
 * cuando se crea un usuario a rojo si no coincide, si coinciden cambia
 * a verde.
 */
$("#contrasenaRegistro2Login").change(function () {
    if ($("#contrasenaRegistroLogin").val() != $("#contrasenaRegistro2Login").val()) {
        $("#contrasenaRegistro2Login").css("border-color", "red");
        $("#contrasenaRegistroLogin").css("border-color", "red");
    } else {
        $("#contrasenaRegistro2Login").css("border-color", "green");
        $("#contrasenaRegistroLogin").css("border-color", "green");
    }
});
