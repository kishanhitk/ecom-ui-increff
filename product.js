const populateData = async () => {
    const productId = window.location.search.split("=")[1];
    const resp = await fetch(`./assets/inventory.json`);
    const json = await resp.json();
    const product = json.find((element) => element.id == productId);
    console.log(product);
    $("#product_name").text(product.name);
    $("#product_mrp").text(`Rs. ${product.mrp}`);
    $("#product_image").attr("src", product.imageUrl);
    $("#product_description").text(product.description);
    $("#product_category").append(product.category);
    $("#product_brand").append(product.brandId);
    $("#product_style_id").append(product.styleId);
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
function init() {
    populateData();
    checkLoginState();
    $("#logout_button").click(logout);
}

$(document).ready(init);
