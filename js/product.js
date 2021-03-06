const populateData = async () => {
    // TODO: CHeck alternate method to get id
    // TODO: Use URL class to get id
    const parsedUrl = new URL(window.location.href);
    const productId = parsedUrl.searchParams.get("id");
    const resp = await fetch(`/assets/db/inventory.json`);
    const json = await resp.json();
    const product = json.find((element) => element.id == productId);
    // TODO: use !product
    if (!product) {
        document.title = "Product Not Found | Increff Ecom";
        //  TODO: use d-none  class instead of hide()
        $("#product_detail").addClass("d-none");
        $("#product_not_found").removeClass("d-none");
    } else {
        const quantity = await getCartQuantity(productId);
        if (quantity > 0) {
            // Don't show badge
            $("#already_in_cart_badge").removeClass("d-none");
            $("#already_in_cart_badge").text(`${quantity} in cart`);
            $("#add_to_cart_btn").addClass("d-none");
            $("#go_to_cart_btn").removeClass("d-none");
            $("#quantity").html(quantity);
        }
        document.title = product.name + " | Increff Ecom";
        // TODO: Use .find() instead of accessing DOM everytime
        $("#product_name").text(product.name);
        $("#product_mrp").text(`Rs. ${product.mrp}`);
        $("#product_image").attr("src", "/assets/images/" + product.imageUrl);
        $("#product_description").text(product.description);
        $("#product_category").append(product.category);
        $("#product_brand").append(product.brandId);
        $("#product_storage").append(product.storage);
    }
};

const addProductToCart = async (quantity) => {
    const parsedUrl = new URL(window.location.href);
    const productId = parsedUrl.searchParams.get("id");
    await addToCart(productId, quantity);
    location.reload();
};

const incrementQuantity = () => {
    const $quantity = $("#quantity");
    let currentQuantity = Number($quantity.text());
    $quantity.html(currentQuantity + 1);
};

const decrementQuantity = () => {
    const $quantity = $("#quantity");
    let currentQuantity = Number($quantity.text());
    if (currentQuantity <= 1) return;
    $quantity.html(currentQuantity - 1);
};

function init() {
    populateData();
    $("#add_to_cart").submit((event) => {
        event.preventDefault();
        addProductToCart();
    });
}

$(document).ready(init);
