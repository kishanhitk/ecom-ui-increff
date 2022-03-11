const displayCartItems = async () => {
    const cartItemsList = $("#cart_items");
    cartItemsList.empty();
    const cartItems = window.sessionStorage.getItem("cart");
    if (cartItems) {
        const cartItemsArray = JSON.parse(cartItems);
        const resp = await fetch("/assets/inventory.json");
        const json = await resp.json();
        cartItemsArray.forEach((item) => {
            const product = json.find(
                (element) => element.id == item.productId
            );
            const itemElement = `
            <div class="card my-3">
            <div class="card-body">
                <div class="d-flex align-items-center  justify-content-between">
                    <img src="${product.imageUrl}"  />
                    <div>

                        <h5 class="card-title">${product.name}</h5>
                        <h6>${product.brandId}</h6>
                    </div>
                    <div class="input-group w-auto justify-content-end align-items-center">
                    <button class="btn btn-light mx-3" onclick='decrementQuantity("${product.id}")' >-</button>
                    <p class="my-auto">${item.quantity}</p>
                    <button class="btn btn-light mx-3" onclick='incrementQuantity("${product.id}")' >+</button>
</div>                    <button class="btn" onClick='deleteItemFromCart("${product.id}")'>
                        <i class="material-icons">delete</i>
                    </button>
                </div>
            </div>
        </div>
            `;
            cartItemsList.append(itemElement);
        });
    }
};
const decrementQuantity = (productId) => {
    const cartItems = window.sessionStorage.getItem("cart");
    if (cartItems) {
        const cartItemsArray = JSON.parse(cartItems);
        const item = cartItemsArray.find(
            (element) => element.productId == productId
        );
        if (item) {
            if (item.quantity > 1) {
                item.quantity--;
            } else {
                cartItemsArray.splice(cartItemsArray.indexOf(item), 1);
            }
            window.sessionStorage.setItem(
                "cart",
                JSON.stringify(cartItemsArray)
            );
        }
    }
    displayCartItems();
};

const incrementQuantity = (productId) => {
    const cartItems = window.sessionStorage.getItem("cart");
    if (cartItems) {
        const cartItemsArray = JSON.parse(cartItems);
        const item = cartItemsArray.find(
            (element) => element.productId == productId
        );
        if (item) {
            item.quantity++;
            window.sessionStorage.setItem(
                "cart",
                JSON.stringify(cartItemsArray)
            );
        }
    }
    displayCartItems();
};

const deleteItemFromCart = (productId) => {
    const cartItems = window.sessionStorage.getItem("cart");
    if (cartItems) {
        const cartItemsArray = JSON.parse(cartItems);
        const newCartItems = cartItemsArray.filter(
            (item) => item.productId != productId
        );
        window.sessionStorage.setItem("cart", JSON.stringify(newCartItems));
    }
    displayCartItems();
};

function init() {
    displayCartItems();
}

$(document).ready(init);
