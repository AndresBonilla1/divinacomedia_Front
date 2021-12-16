/**
 * Función que carga los datos de la tabla inventario de productos
 * al cargar la pagina.
 */
 $(document).ready(function () {
    obtenerProductos();
});

/**
 * Funcion que obtiene todos los productos mediante una petición
 * GET usando ajax.
 */
function obtenerProductos() {
    $.ajax({
        url: "http://localhost:8080/api/hairproducts/all",
        method: "GET",
        dataType: "json",
        success: function (response) {
            pintarProductos(response);
        }, error: function () {
            alert("Productos no encontrados");
        }
    });
}
/**
 * Función que agrega los registros encontrados en la tabla de
 * inventario de productos.
 * 
 * @param {Productos encontrados} response 
 */
function pintarProductos(response) {
    let tabla = "";
    for (i = 0; i < response.length; i++) {
        tabla += "<tr>";
        tabla += "<td>" + '<button type="button" class="btn btn-outline-primary" onclick="almacenarRef(\'' + response[i].reference + '\')" data-bs-toggle="modal" data-bs-target="#modalInventarioE">Editar</button>' + "</td>";
        tabla += "<td>" + '<button type="button" class="btn btn-outline-danger" onclick="eliminarProducto(\'' + response[i].reference + '\')">Eliminar</button>' + "</td>";
        tabla += "<td>" + response[i].reference + "</td>";
        tabla += "<td>" + response[i].brand + "</td>";
        tabla += "<td>" + response[i].name + "</td>";
        tabla += "<td>" + response[i].category + "</td>";
        tabla += "<td>" + response[i].description + "</td>";
        tabla += "<td>" + response[i].availability + "</td>";
        tabla += "<td>" + response[i].price + "</td>";
        tabla += "<td>" + response[i].quantity + "</td>";
        tabla += "<td>" + '<img src="' + response[i].photography + '" class="imagenProducto">' + "</td>";
        tabla += "</tr>";
    }
    $("#tablaInventarioBody").html(tabla);
}

/**
 * Función que hace las validaciones requeridas para poder registrar
 * a un producto nuevo desde la tabla de inventario de productos.
 */
$("#btnRegistrarProducto").click(function () {
    //Validando los campos vacios
    if ($.trim($("#referenciaProducto").val()) == "" || $.trim($("#marcaProducto").val()) == "" || $.trim($("#nombreProducto").val()) == ""
    || $.trim($("#categoriaProducto").val()) == "" || $.trim($("#descripcionProducto").val()) == "" || $.trim($("#disponibilidadProducto").val()) == ""
    || $.trim($("#precioProducto").val()) == "" || $.trim($("#stockProducto").val()) == "" || $.trim($("#fotoProducto").val()) == "") {

        alert("Todos los campos obligatorios");
    } else {

        //Validando que no exista la referencia en la base de datos
        let reference = $("#referenciaProducto").val();
        $.ajax({
            url: "http://localhost:8080/api/hairproducts/existproduct/" + reference,
            method: "GET",
            dataType: "json",
            success: function (response) {
                if(response) {
                    alert("La referencia ya existe en la base de datos, digite otro")
                } else {

                    //Guardando el producto
                    let datos = {
                        reference: $("#referenciaProducto").val(),
                        brand: $("#marcaProducto").val(),
                        category: $("#categoriaProducto").val(),
                        name: $("#nombreProducto").val(),
                        description: $("#descripcionProducto").val(),
                        availability: $("#disponibilidadProducto").val(),
                        price: $("#precioProducto").val(),
                        quantity: $("#stockProducto").val(),
                        photography: $("#fotoProducto").val()
                    };

                    $.ajax({
                        url: "http://localhost:8080/api/hairproducts/new",
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
                                alert("Producto creado de forma correcta");
                                obtenerProductos();
                            },
                            400: function () {
                                console.log("Bad Request. No fue posible crear el producto");
                                alert("No fue posible crear el producto");
                            },
                            500: function () {
                                console.log("Error server. No fue posible crear el producto");
                                alert("No fue posible crear el producto");
                            }
                        }
                    });
                }
            }, error: function () {
                alert("Hubo un error al validar la existencia de la referencia")
            }
        });
    }
});

/**
 * Función que almacena en el local storage la referencia del producto.
 */
function almacenarRef(referencia) {
    localStorage.setItem('productoRef', referencia);
    console.log(localStorage.getItem('productoRef'));
}

/**
 * Función que hace las validaciones requeridas en el formulario
 * de editar producto y guarda las actualizaciones del producto.
 */
$("#btnEditarProducto").click(function () {
    //Validando los campos vacios
    if ($.trim($("#marcaProductoE").val()) == "" || $.trim($("#nombreProductoE").val()) == "" || $.trim($("#categoriaProductoE").val()) == ""
    || $.trim($("#descripcionProductoE").val()) == "" || $.trim($("#disponibilidadProductoE").val()) == "" || $.trim($("#precioProductoE").val()) == ""
    || $.trim($("#stockProductoE").val()) == "" || $.trim($("#fotoProductoE").val()) == "") {

        alert("Todos los campos obligatorios");
    } else {

        //Validando que no exista la referencia en la base de datos
        let reference = $("#referenciaProductoE").val();
        $.ajax({
            url: "http://localhost:8080/api/hairproducts/existproduct/" + reference,
            method: "GET",
            dataType: "json",
            success: function (response) {
                if(response) {
                    alert("La referencia ya existe en la base de datos, digite otro")
                } else {
                    //Guardando el producto
                    let datos = {
                        reference: localStorage.getItem('productoRef'),
                        brand: $("#marcaProductoE").val(),
                        category: $("#categoriaProductoE").val(),
                        name: $("#nombreProductoE").val(),
                        description: $("#descripcionProductoE").val(),
                        availability: $("#disponibilidadProductoE").val(),
                        price: $("#precioProductoE").val(),
                        quantity: $("#stockProductoE").val(),
                        photography: $("#fotoProductoE").val()
                    };

                    $.ajax({
                        url: "http://localhost:8080/api/hairproducts/update",
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
                                alert("Producto editado");
                                obtenerProductos();
                            },
                            400: function () {
                                console.log("Bad Request. Producto no editado");
                                alert("Producto no editado");
                            },
                            500: function () {
                                console.log("Error server. Producto no editado");
                                alert("Producto no editado");
                            }
                        }
                    });
                }
            }, error: function () {
                alert("Hubo un error al validar la existencia de la referencia")
            }
        });
    }
});

/**
 * Función que borra a un producto de la tabla de inventario
 * de productos con una petición DELETE con ajax.
 */
function eliminarProducto(referencia) {
    console.log(referencia);
    $.ajax({
        url: "http://localhost:8080/api/hairproducts/" + referencia,
        method: "DELETE",
        dataType: "json",
        success: function () {
            console.log("Producto con referencia " + referencia + " borrado de la BD");
            alert("Producto borrado de la BD");
            obtenerProductos();
        }, error: function () {
            alert("Hubo un error borrar el Producto");
        }
    });

}