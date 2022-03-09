const populateData = async () => {
    const productId = window.location.search.split("=")[1];
    const resp = await fetch(`./assets/inventory.json`);
    const json = await resp.json();
    const product = json.find((element) => element.id == productId);

    if (product == undefined) {
        $("#product_detail").hide();
        $("#product_not_found").removeClass("d-none");
    } else {
        $("#product_name").text(product.name);
        $("#product_mrp").text(`Rs. ${product.mrp}`);
        $("#product_image").attr("src", product.imageUrl);
        $("#product_description").text(product.description);
        $("#product_category").append(product.category);
        $("#product_brand").append(product.brandId);
        $("#product_style_id").append(product.styleId);
    }
};
const logout = () => {
    window.sessionStorage.removeItem("user");
    window.location.href = "./login.html";
};
const checkLoginState = () => {
    const loginButton = $("#login_button");
    const logoutButton = $("#logout_button");
    console.log(window.sessionStorage.getItem("user"));
    window.sessionStorage.getItem("user")
        ? loginButton.hide()
        : logoutButton.hide();
};

const addToCart = async () => {
    const quantity = $("#quantity").val();

    const productId = window.location.search.split("=")[1];
    // Get existing cart object if any from sessionStorage
    let cart = window.sessionStorage.getItem("cart");
    cart = cart ? JSON.parse(cart) : [];
    // Find if product already exists in cart
    const existingProduct = cart.find(
        (element) => element.productId == productId
    );
    if (existingProduct) {
        // If product already exists, increment quantity
        existingProduct.quantity =
            parseInt(existingProduct.quantity) + parseInt(quantity);
    } else {
        // If product does not exist, add product to cart
        cart.push({ productId, quantity });
    }
    // Update cart in sessionStorage
    window.sessionStorage.setItem("cart", JSON.stringify(cart));
    $.notify("Item added to cart", "success");
    // // Update cart count in header
    const cartCount = cart.reduce((acc, element) => acc + element.quantity, 0);
    $("#cart_count").text(cartCount);
};

function init() {
    populateData();
    checkLoginState();
    $("#logout_button").click(logout);
    $("#add_to_cart").submit((event) => {
        event.preventDefault();
        addToCart(event);
    });
}

$(document).ready(init);
