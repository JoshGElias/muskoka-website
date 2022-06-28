(function(document) {

    const PRODUCT_FIELDS = ['style', 'finish', 'material'];
    

    let addColours = (collection) => {
        const colourCollection = document.getElementById("colour-collection");
        [...colourCollection.children].forEach(node => collection.appendChild(node));
        colourCollection.parentNode.remove();
        colourCollection.remove();
    };

    let sortProducts = (collection) => {
        [...collection.children]
        .sort((a, b) => {
    
            // compare by style title
            let styleA = a.querySelector(".product-style");
            let styleB = b.querySelector(".product-style");
    
            // If both elements have style
            if(styleA.innerText && styleB.innerText) 
                return styleA.innerText.localeCompare(styleB.innerText);
            // If A has style and B does not
            else if(styleA.innerText && !styleB.innerText)
                return -1;
            // Vice Versa
            else if(styleB.innerText && !styleA.innerText)
                return 1;
            // compare by finish 
            else {
                let finishA = a.querySelector(".product-finish");
                let finishB = b.querySelector(".product-finish");
                return finishA.innerText.localeCompare(finishB.innerText);
            }
        })
        .forEach(node => collection.appendChild(node))
    }
      
    
    let buildProductList = () => {
        const PRODUCT_FIELDS = ['style', 'finish', 'material'];
        const productEls = document.getElementsByClassName("product-item");
        return Array.from(productEls).map(el => 
            PRODUCT_FIELDS.reduce((o, v) => {
                const fieldValue = el.getElementsByClassName("product-"+v)[0].innerHTML;
            
                // check if product has the field
                if(!fieldValue || !fieldValue.trim())
                    return o;
 
                return {
                    ...o,
                    [v]: fieldValue
                };
            }, {})
        );
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

    let getOnChange = (field, productMap) => {
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
        }
    }

    let attachSelectOnChange = (selectEls, productMap) => {
        for(const field of PRODUCT_FIELDS) {
            selectEls[field].onchange = getOnChange(field, productMap);
        }
    }

    let initResetButton = (selectEls, productCollection) => {
        // on reset button press, reset the filters
        const resetButton = document.getElementById('reset-button');
        resetButton.onclick = (e) => {
            buildSelectOptions(selectEls);
            sortProducts(productCollection);
        }
    }




    // NEW PROCESS
    const productCollection = document.getElementById("product-collection");
    
    // Build Product List
    const productList = buildProductList();
    console.log("productLust", productList);
return;
    // Sort List

    // Render List

    // Build Compatibility Map

    // Build Relevant Select Options

    // Render Select Inputs

    // Init Reset Button






    
    // Combine Doors and Colours

    
    // Attach data attributes for style, finish, material
    //colour-collection

    sortProducts(productCollection);

    // Get all the product elements


    // Build a map that indicates which fields are compatible with others
    const productMap = buildProductMap(productList);

    const selectEls = getSelectEls();
    initResetButton(selectEls, productCollection);
    attachSelectOnChange(selectEls, productMap);
    buildSelectOptions(selectEls);


})(document);