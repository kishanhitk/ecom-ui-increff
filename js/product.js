const populateData = async () => {
    console.log("Populating Data");
    const productId = window.location.search.split("=")[1];
    const resp = await fetch(`/assets/inventory.json`);
    const json = await resp.json();
    const product = json.find((element) => element.id == productId);

    if (product == undefined) {
        document.title = "Product Not Found | Increff Ecom";
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

const addProductToCart = async () => {
    const quantity = $("#quantity").val();
    const productId = window.location.search.split("=")[1];
    await addToCart(productId, quantity);
};

function init() {
    populateData();
    $("#add_to_cart").submit((event) => {
        event.preventDefault();
        addProductToCart();
    });
}

$(document).ready(init);
