const getData = async () => {
    const productGrid = $("#product_grid");
    const resp = await fetch("./assets/inventory.json");
    const json = await resp.json();
    json.forEach((element) => {
        const product = $(`
        <a href="/html/product.html?id=${element.id}" class="col-3 border m-5 text-center text-reset text-decoration-none">
          <div class="row">
            <div class="col-10  mx-auto p-4">
              <img class="img-fluid  rounded img-thumbnail p-3 border-0 shadow-sm" src=${element.imageUrl}
                alt=${element.name}>
            </div>
            <div class="col-12">
              <h4>${element.name}</h4>
              <h6>MRP: Rs.${element.mrp}</h6>
            </div>
          </div>
        </a>
        `);
        productGrid.append(product);
    });
};

function init() {
    getData();
}

$(document).ready(init);
