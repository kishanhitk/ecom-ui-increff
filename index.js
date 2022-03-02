const getData = async () => {
    const productGrid = $("#product_grid");
    const resp = await fetch("./assets/inventory.json");
    const json = await resp.json();
    json.forEach((element) => {
        const product = $(`
        <a href="/product.html" class="col-3 text-center text-reset text-decoration-none">
          <div class="row">
            <div class="col-10 mx-auto p-4">
              <img class="img-fluid rounded img-thumbnail p-3 border-0 shadow-sm" src=${element.imageUrl}
                alt=${element.name}>
            </div>
            <div class="col-12">
              <h4>${element.name}</h4>
            </div>
          </div>
        </a>
        `);
        productGrid.append(product);
    });
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
    getData();
    checkLoginState();
    $("#logout_button").click(logout);
}

$(document).ready(init);
