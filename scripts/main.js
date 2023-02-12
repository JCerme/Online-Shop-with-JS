window.addEventListener('DOMContentLoaded',() => {
    // PRODUCTOS
    /*
    let nProds = 0;
    class Product{
        constructor(name,price,urlName,image){
            this.id = nProds++;
            this.name = name;
            this.price = Number(price);
            this.quantity = 1;
            this.image = image;
            this.urlName = urlName;
        }
        calcIVA(){
            return this.price * 0.21;
        }
    }

    let productos = [];
    productos.push(new Product("Seguridad",150,"seguridad","cybersecurity.png"));
    productos.push(new Product("Pago Online",220,"pagoOnline","crypto.png"));
    productos.push(new Product("Mantenimiento",20,"mantenimiento","maintenance.png"));
    productos.push(new Product("Optimización",95,"optimizacion","optimization.png"));
    productos.push(new Product("SEO",75,"seo","zoom.png"));
    productos.push(new Product("Diseño",50,"diseno","styles.png"));
    productos.push(new Product("Chat Online",200,"chatOnline","chat-online.png"));
    productos.push(new Product("Enlaces",15,"enlaces","links.png"));
    productos.push(new Product("Favoritos",50,"favoritos","favorite.png"));
    */
    let nProds = products.length;
    console.log("Hay "+nProds+" servicios disponibles: ");
    products.forEach((prod)=>console.log(`   · ${prod.name}`));

    // FILTROS
    document.querySelector('#order-by').addEventListener('change',ordenarArray);
    function ordenarArray(){
        let value = document.querySelector('#order-by').value;
        let copiaArray = [...products];

        if(value === "name-asc"){
            copiaArray.sort((a, b) => b.name.localeCompare(a.name));
        } else if(value === "name-desc"){
            copiaArray.sort((a, b) => a.name.localeCompare(b.name));
        } else if(value === "price-asc"){
            copiaArray.sort((a, b) => a.price - b.price);
        } else if(value === "price-desc"){
            copiaArray.sort((a, b) => b.price - a.price);
        }

        carrito = [];
        unselectAll();
        mostrarProductos(copiaArray);
    }

    mostrarProductos(products)
    function mostrarProductos(arrProds){
        let wrapper = document.querySelector(".boxes");
        wrapper.innerHTML = "";
        for (const product of arrProds) {
            let div = document.createElement("div");
                let input = document.createElement("input");
                input.type = "checkbox";
                input.name = product.urlName;
                input.id = product.urlName;
                let label = document.createElement("label");
                label.htmlFor = product.urlName;
                    let box = document.createElement("div");
                    box.classList = "box";
                    box.setAttribute("data-index",product.id);
                    box.setAttribute("data-price",product.price);
                        let imgDiv = document.createElement("div");
                        imgDiv.classList = "imagen";
                            let img = document.createElement("img");
                            img.src = "./img/"+product.image;
                            img.setAttribute("alt",product.name);
                            img.setAttribute("width","100%");
                            imgDiv.appendChild(img);
                        box.appendChild(imgDiv);
                        let h2 = document.createElement("h2");
                        h2.innerText = product.name;
                        box.appendChild(h2);
                    label.appendChild(box);
                div.appendChild(input);
                div.appendChild(label);
            wrapper.appendChild(div);
        }
        eventoCheckbox();
    }

    // AÑADIR O QUITAR DEL CARRITO
    let carrito = [];

    function eventoCheckbox(){
        const productsDOM = document.querySelector('.boxes').children;
        for(const el of productsDOM) {
            let box = el.querySelector('.box');
            let checkbox = el.getElementsByTagName('input')[0];
            // función que ejecutaran los checkbox al cambiar
            checkbox.addEventListener("change", () => {
                const index = box.getAttribute('data-index');
                const product = products[Number(index)-1];
                // comprobamos si está o no checkeado
                if (checkbox.checked) {
                    carrito.push(product);
                } else {
                    const index = carrito.indexOf(product);
                    carrito.splice(index, 1);
                }
                // calculamos y mostramos el total
                mostrarTotal();
            })
        }
        
    }


    // MOSTRAR SUBTOTAL
    function mostrarSubtotal(){
        const subtotal = carrito.reduce((acumulador, product) => acumulador + (Number(product.price) * Number(product.quantity)),0);
        console.log("");
        console.log("Su subtotal actual es: "+subtotal+"$");
        document.querySelector('.subtotal').getElementsByTagName('span')[0].innerText = subtotal + '$';
        return subtotal;
    }

    // MOSTRAR IVA
    function mostrarIVA(){
        let iva = 0;
        for (const producto of carrito) {
            iva += Number(producto.price * 0.21);
        }
        console.log("El IVA actual total es: "+Math.round((iva * 100))/100+"$");
        document.querySelector('.iva').getElementsByTagName('span')[0].innerText = Math.round((iva * 100))/100 + '$';
        return iva;
    }

    // MOSTRAR TOTAL
    function mostrarTotal(){
        let total = Math.floor(((mostrarSubtotal() + mostrarIVA()) * 100)) / 100;
        document.querySelector('.total').getElementsByTagName('span')[0].innerText = total + '$';
        console.log("Y EL TOTAL ACTUAL ES: "+total+"$");
    }

    // BOTÓN DESELECCIONAR TODO
    document.querySelector('#unselect').addEventListener('click', unselectAll);
    function unselectAll(){
        const productsDOM = document.querySelector('.boxes').children;
        for(const el of productsDOM) {
            if(el.getElementsByTagName('input')[0].checked){
                el.getElementsByTagName('input')[0].click();
            }
        }
    };

    // BOTÓN SELECCIONAR TODO
    document.querySelector('#select').addEventListener('click', selectAll);
    function selectAll(){
        const productsDOM = document.querySelector('.boxes').children;
        for(const el of productsDOM) {
            if(!el.getElementsByTagName('input')[0].checked){
                el.getElementsByTagName('input')[0].click();
            }
        }
    };
});