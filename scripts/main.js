window.addEventListener('DOMContentLoaded',() => {
    // PRODUCTOS
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

    console.log("Hay "+nProds+" servicios disponibles: ");
    productos.forEach((prod)=>console.log(`   · ${prod.name}`));

    // FILTROS
    document.querySelector('#order-by').addEventListener('change',ordenarArray);
    function ordenarArray(){
        let value = document.querySelector('#order-by').value;
        let copiaArray = [...productos];

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

    mostrarProductos(productos)
    function mostrarProductos(arrProds){
        let htmlProductos = "";
        for (const product of arrProds) {
            htmlProductos += `<div>
                <input type="checkbox" name="${product.urlName}" id="${product.urlName}">
                <label for="${product.urlName}">
                    <div class="box" data-index="${product.id}" data-price="${product.price}">
                        <div class="imagen">
                            <img src="./img/${product.image}" alt="${product.name}" width="100%">
                        </div>
                        <h2>${product.name}</h2>
                    </div>
                </label>
            </div>`;
        }
        document.querySelector('.boxes').innerHTML = htmlProductos;
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
                const product = productos[index];
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
        let subtotal = 0;
        for (const producto of carrito) {
            subtotal += Number(producto.price);
        }
        // const subtotal = carrito.reduce((acumulador, product) => acumulador + (product.price * product.quantity));
        console.log("");
        console.log("Su subtotal actual es: "+subtotal+"$");
        document.querySelector('.subtotal').getElementsByTagName('span')[0].innerText = subtotal + '$';
        return subtotal;
    }

    // MOSTRAR IVA
    function mostrarIVA(){
        let iva = 0;
        for (const producto of carrito) {
            iva += Number(producto.calcIVA());
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