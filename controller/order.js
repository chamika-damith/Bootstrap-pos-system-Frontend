import { order } from '/db/db.js';
import orderModel from "../model/orderModel.js";


document.addEventListener('DOMContentLoaded', function () {
    loadAllItemsId();
    loadAllCustomerId();
    generateCurrentDate();



});

var rowid;
let selectedCustomerId;
let selectedItemId;
let orderQty;

var allTotal = 0;

$('#orderId').val("4hie8-mur9k0-kurnjl-12mj5");



function loadCart() {
    $(".tbody> tr").detach();

    for (var tc of order) {
        var row = `<tr>
            <td>${tc.itemcode}</td>
            <td>${tc.itemname}</td>
            <td>${tc.itemprice}</td>
            <td>${tc.qty}</td>
            <td>${tc.total}</td>
            <td><button class="btn btn-sm btn-outline-primary mx-2 remove-btn">Remove</button></td>
        </tr>`;
        $('#orderCart').append(row);
    }
}


$('#orderCart').on('click', '.remove-btn', function () {
    var row = $(this).closest('tr');
    var itemCode = row.find('td:first').text();
    row.remove();

    var indexToRemove = order.findIndex(function (tc) {
        return tc.itemcode === itemCode;
    });

    if (indexToRemove !== -1) {
        order.splice(indexToRemove, 1);
    }
});

function checkEmptyField() {

    if ($('#orderQty').val() === "" || $('#txtCash').val() === "" || $('#txtDiscount').val() === "") {
        return true;
    } else {
        return false;
    }
}

$("#btnPurchase").on('click', () => {

    if (checkEmptyField()) {
        alert("Please fill all fields");
    } else {
        let alertConfrim = confirm('Do you really want to Purchase this item');
        if (alertConfrim == true) {


            let itemArray = [];
            $("#orderCart .tbody> tr").each(function () {
                let Id = $(this).find("td:eq(0)").text().trim();
                let Name = $(this).find("td:eq(1)").text().trim();
                let Price = parseFloat($(this).find("td:eq(2)").text().trim());
                let Qty = parseInt($(this).find("td:eq(3)").text().trim());


                itemArray.push({
                    id: Id,
                    name: Name,
                    price: Price,
                    qty: Qty
                });
            });



            const order = {
                orderId: $('#orderId').val(),
                orderDate: $('#orderDate').val(),
                cusIdOption: $('#cusIdOption').val(),
                itemIdOption: $('#itemIdOption').val(),
                orderQty: $('#orderQty').val(),
                total: $('#total').val(),
                txtCash: $('#txtCash').val(),
                txtDiscount: $('#txtDiscount').val(),
                items: itemArray
            };

            $.ajax({
                url: "http://localhost:8080/pos/item",
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify(order),
                success: (Response) => {
                    updateQty();
                    $('#cusIdOption').val(null);
                    $('#itemIdOption').val(null);
                    $('#orderQty').val(null);
                    $('#total').val(null);
                    $('#txtCash').val(null);
                    $('#txtDiscount').val(null);
                    $('#subTotal').val(null);
                    startProgress();
                    $(".tbody> tr").detach();
                },
                error: (res) => {
                    alert('Error ordering');
                }

            });
        }
    }

});

function generateCurrentDate() {
    $("#orderDate").val(new Date().toISOString().slice(0, 10));
}

function loadAllCustomerId() {

    $('#cusIdOption').empty();

    const http = new XMLHttpRequest();
    http.onreadystatechange = () => {
        if (http.readyState == 4) {
            if (http.status == 200) {
                try {

                    const rawResponse = http.responseText;
                    const jsonString = rawResponse.substring(0, rawResponse.lastIndexOf(']') + 1);

                    var customerArray = JSON.parse(jsonString);

                    customerArray.forEach((item, index) => {
                        $('#cusIdOption').append(`<option>${item.id}</option>`);
                    });
                } catch (error) {
                    console.error("Failed to parse JSON:", error.message);
                }
            } else {
                console.error("Request failed with status:", http.status);
            }
        } else {
            console.log("Processing stage", http.readyState);
        }
    };

    http.open("GET", "http://localhost:8080/pos/customer", true);
    http.setRequestHeader("Content-Type", "application/json");
    http.send();
}

function loadAllItemsId() {
    $('#itemIdOption').empty();

    const http = new XMLHttpRequest();
    http.onreadystatechange = () => {
        if (http.readyState == 4) {
            if (http.status == 200) {
                try {

                    const rawResponse = http.responseText;
                    const jsonString = rawResponse.substring(0, rawResponse.lastIndexOf(']') + 1);

                    var ItemrArray = JSON.parse(jsonString);

                    ItemrArray.forEach((item, index) => {
                        $('#itemIdOption').append(`<option>${item.id}</option>`);
                    });
                } catch (error) {
                    console.error("Failed to parse JSON:", error.message);
                }
            } else {
                console.error("Request failed with status:", http.status);
            }
        } else {
            console.log("Processing stage", http.readyState);
        }
    };

    http.open("GET", "http://localhost:8080/pos/item", true);
    http.setRequestHeader("Content-Type", "application/json");
    http.send();
}



$('#cusIdOption').on('change', function () {
    selectedCustomerId = $('#cusIdOption option:selected').text();

    const http = new XMLHttpRequest();
    http.onreadystatechange = () => {
        if (http.readyState == 4) {
            if (http.status == 200) {
                try {
                    const rawResponse = http.responseText;
                    const customerObj = JSON.parse(rawResponse);

                    $('#orderCusName').val(customerObj.name);
                    $('#orderCusSalary').val(customerObj.salary);
                    $('#orderCusAddress').val(customerObj.address);
                    $('#itemIdOption').focus();
                } catch (error) {
                    console.error("Failed to parse JSON:", error.message);
                }
            } else {
                console.error("Request failed with status:", http.status);
            }
        } else {
            console.log("Processing stage", http.readyState);
        }
    };

    http.open("GET", `http://localhost:8080/pos/customer?id=${selectedCustomerId}`, true);
    http.setRequestHeader("Content-Type", "application/json");
    http.send();
});


$('#itemIdOption').on('change', function () {
    selectedItemId = $('#itemIdOption option:selected').text();


    const http = new XMLHttpRequest();
    http.onreadystatechange = () => {
        if (http.readyState == 4) {
            if (http.status == 200) {
                try {

                    const rawResponse = http.responseText;
                    const ItemrObj = JSON.parse(rawResponse);


                    $('#orderFormItemName').val(ItemrObj.name);
                    $('#orderFormPrice').val(ItemrObj.price);
                    $('#orderFormQtyOnHand').val(ItemrObj.qty);
                    $('#orderQty').focus();
                } catch (error) {
                    console.error("Failed to parse JSON:", error.message);
                }
            } else {
                console.error("Request failed with status:", http.status);
            }
        } else {
            console.log("Processing stage", http.readyState);
        }
    };

    http.open("GET", `http://localhost:8080/pos/item?id=${selectedItemId}`, true);
    http.setRequestHeader("Content-Type", "application/json");
    http.send();
});

function calTotal(itemPrice, orderQty) {
    let price = parseInt(itemPrice);
    let qty = parseFloat(orderQty);
    let total = price * qty;

    return total;
}

$("#btn_addItem").on('click', () => {
    if ($('#orderQty').val() === "") {
        alert("Please fill the order quantity");
    } else {
        orderQty = $('#orderQty').val();
        var itemPrice = $('#orderFormPrice').val();
        var CalTotal = calTotal(itemPrice, orderQty);
        var itemCode = $('#itemIdOption').val();
        var itemName = $('#orderFormItemName').val();


        allTotal += CalTotal;

        let orderObj = new orderModel(itemCode, itemName, itemPrice, orderQty, CalTotal);
        order.push(orderObj);


        var orderFormQtyOnHand = $('#orderFormQtyOnHand').val();
        var updateQty = orderFormQtyOnHand - orderQty;
        $('#orderFormQtyOnHand').val(updateQty);


        loadCart();
        calTotalAllItem();
        loadAllItemsId();
    }

});

function updateQty() {
    var orderFormQtyOnHand = $('#orderFormQtyOnHand').val();


    const http = new XMLHttpRequest();
    http.onreadystatechange = () => {
        if (http.readyState == 4) {
            if (http.status == 200) {
                try {

                    const rawResponse = http.responseText;
                    const ItemObj = JSON.parse(rawResponse);
                    updateQuentity(ItemObj.id, ItemObj.name, ItemObj.price, orderFormQtyOnHand);
                } catch (error) {
                    console.error("Failed to parse JSON:", error.message);
                }
            } else {
                console.error("Request failed with status:", http.status);
            }
        } else {
            console.log("Processing stage", http.readyState);
        }
    };

    http.open("GET", `http://localhost:8080/pos/item?id=${selectedItemId}`, true);
    http.setRequestHeader("Content-Type", "application/json");
    http.send();

}

function updateQuentity(id, name, price, qty) {
    const item = {
        id: id,
        name: name,
        price: price,
        qty: qty
    }

    const itemJson = JSON.stringify(item);

    const http = new XMLHttpRequest();
    http.onreadystatechange = () => {
        if (http.readyState == 4) {
            if (http.status == 200) {
                try {

                    const itemResponse = JSON.stringify(http.responseText);
                    if (itemResponse.match("Item update saved")) {
                        $('#orderFormQtyOnHand').val(qty);
                    }

                } catch (error) {
                    console.error("Failed to parse JSON:", error.message);
                }
            } else {
                console.error("Request failed with status:", http.status);
            }
        } else {
            console.log("Processing stage", http.readyState);
        }
    };

    http.open("PUT", "http://localhost:8080/pos/item", true);
    http.setRequestHeader("Content-Type", "application/json");
    http.send(itemJson);
}

function calTotalAllItem() {
    var totalAllItems = 0;
    order.forEach(item => {
        totalAllItems += item.total;
    });

    $('#total').val(totalAllItems);
    $('#subTotal').val(totalAllItems);
}

$("#orderQty").on('keyup', () => {
    var orderFormQtyOnHand = parseInt($('#orderFormQtyOnHand').val());
    var orderQty = parseInt($('#orderQty').val());
    var itemQtyPattern = /^\d+$/;
    var errorMessageQty = $('.errorOrderQty');
    var errorQty = $('.errorQty');


    if (!itemQtyPattern.test(orderQty)) {
        errorQty.show();
        $('#orderQty').css('border', '2px solid red');
    } else {
        errorQty.hide();
        $('#orderQty').css('border', '2px solid green');
    }

    if (orderQty > orderFormQtyOnHand) {
        $('#orderQtyValue').text(orderFormQtyOnHand);
        errorMessageQty.show();
    } else {
        errorMessageQty.hide();
    }
});

$('#txtCash').on('keyup', () => {
    let cashVal = parseInt($('#txtCash').val());
    let subTotal = parseInt($('#subTotal').val());
    var cashError = $('#cashError');

    $('#txtBalance').val(subTotal - cashVal);

    if (cashVal < subTotal) {
        cashError.show();
    } else {
        cashError.hide();
    }

});


$('#txtDiscount').on('input', () => {
    calculatePaymentDetails();
});

function calculatePaymentDetails() {
    const totalElement = document.getElementById('total');
    const subTotalElement = document.getElementById('subTotal');
    const cashElement = document.getElementById('txtCash');
    const discountElement = document.getElementById('txtDiscount');
    const balanceElement = document.getElementById('txtBalance');
    const cashErrorElement = document.getElementById('cashError');

    let total = parseFloat(totalElement.value) || 0;
    let cash = parseFloat(cashElement.value) || 0;
    let discountPercent = parseFloat(discountElement.value) || 0;

    let discount = (total * discountPercent) / 100;
    let subTotal = total - discount;
    subTotalElement.value = subTotal.toFixed(2);

    let balance = cash - subTotal;
    balanceElement.value = balance.toFixed(2);

    if (balance < 0) {
        cashErrorElement.style.display = 'block';
    } else {
        cashErrorElement.style.display = 'none';
    }
}

function startProgress() {
    var progressBar = document.getElementById('progressBarOrder');
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
