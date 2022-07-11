(function(document) {

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

        let renderProducts = (collection, productEls) => {
            collection.replaceChildren(...productEls);
        }

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

        let getOnChange = (field, selectElMap, compatibilityMap, productList) => e => {
            if(!e.target.value) return;

            // What other fields are allowed
            var allowedValues = compatibilityMap[field][e.target.value];

            let selectedMap = { [field]: e.target.value };
            
            // When a style, finish or material is clicked, target the other select inputs
            PRODUCT_FIELDS.forEach(subField => {
                if(subField === field) return;

                // Remove all current options. Save which was selected.
                // Iterate backwards because the first element will always be the one selected 
                // and will pass off the selected status to the next element when deleted
                let i = selectElMap[subField].options.length;
                while(i--) {

                    if(!selectedMap[subField] && selectElMap[subField].options[i].selected) {  
                        selectedMap[subField] = selectElMap[subField].options[i].value;
                    }
                    selectElMap[subField].options.remove(i)
                }

                // If nothing in select was selected, add back the "Select <field>..." Option
                if(selectedMap[subField]) {
                    selectElMap[subField].options.add(new Option(selectedMap[subField], selectedMap[subField], true, true));
                    allowedValues[subField] = allowedValues[subField].filter((v) => v > selectedMap[subField]);
                } else {
                    selectElMap[subField].options.add(new Option("Select "+capitalize(subField)+"...", ""));
                }
                
                // Add all the allowed options
                allowedValues[subField].forEach(v => 
                    selectElMap[subField].add(
                        new Option(v, v, v === selectedMap[subField], v === selectedMap[subField]))) 
                        
            })

            // Filter and Rerender Products
            let filteredProducts = productList.filter(product => {
                var visibilityMap = {}; // I love maps!
                PRODUCT_FIELDS.forEach(f => {
                    if(!selectedMap[f]) 
                        return;
                        
                    visibilityMap[f] = product[f] === selectedMap[f]                 
                });

                for(const field in visibilityMap) {
                    if(!visibilityMap[field]) {
                        return false
                    }
                }
                
                return true;
            })
            .map(v => v.htmlElement);
            renderProducts(productCollection, filteredProducts);
        }
    
        let attachSelectOnChange = (selectElMap, compatibilityMap, productList) => {
            PRODUCT_FIELDS.forEach(field => {
                selectElMap[field].onchange = getOnChange(field, selectElMap, compatibilityMap, productList )
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

        let initResetButton = (productCollection, productEls, selectElMap, selectData) => {
            // on reset button press, reset the filters
            const resetButton = document.getElementById('reset-button');
            resetButton.onclick = () => {
                renderProducts(productCollection, productEls);
                setSelectOptions(selectElMap, selectData);
            }
        }
           

        // Build Product List
        const productEls = document.getElementsByClassName("product-item");
        let productList = buildProductList(productEls);;
    
        // Sort List
        productList = sortProducts(productList);

        const sortedProductEls = productList.map(v => v.htmlElement);
        const visibleProductEls = [...sortedProductEls];

        // Render List
        const productCollection = document.getElementById("product-collection");
        renderProducts(productCollection, visibleProductEls)

        // Build Compatibility Map
        const compatibilityMap = buildCompatibilityMap(productList);

        // Build Select Inputs
        const selectElMap = getSelectElMap();
        attachSelectOnChange(selectElMap, compatibilityMap, productList);
        const selectData = getSelectData();
        setSelectOptions(selectElMap, selectData);
        
        // Init Reset Button
        initResetButton(productCollection, sortedProductEls, selectElMap, selectData);
        
})(document);