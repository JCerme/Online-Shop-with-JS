window.addEventListener('DOMContentLoaded',() => {
    // PRODUCTOS
    let nProds = 0;
    class Product{
        constructor(name,urlName,price,image){
            this.id = nProds++;
            this.name = name;
            this.urlName = urlName;
            this.price = Number(price);
            this.image = image;
        }
        calcIVA(){
            return this.price * 0.21;
        }
    }

    let productos = [];
    productos.push(new Product("Seguridad","seguridad",150,"cybersecurity.png"));
    productos.push(new Product("Pago Online","pagoOnline",220,"crypto.png"));
    productos.push(new Product("Mantenimiento","mantenimiento",20,"maintenance.png"));
    productos.push(new Product("Optimización","optimizacion",95,"optimization.png"));
    productos.push(new Product("SEO","seo",75,"zoom.png"));
    productos.push(new Product("Diseño","diseno",50,"styles.png"));
    productos.push(new Product("Chat Online","chatOnline",200,"chat-online.png"));
    productos.push(new Product("Enlaces","enlaces",15,"links.png"));
    productos.push(new Product("Favoritos","favoritos",50,"favorite.png"));

    console.log("Hay "+nProds+" servicios disponibles: ");

    let htmlProductos = "";
    for (const product of productos) {
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
        console.log(`   · ${productos[product.id].name}`);
    }
    document.querySelector('.boxes').innerHTML = htmlProductos;

    // AÑADIR O QUITAR DEL CARRITO
    let carrito = [];

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
    

    // MOSTRAR SUBTOTAL
    function mostrarSubtotal(){
        let subtotal = 0;
        for (const producto of carrito) {
            subtotal += Number(producto.price);
        }
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
        console.log("El IVA actual total es: "+iva+"$");
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
    document.querySelector('#unselect').addEventListener('click', () => {
        for(const el of productsDOM) {
            if(el.getElementsByTagName('input')[0].checked){
                el.getElementsByTagName('input')[0].click();
            }
        }
    });

    // BOTÓN SELECCIONAR TODO
    document.querySelector('#select').addEventListener('click', () => {
        for(const el of productsDOM) {
            if(!el.getElementsByTagName('input')[0].checked){
                el.getElementsByTagName('input')[0].click();
            }
        }
    });
});