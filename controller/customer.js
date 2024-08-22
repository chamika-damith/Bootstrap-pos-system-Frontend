var recordIndex;

document.addEventListener('DOMContentLoaded', function () {
    loadTable();
});


$("#customerID").val("4hie8-mur9k0-kurnjl-12mj5");

function loadTable() {
    $('#customerTable').empty();


    $.ajax({
        url: "http://localhost:8080/pos/customer",
        type: "GET",
        contentType: "application/json",
        success: (Response) => {
            const jsonString = Response.substring(0, Response.lastIndexOf(']') + 1);
            var customerArray = JSON.parse(jsonString);
            customerArray.forEach((item, index) => {
                let record = `
                    <tr>
                        <td class="customer-id-value">${item.id}</td>
                        <td class="customer-name-value">${item.name}</td> 
                        <td class="customer-address-value">${item.address}</td>
                        <td class="customer-salary-value">${item.salary}</td> 
                        <td>
                            <button class="btn btn-sm btn-outline-primary mx-2" onclick="updateBtn(${index})">Edit</button>
                            <button class="btn btn-sm btn-outline-danger mx-2" onclick="deleteRecord(${index})">Delete</button>
                        </td>
                    </tr>`;
                $("#customerTable").append(record);
            });
        },
        error: (res) => {
            
        }

    });
}

function checkEmptyField() {
    var customerName = $('#customerName').val().trim();
    var customerAddress = $('#customerAddress').val().trim();
    var customerSalary = $('#customerSalary').val().trim();

    if (customerName === "" || customerAddress === "" || customerSalary === "") {
        return true;
    } else {
        return false;
    }
}

$(".save_btn").on('click', () => {

    if (checkEmptyField()) {
        alert("Please fill all fields");
    } else {
        let alertConfirm = confirm('Do you really want to add this customer');

        if (alertConfirm) {

            const customer = {
                id: $('#customerID').val(),
                name: $('#customerName').val(),
                address: $('#customerAddress').val(),
                salary: $('#customerSalary').val()
            };

            $.ajax({
                url: "http://localhost:8080/pos/customer",
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify(customer),
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

$("#customerTable").on('click', 'tr', function () {
    let index = $(this).index();
    recordIndex = index;

    let id = $(this).find(".customer-id-value").text();
    let name = $(this).find(".customer-name-value").text();
    let address = $(this).find(".customer-address-value").text();
    let salary = $(this).find(".customer-salary-value").text();

    $("#customerID").val(id);
    $("#customerName").val(name);
    $("#customerAddress").val(address);
    $("#customerSalary").val(salary);
});

$("#customerTable").on('dblclick', 'tr', function () {
    let alertConfirmDelete = confirm('Do you really want to delete this customer');
    if (alertConfirmDelete) {
        let index = $(this).index();
        recordIndex = index;
        $('.delete_btn').click();
    }
});

$(".delete_btn").on('click', () => {


    const customer = {
        id: $('#customerID').val(),
        name: $('#customerName').val(),
        address: $('#customerAddress').val(),
        salary: $('#customerSalary').val()
    };

    $.ajax({
        url: "http://localhost:8080/pos/customer",
        type: "DELETE",
        contentType: "application/json",
        data: JSON.stringify(customer),
        success: (Response) => {
            loadTable();
            startProgress();
            clearField();
        }

    });
});


function clearField() {
    $("#customerName").val('');
    $("#customerAddress").val('');
    $("#customerSalary").val('');
}

$(".update_btn").on('click', () => {


    if (checkEmptyField()) {
        alert("please fill the all fields")
    } else {
        const customer = {
            id: $('#customerID').val(),
            name: $('#customerName').val(),
            address: $('#customerAddress').val(),
            salary: $('#customerSalary').val()
        };


        $.ajax({
            url: "http://localhost:8080/pos/customer",
            type: "PUT",
            contentType: "application/json",
            data: JSON.stringify(customer),
            success: (Response) => {
                loadTable();
                startProgress();
                clearField();
            },
            error: (res) => {
                alert('Error updating');
            }
    
        });
    }
});


function startProgress() {
    var progressBar = document.getElementById('progressBarCus');
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