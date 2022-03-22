const displayCartItems = async () => {
    let cartItems = getUserCart();
    const cartItemsList = $("#cart_items");
    cartItemsList.empty();
    if (cartItems) {
        if (cartItems.length <= 0) {
            $("#cart_details").hide();
            $("#cart_empty").removeClass("d-none");
        }

        const cartItemsArray = cartItems;
        // TODO move data fetching to main.js
        const resp = await fetch("/assets/inventory.json");
        const json = await resp.json();

        cartItemsArray.forEach((item) => {
            const product = json.find(
                (element) => element.id === item.productId
            );
            // TODO: try to use clone()
            const itemElement = `
            <div class="card my-3">
            <div class="card-header bg-transparent border-bottom-0">
            <button class="btn close"
                        onClick='showDeleteItemModal("${product.id}")'>
                        <i class="material-icons">delete</i>
                    </button>
          </div>
            <div class="card-body mt-n5">
                <div class="row">
                    <img class="col-auto" src="${product.imageUrl}" />
                    <div class="col">
                        <h3 class="card-title">${product.name}</h3>
                        <h5 class="text-secondary">By ${product.brandId}</h5>
                        <h4 class="card-title">Rate: Rs. ${product.mrp}</h4>
                    </div>
                    <div class="col input-group col w-auto justify-content-end align-items-center">
                        <button ${
                            item.quantity <= 1 && "disabled"
                        } class="btn btn-light mx-3"
                            onclick='decrementQuantity("${
                                product.id
                            }")'>-</button>
                        <h5  class="my-auto">${item.quantity}</h5>
                        <button class="btn btn-light mx-3"
                            onclick='incrementQuantity("${
                                product.id
                            }")'>+</button>
                    </div>
                </div>
            </div>
        </div>
            `;
            cartItemsList.append(itemElement);
        });
        displayBillDetails(cartItems);
    }
};

const displayBillDetails = (cartItems) => {
    const billDetailsTable = $("#bill_details_table");
    billDetailsTable.find("tbody").empty();
    let billTotal = 0;
    const cartItemsArray = cartItems;
    const resp = fetch("/assets/inventory.json");
    resp.then((response) => {
        response.json().then((json) => {
            cartItemsArray?.forEach((item) => {
                const product = json.find(
                    (element) => element.id === item.productId
                );
                const itemElement = `
                    <tr>
                        <td>${product.name}</td>
                        <td>${product.mrp}</td>
                        <td>${item.quantity}</td>
                        <td>${product.mrp * item.quantity}</td>
                    </tr>
                    `;
                billDetailsTable.find("tbody").append(itemElement);
                billTotal += product.mrp * item.quantity;
            });
            billDetailsTable.find("tfoot").empty();
            const billTotalElement = `
                <tr>
                    
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>
                    <strong>
                    Rs. ${billTotal}
                    </strong>
                    </td>
                </tr>
                `;
            billDetailsTable.find("tfoot").append(billTotalElement);
        });
    });
};

const decrementQuantity = (productId) => {
    const cartItems = getUserCart();
    if (cartItems) {
        const cartItemsArray = cartItems;
        const item = cartItemsArray.find(
            (element) => element.productId == productId
        );
        if (item) {
            if (item.quantity > 1) {
                item.quantity--;
            } else {
                cartItemsArray.splice(cartItemsArray.indexOf(item), 1);
            }
            updateUserCart(cartItemsArray);
        }
    }
    displayCartItems();
    updateCartQuantityHeader();
};

const incrementQuantity = (productId) => {
    const cartItems = getUserCart();
    if (cartItems) {
        const cartItemsArray = cartItems;
        const item = cartItemsArray.find(
            (element) => element.productId == productId
        );
        if (item) {
            item.quantity++;
            updateUserCart(cartItemsArray);
        }
    }
    displayCartItems();
    updateCartQuantityHeader();
};

const showDeleteItemModal = (productId) => {
    $("#delete_item_modal").modal("show");
    // TODO: Use data method to set the value of the hidden input
    $("#delete_item_modal").find("input[name='data-item-id']").val(productId);
};

const deleteItemFromCart = () => {
    const productId = $("#delete_item_modal")
        .find("input[name='data-item-id']")
        .val();

    $("#delete_item_modal").modal("show");
    const cartItems = getUserCart();
    if (cartItems) {
        const cartItemsArray = cartItems;
        const newCartItems = cartItemsArray.filter(
            (item) => item.productId != productId
        );
        updateUserCart(newCartItems);
    }
    displayCartItems();
    updateCartQuantityHeader();
    $("#delete_item_modal").modal("hide");
};

const placeOrder = async () => {
    const cartItems = getUserCart();
    if (cartItems && cartItems.length > 0) {
        const resp = await fetch("/assets/inventory.json");
        const json = await resp.json();

        $("#success_modal").modal("show");
        // Convert cart items to CSV
        let csv = Papa.unparse(
            cartItems.map((item) => {
                const product = json.find(
                    (element) => element.id === item.productId
                );
                return {
                    productId: product.id,
                    productName: product.name,
                    brand: product.brandId,
                    price: product.mrp,
                    quantity: item.quantity,
                    total: product.mrp * item.quantity,
                };
            })
        );
        let blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        let fileUrl;

        if (navigator.msSaveBlob) {
            fileUrl = navigator.msSaveBlob(blob, "invoice.csv");
        } else {
            fileUrl = window.URL.createObjectURL(blob);
        }
        var tempLink = document.createElement("a");
        tempLink.href = fileUrl;
        tempLink.setAttribute("download", "invoice.csv");
        tempLink.click();
        // TODO: Delete templink after download
        // TODO: Store selectors in variables
        // Clear cart after order
        clearCartForCurrentUser();
    }
};

function init() {
    displayCartItems();
    displayBillDetails();
    $("#place_order_button").click(placeOrder);
}

$(document).ready(init);
