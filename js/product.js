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
        $("#product_storage").append(product.storage);
    }
};

const addToCart = async () => {
    const quantity = $("#quantity").val();

    const productId = window.location.search.split("=")[1];
    // Get existing cartMap object if any from localStorage
    const user = localStorage.getItem("user");
    if (!user) {
        window.location.href = "/html/login.html";
        return;
    }
    const userId = JSON.parse(user).email;
    let cartMap = JSON.parse(localStorage.getItem("cartMap")) ?? {};
    let userCart = cartMap.hasOwnProperty(userId) ? cartMap[userId] : [];
    // Find if product already exists in userCart
    const existingProduct = userCart.find(
        (element) => element.productId == productId
    );
    if (existingProduct) {
        // If product already exists, increment quantity
        existingProduct.quantity =
            parseInt(existingProduct.quantity) + parseInt(quantity);
    } else {
        // If product does not exist, add product to userCart
        userCart.push({ productId, quantity });
    }
    // Update userCart in localStorage
    cartMap[userId] = userCart;
    window.localStorage.setItem("cartMap", JSON.stringify(cartMap));
    $.notify("Item added to cart", "success");
    // Update cartMap count in header
    const cartCount = userCart.reduce(
        (acc, element) => acc + element.quantity,
        0
    );
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
