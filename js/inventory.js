const getData = async () => {
    const productGrid = $("#product_grid");
    const resp = await fetch("./assets/inventory.json");
    const json = await resp.json();
    json.forEach((element) => {
        const product = $(`
        <div class="col-12 col-sm-6 col-md-6 item_card  col-lg-3 border rounded-lg text-center">
        <div >
        <a href="/html/product.html?id=${
            element.id
        }" class=" text-reset text-decoration-none">
        <div class="mx-auto p-4">
          <img class="img-fluid p-3" src=${element.imageUrl}
            alt=${element.name}>
        </div>
        <div>
        <h4>${element.name}</h4>
        <h6>MRP: Rs.${element.mrp}</h6>
        </a>
          <button class="btn btn-primary mb-3" onclick='addToCart("${
              element.id
          }","${1}")'>Add to cart</button>
        </div>
      </div>
        </div>
        `);
        productGrid.append(product);
    });
};

function init() {
    getData();
}

$(document).ready(init);
