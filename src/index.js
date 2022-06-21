(function(document) {

    const PRODUCT_FIELDS = ['style', 'finish', 'material'];
      
    let buildProductList = (elements) => {
        let productList = [];
        for (var i = 0; i < elements.length; i++) {
            let product = {};
            for(const field of PRODUCT_FIELDS) {
                const value = elements[i].getElementsByClassName("product-"+field)[0].innerHTML;
                // check if product has the field
                if(!value || !value.trim()) {
                    continue;
                }
                product[field] = value
            
            }
            productList.push(product);
        } 
        return productList;
    }

    let buildProductMap = (products) => {
        var productMap = {};
        for(const product of products) {
            for(const field of PRODUCT_FIELDS) {
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

                for(const subField of PRODUCT_FIELDS) {
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
        return productMap;
    }

    let getSelectEls = () => {
        let selectEls = {}
        return PRODUCT_FIELDS.reduce((obj, field) => {
            return {
                ...obj,
                [field]: document.getElementById("select-"+field),
            };
        }, selectEls);
    }

    let capitalize = (v) => v.charAt(0).toUpperCase() + v.slice(1);

    let getOnChange = (field) => {
        return e => {
            if(!e.target.value) return;

            // What other fields are allowed
            var allowedValues = productMap[field][e.target.value];
            
            // When a style, finish or material is clicked, target the other select inputs
            for(const subField of PRODUCT_FIELDS) {
                if(subField === field) continue;

                // Remove all current options. Save which was selected.
                // Iterate backwards because the first element will always be the one selected 
                // and will pass off the selected status to the next element when deleted
                var selectedValue;
                let foundSelected = false;
                let i = selectEls[subField].options.length;
                while(i--) {
                    if(!foundSelected && selectEls[subField].options[i].selected) {
                        selectedValue = selectEls[subField].options[i].value;
                        foundSelected = true;
                    }
                    selectEls[subField].options.remove(i)
                }

                // If nothing in select was selected, add back the "Select <field>..." Option
                if(selectedValue) {
                    selectEls[subField].options.add(new Option(selectedValue, selectedValue, true, true));
                    allowedValues[subField] = allowedValues[subField].filter((v) => v > selectedValue);
                } else {
                    selectEls[subField].options.add(new Option("Select "+capitalize(subField)+"...", ""));
                }
                
                allowedValues[subField].map((v) => {
                    selectEls[subField].options.add(
                        new Option(v, v, v === selectedValue, v === selectedValue)
                    )
                });
            }
        }
    }

    let buildSelectOptions = (selectEls) => {
        for(const field of PRODUCT_FIELDS) {
            selectEls[field] = document.getElementById("select-"+field);
            const collection = document.getElementById(field+"-collection")
                                        .querySelectorAll("[collection-item="+field+"]")

            while(selectEls[field].options.length) {
                selectEls[field].options.remove(0)
            }
            selectEls[field].options.add(new Option("Select "+capitalize(field)+"...", ""));
            for(const option of collection) {
                selectEls[field].options.add(new Option(option.innerText, option.innerText));
            }
            selectEls[field].onchange = getOnChange(field);
        }
    }

    let initResetButton = (selectEls) => {
        // on reset button press, reset the filters
        const resetButton = document.getElementById('reset-button');
        resetButton.onclick = (e) => {
            buildSelectOptions(selectEls);
        }
    }


    
    // Get all the product elements
    let productEls = document.getElementsByClassName("product-item");
    let productList = buildProductList(productEls);

    // Build a map that indicates which fields are compatible with others
    let productMap = buildProductMap(productList);
    let selectEls = getSelectEls();

    
    // Add the initial select options
    buildSelectOptions(selectEls);

    initResetButton(selectEls)

})(document);