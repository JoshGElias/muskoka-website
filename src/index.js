// Iterate over products
var productEls = document.getElementsByClassName("product-item");
var productFields = ['style', 'finish', 'species'];

// Build Product List
var productList = [];
for (var i = 0; i < productEls.length; i++) {
    var product = {};
    for(const field of productFields) {
        product[field] = productEls[i].getElementsByClassName("product-"+field)[0].innerHTML;
    }
    productList.push(product);
}
 
// Build Product Map
var productMap = {};
for(const product of productList) {
    for(const field of productFields) {

        // Create new field if necessary
        if(!productMap[field]) {
            productMap[field] = {};
        }

        // Add new entry to field map
        var fieldValue = product[field];
        if(!productMap[field][fieldValue]) {
            productMap[field][fieldValue] = {};
        }

        for(const subField of productFields) {
            if(subField === field) continue;


            if(!productMap[field][fieldValue][subField]) {
                productMap[field][fieldValue][subField] = [];
            }

            var productValue = product[subField];
            if(!productMap[field][fieldValue][subField].includes(productValue)) {
                productMap[field][fieldValue][subField].push(productValue)
            }  
        }
    }
}
console.log(productMap);

