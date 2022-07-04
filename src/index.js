//(function(document) {

    const PRODUCT_FIELDS = ['style', 'finish', 'material'];
    const PRODUCT_ID_KEY = 'productId';

    let buildProductList = (elements) => 
        [...elements].map((el, i) => {
            el.setAttribute(PRODUCT_ID_KEY, i);
            return PRODUCT_FIELDS.reduce((o, v) => {
                const fieldValue = el.getElementsByClassName("product-"+v)[0].innerHTML;
            
                // check if product has the field
                if(!fieldValue || !fieldValue.trim())
                    return o;
 
                return {
                    ...o,
                    id: i,
                    [v]: fieldValue
                };
            }, { htmlElement: el })
        });
        
    
    let sortProducts = (productList) =>
        [...productList]
        .sort((a, b) => {

            // First, compare by style
            // If both elements have style
            if(a.style && b.style) 
                return a.style.localeCompare(b.style);
            // If A has style and B does not
            else if(a.style && !b.style)
                return -1;
            // Vice Versa
            else if(b.style && !a.style)
                return 1;
            // compare by finish 
            else {
                return a.finish.localeCompare(b.finish);
            }
        });

        let buildCompatibilityMap = (products) =>
            products.reduce((obj, v) => {
                PRODUCT_FIELDS.forEach(field => {
                    if(!v[field]) return;
    
                    // Create new field if necessary
                    if(!obj[field]) {
                        obj[field] = {};
                    }
    
                    // Add new entry to field map
                    var fieldValue = v[field];
                    if(!obj[field][fieldValue]) {
                        obj[field][fieldValue] = {};
                    }
    
                    for(const subField of PRODUCT_FIELDS) {
                        if(subField === field) continue;
    
    
                        if(!obj[field][fieldValue][subField]) {
                            obj[field][fieldValue][subField] = [];
                        }
    
                        var productValue = v[subField];
                        if(!obj[field][fieldValue][subField].includes(productValue)) {
                            obj[field][fieldValue][subField].push(productValue)
                        }  
                    }
                })

                return obj;
            }, {});
        
        let getSelectElMap = () =>
            PRODUCT_FIELDS.reduce((obj, field) => {
                return {
                    ...obj,
                    [field]: document.getElementById("select-"+field),
                };
            }, {});

        let capitalize = (v) => v.charAt(0).toUpperCase() + v.slice(1);

        let getOnChange = (field, selectElMap, compatibilityMap) => e => {
            if(!e.target.value) return;

            // What other fields are allowed
            var allowedValues = compatibilityMap[field][e.target.value];
            console.log("allowed values: ", allowedValues);
            
            // When a style, finish or material is clicked, target the other select inputs
            PRODUCT_FIELDS.forEach(subField => {
                if(subField === field) return;
                console.log("looking at subfield: ", subField);
                // Remove all current options. Save which was selected.
                // Iterate backwards because the first element will always be the one selected 
                // and will pass off the selected status to the next element when deleted
                var selectedValue;
                let foundSelected = false;
                let i = selectElMap[subField].options.length;
                while(i--) {

                    if(!foundSelected && selectElMap[subField].options[i].selected) {  
                        selectedValue = selectElMap[subField].options[i].value;
                        console.log("found selected option: ", selectedValue);
                        foundSelected = true;
                    }
                    console.log("removing option: ", selectElMap[subField].options[i])
                    selectElMap[subField].options.remove(i)
                }

                // If nothing in select was selected, add back the "Select <field>..." Option
                if(selectedValue) {
                    console.log("re-adding selected option");
                    selectElMap[subField].options.add(new Option(selectedValue, selectedValue, true, true));
                    allowedValues[subField] = allowedValues[subField].filter((v) => v > selectedValue);
                } else {
                    console.log("Addingg 'Select...' Option");
                    selectElMap[subField].options.add(new Option("Select "+capitalize(subField)+"...", ""));
                }
                

                allowedValues[subField].forEach(v => 
                    selectElMap[subField].add(
                        new Option(v, v, v === selectedValue, v === selectedValue)))           
            })
        }
    
        let attachSelectOnChange = (selectElMap, compatibilityMap) => {
            PRODUCT_FIELDS.forEach(field => {
                selectElMap[field].onchange = getOnChange(field, selectElMap, compatibilityMap )
            });
        }


        let getSelectData = () => 
            PRODUCT_FIELDS.reduce((obj, field) => {
                const fieldOptions = document.getElementById(field+"-collection")
                                             .querySelectorAll("[collection-item="+field+"]");
                return {
                    ...obj,
                    [field]: [...fieldOptions].map(opt => opt.innerText)      
                }               
            }, {})



        let setSelectOptions = (selectElMap, selectData) => {
            PRODUCT_FIELDS.forEach(field => {
                while(selectElMap[field].options.length) {
                    selectElMap[field].options.remove(0)
                }

                selectElMap[field].options.add(new Option("Select "+capitalize(field)+"...", ""));


                [...selectData[field]].forEach(v => {
                    selectElMap[field].options.add(new Option(v, v));
                })
            })
        }

        let initResetButton = (selectElMap) => {
            // on reset button press, reset the filters
            const resetButton = document.getElementById('reset-button');
            resetButton.onclick = () => buildSelectOptions(selectElMap);
        }
    
            

        // Build Product List
        const productEls = document.getElementsByClassName("product-item");
        let productList = buildProductList(productEls);
        //console.log("productList", productList);
    
        // Sort List
        productList = sortProducts(productList);
        let sortedProductEls = productList.map(v => v.htmlElement);

        // Render List
        const productCollection = document.getElementById("product-collection");
        productCollection.replaceChildren(...sortedProductEls);

        // Build Compatibility Map
        const compatibilityMap = buildCompatibilityMap(productList);
        console.log(compatibilityMap);

        // Build Select Inputs
        const selectElMap = getSelectElMap();
        attachSelectOnChange(selectElMap, compatibilityMap);
        const selectData = getSelectData();
        setSelectOptions(selectElMap, selectData);
        
        // Init Reset Button
        initResetButton(selectElMap);
        
//})(document);