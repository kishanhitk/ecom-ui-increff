const getData = async () => {
    const productGrid = $("#product_grid");
    const resp = await fetch("./assets/inventory.json");
    const json = await resp.json();
    const sortBy = $("#sort_by").val();

    productGrid.empty();

    const isLowToHigh = sortBy === "price_low_high";

    const sorted = json.sort((a, b) => {
        if (isLowToHigh) {
            return a.mrp - b.mrp;
        } else {
            return b.mrp - a.mrp;
        }
    });
    sorted.forEach((element) => {
        const cartQuantity = getCartQuantity(element.id);
        const product = $(`
        <div class="col-12 col-sm-6 col-md-6 col-lg-3 p-4">
        <div class="item_card shadow rounded-lg text-center position-relative">
        <div >
        <a href="/html/product.html?id=${
            element.id
        }" class=" text-reset text-decoration-none">
        <div class="mx-auto p-4">
          <img class="img-fluid p-3" src=${element.imageUrl}
            alt=${element.name}>
            ${
                cartQuantity > 0
                    ? `<div class="badge badge-success ribbon position-absolute">Already in cart</div>`
                    : ""
            }
        </div>
        </a>
        <div>
        <h4>${element.name}</h4>
        <h6>MRP: Rs.${element.mrp}</h6>
          <button class="btn btn-primary mb-3" onclick='addToCart("${
              element.id
          }","${1}")'>Add to cart</button>
        </div>
      </div>
        </div>
        </div>
        `);
        productGrid.append(product);
    });
};

function init() {
    getData();
    $("#sort_by").on("change", getData);
}

$(document).ready(init);
