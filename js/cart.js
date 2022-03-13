const displayCartItems = async () => {
    let cartItems = getUserCart();
    const cartItemsList = $("#cart_items");
    cartItemsList.empty();
    if (cartItems) {
        const cartItemsArray = cartItems;
        const resp = await fetch("/assets/inventory.json");
        const json = await resp.json();
        cartItemsArray.forEach((item) => {
            const product = json.find(
                (element) => element.id === item.productId
            );
            const itemElement = `
            <div class="card my-3">
            <div class="card-header bg-transparent border-bottom-0">
            <button class="btn close"
                        onClick='deleteItemFromCart("${product.id}")'>
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
                        <p class="my-auto">${item.quantity}</p>
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
            cartItemsArray.forEach((item) => {
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
};

const deleteItemFromCart = (productId) => {
    const cartItems = getUserCart();
    if (cartItems) {
        const cartItemsArray = cartItems;
        const newCartItems = cartItemsArray.filter(
            (item) => item.productId != productId
        );
        updateUserCart(newCartItems);
    }
    displayCartItems();
};

function init() {
    displayCartItems();
    displayBillDetails();
    helloWord();
}

$(document).ready(init);
