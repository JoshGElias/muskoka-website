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
console.log('productMap', productMap);




var filterContainer = document.getElementById('filter-container');
//console.log('filter container', filterContainer)
var selectDict = {};


var getOnChange = (field) => {
    console.log('getting on change with field', field);
    return e => {
        if(!e.target.value) return;

        // What other fields are allowed
        //console.log(`looking up allowed values for: ${e.target.value}  in: ${field}`)
        var allowedValues = productMap[field][e.target.value];
        //console.log('allowed values', allowedValues);

        // When a style, finish or species is clicked, target the other select inputs
        for(const subField of productFields) {
            if(subField === field) continue;

            // Filter out options out of other lists
            //console.log('targeting OTHER select input', selectDict[subField]);
            for(const option of selectDict[subField]) {
                if(!option.value) continue;
                //console.log(option);

                //look up the "field" being filtered by
                if(allowedValues[subField].includes(option.value)) {
                    console.log(`hiding ${option.value}`)
                    option.setAttribute("hidden", "hidden");
                    //option.disable = true;
                }

                // if (option.value)
                //option.hidden = true
            }
        }
        //console.log(`${field} filter was clicked with: ${e.target.value}`);
    }
}

for(const field of productFields) {
    selectDict[field] = document.getElementById("select-"+field);
    //console.log('found select select input', selectDict[field]);
    selectDict[field].onchange = getOnChange(field);
    // Iterate over options and add event listener
}

