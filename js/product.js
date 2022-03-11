const populateData = async () => {
    console.log("Populating Data");
    const productId = window.location.search.split("=")[1];
    const resp = await fetch(`/assets/inventory.json`);
    const json = await resp.json();
    const product = json.find((element) => element.id == productId);

    if (product == undefined) {
        $("#product_detail").hide();
        $("#product_not_found").removeClass("d-none");
    } else {
        document.title = product.name + " | Increff Ecom";
        $("#product_name").text(product.name);
        $("#product_mrp").text(`Rs. ${product.mrp}`);
        $("#product_image").attr("src", product.imageUrl);
        $("#product_description").text(product.description);
        $("#product_category").append(product.category);
        $("#product_brand").append(product.brandId);
        $("#product_style_id").append(product.styleId);
    }
};

const addToCart = async () => {
    const quantity = $("#quantity").val();

    const productId = window.location.search.split("=")[1];
    // Get existing cart object if any from localStorage
    let cart = window.localStorage.getItem("cart");
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
    // Update cart in localStorage
    window.localStorage.setItem("cart", JSON.stringify(cart));
    $.notify("Item added to cart", "success");
    // Update cart count in header
    const cartCount = cart.reduce((acc, element) => acc + element.quantity, 0);
    $("#cart_count").text(cartCount);
};

function init() {
    populateData();
    $("#add_to_cart").submit((event) => {
        event.preventDefault();
        addToCart(event);
    });
}

$(document).ready(init);
