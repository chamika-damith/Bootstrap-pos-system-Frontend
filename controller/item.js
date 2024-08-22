var recordIndex;

document.addEventListener('DOMContentLoaded', function () {
    loadTable();
});

$('#IID').val("4hie8-mur9k0-kurnjl-12mj5");

function loadTable() {
    $('#ItemsTable').empty();

    $.ajax({
        url: "http://localhost:8080/pos/item",
        type: "GET",
        contentType: "application/json",
        success: (Response) => {
            const jsonString = Response.substring(0, Response.lastIndexOf(']') + 1);
            var ItemArray = JSON.parse(jsonString);

            ItemArray.forEach((item, index) => {
                let record = `
                     <tr>
                        <td class="item-id-value">${item.id}</td>
                        <td class="item-name-value">${item.name}</td>
                        <td class="item-price-value">${item.price}</td>
                        <td class="item-qty-value">${item.qty}</td>
                    <td>
                        <button class="btn btn-sm btn-outline-primary mx-2 " onclick="updateBtnClick(${index})">Edit</button>
                        <button class="btn btn-sm btn-outline-danger mx-2 " onclick="deleteBtnClick(${index})">Delete</button>
                    </td>
                    </tr>`;
                $("#ItemsTable").append(record);
            });

        },
        error: (res) => {
           
        }

    });
}

function checkEmptyField() {
    if ($('#IID').val() === "" ||
        $('#IName').val() === "" ||
        $('#IPrice').val() === "" ||
        $('#Iquentity').val() === "") {
        return true;
    } else {
        return false;
    }
}

$(".item_save_btn").on('click', () => {

    
    if (checkEmptyField()) {
        alert("please fill all fields");
    } else {
        let alertConfirm = confirm('Do you really want to add this item');
        if (alertConfirm) {


            const item = {
                id: $('#IID').val(),
                name: $('#IName').val(),
                price: $('#IPrice').val(),
                qty: $('#Iquentity').val()
            };

            
            $.ajax({
                url: "http://localhost:8080/pos/item",
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify(item),
                success: (Response) => {
                    loadTable();
                    startProgress();
                },
                error: (res) => {
                    alert('Error save');
                }

            });
            clearField();
        } else {
            clearField();
        }
    }
});

$("#ItemsTable").on('click', 'tr', function () {
    let index = $(this).index();
    recordIndex = index;

    let id = $(this).find(".item-id-value").text();
    let name = $(this).find(".item-name-value").text();
    let price = $(this).find(".item-price-value").text();
    let qty = $(this).find(".item-qty-value").text();

    $("#IID").val(id);
    $("#IName").val(name);
    $("#IPrice").val(price);
    $("#Iquentity").val(qty);
});

$("#ItemsTable").on('dblclick', 'tr', function () {
    let alertConfirmDelete = confirm('Do you really want to delete this item');
    if (alertConfirmDelete) {
        let index = $(this).index();
        recordIndex = index;
        $('.item_delete_btn').click();
    }
});

$(".item_delete_btn").on('click', () => {


    const item = {
        id: $('#IID').val(),
        name: $('#IName').val(),
        price: $('#IPrice').val(),
        qty: $('#Iquentity').val()
    };


    $.ajax({
        url: "http://localhost:8080/pos/item",
        type: "DELETE",
        contentType: "application/json",
        data: JSON.stringify(item),
        success: (Response) => {
            loadTable();
            startProgress();
        },
        error: (res) => {
            alert('Error delete item');
        }

    });
    clearField();
});

function deleteBtnClick(index) {
    $(".item_delete_btn").on('click', () => {
        startProgress();
        loadTable();
        clearField();
    });
}

function clearField() {
    $("#IName").val('');
    $("#IPrice").val('');
    $("#Iquentity").val('');
}

$(".item_update_btn").on('click', () => {

    if (checkEmptyField()) {
        alert("Please fill all fields");
    } else {
        const item = {
            id: $('#IID').val(),
            name: $('#IName').val(),
            price: $('#IPrice').val(),
            qty: $('#Iquentity').val()
        };

        $.ajax({
            url: "http://localhost:8080/pos/item",
            type: "PUT",
            contentType: "application/json",
            data: JSON.stringify(item),
            success: (Response) => {
                loadTable();
                startProgress();
            },
            error: (res) => {
                alert('Error updating');
            }

        });
        clearField();
    }
});

function updateBtnClick(recordIndex) {
    const item = {
        id: $('#IID').val(),
        name: $('#IName').val(),
        price: $('#IPrice').val(),
        qty: $('#Iquentity').val()
    };

    const itemJson = JSON.stringify(item);
    const http = new XMLHttpRequest();
    http.onreadystatechange = () => {
        if (http.readyState == 4) {
            if (http.status == 200) {
                const jsonTypeResponse = JSON.stringify(http.responseText);
                console.log(jsonTypeResponse);
                loadTable();
            } else {
                console.error("failed");
                console.error(http.status);
            }
        } else {
            console.log("Processing stage", http.readyState);
        }
    }

    http.open("PUT", "http://localhost:8080/pos/item", true);
    http.setRequestHeader("Content-Type", "application/json");
    http.send(itemJson);

    loadTable();
    clearField();
}


var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl)
})

function startProgress() {
    var progressBar = document.getElementById('progressBar');
    var width = 0;
    var interval = setInterval(function () {
        if (width >= 100) {
            clearInterval(interval);
            setTimeout(function () {
                // After 15 seconds, reset the progress bar if needed
                progressBar.style.width = '0%';
            }, 1500);
        } else {
            width++;
            progressBar.style.width = width + '%';
        }
    }, 5);
}
