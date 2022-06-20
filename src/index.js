// Iterate over products
var productEls = document.getElementsByClassName("product-item");
var productFields = ['style', 'finish', 'material'];

// Build Product List
var productList = [];
for (var i = 0; i < productEls.length; i++) {
    var product = {};
    for(const field of productFields) {
        const value = productEls[i].getElementsByClassName("product-"+field)[0].innerHTML;
        // check if product has the field
        if(!value || !value.trim()) {
            continue;
        }
        product[field] = value
       
    }
    productList.push(product);
}
console.log('product list', productList);
 
// Build Product Map
var productMap = {};
for(const product of productList) {
    for(const field of productFields) {
        if(!product[field]) continue;

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

function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

var selectDict = {};
var getOnChange = (field) => {
    return e => {
        if(!e.target.value) return;

        // What other fields are allowed
        var allowedValues = productMap[field][e.target.value];
        
        // When a style, finish or material is clicked, target the other select inputs
        for(const subField of productFields) {
            if(subField === field) continue;

            while(selectDict[subField].options.length) {
                selectDict[subField].options.remove(0)
            }
            selectDict[subField].options.add(new Option("Select "+capitalize(subField)+"...", ""));
            allowedValues[subField].map((v) => selectDict[subField].options.add(new Option(v, v)));
        }
    }
}


var optionsDict = {};
for(const field of productFields) {
    selectDict[field] = document.getElementById("select-"+field);

    const collection = document.getElementById(field+"-collection")
                                .querySelectorAll("[collection-item="+field+"]")

    for(const option of collection) {
        selectDict[field].options.add(new Option(option.innerText, option.innerText));
    }

    selectDict[field].onchange = getOnChange(field);
    optionsDict[field] = selectDict[field].options;
}


