window.addEventListener('DOMContentLoaded',() => {
    // FETCH
    let COURSES;
    fetch("/scripts/courses.json")
        .then(response => response.json())
        .then(data => {
            COURSES = data;
            fetchProduct();
            showCourses(COURSES);
        });

    // PRODUCTOS
    let nProds;
    function fetchProduct(){
        nProds = COURSES.length;
        console.log("Hay "+nProds+" servicios disponibles: ");
        COURSES.forEach((prod)=>console.log(`   · ${prod.name}`));
    }
    
    // LOCAL STORAGE
    let cart = JSON.parse(localStorage.getItem('CARRITO'));
    if(!localStorage.getItem("CARRITO")){
        localStorage.setItem('CARRITO', '[]');
    }

    // ORDER BY
    document.querySelector('#order-by').addEventListener('change',orderArray);
    function orderArray(){
        let value = document.querySelector('#order-by').value;
        let copiaArray = [...COURSES];

        if(value === "name-asc"){
            copiaArray.sort((a, b) => b.name.localeCompare(a.name));
        } else if(value === "name-desc"){
            copiaArray.sort((a, b) => a.name.localeCompare(b.name));
        } else if(value === "price-asc"){
            copiaArray.sort((a, b) => a.price - b.price);
        } else if(value === "price-desc"){
            copiaArray.sort((a, b) => b.price - a.price);
        }

        showCourses(copiaArray);
    }

    // SHOW COURSES
    function showCourses(arrProds){
        let wrapper = document.querySelector(".boxes");
        wrapper.innerHTML = "";

        for (const product of arrProds) {
            let box = document.createElement("div");
            box.classList = "box";
            box.setAttribute("data-index",product.id);
            box.setAttribute("data-price",product.price);

            // CHECK IF ALREADY IN CART
            cart = JSON.parse(localStorage.getItem('CARRITO'));
            let imgDiv = document.createElement("div");
            imgDiv.classList = "imagen";
                let img = document.createElement("img");
                img.src = "./img/"+product.img;
                img.setAttribute("alt",product.name);
                img.setAttribute("width","100%");
                imgDiv.appendChild(img);
            box.appendChild(imgDiv);
            let h2 = document.createElement("h2");
            h2.innerText = product.name;
            box.appendChild(h2);
            let author = document.createElement("span");
            author.classList.add("author");
            author.innerText = "Ofrecido por: " + product.entity;
            box.appendChild(author);
            let categories = document.createElement("div");
            categories.classList.add("categories");
                for (const catName of product.category) {
                    let cat = document.createElement("span");
                    cat.innerText = catName;
                    categories.appendChild(cat)
                }
            box.appendChild(categories)
            let addCart = document.createElement("div");
            addCart.classList.add("cart");
                let stock = document.createElement("div");
                    let remove = document.createElement("button");
                    remove.classList.add("removeStock");
                    remove.addEventListener("click", removeStock);
                    remove.innerText = "-";
                    stock.appendChild(remove);
                    let stockAct = document.createElement("span");
                    stockAct.innerText = product.quantity;
                    stock.appendChild(stockAct);
                    let plus = document.createElement("button");
                    plus.classList.add("addStock");
                    plus.addEventListener("click", addStock);
                    plus.innerText = "+";
                    stock.appendChild(plus);
                let cartBtn = document.createElement("button");
                cartBtn.classList.add("add-to-cart");
                cartBtn.addEventListener("click", addToCart);
                cartBtn.innerText = "Añadir";
            addCart.appendChild(stock);
            addCart.appendChild(cartBtn);
            box.appendChild(addCart);
            wrapper.appendChild(box);
        }
    }

    // AÑADIR O QUITAR DEL CARRITO
    function addToCart(e){
        let id = Number(e.target.parentElement.parentElement.getAttribute("data-index"));
        let qty = Number(e.target.parentElement.querySelector('span').innerText);
        let founded = false;
        let prod = COURSES.find(product => product.id === Number(id));
        prod.quantity = qty;

        cart = JSON.parse(localStorage.getItem("CARRITO"));
        for (const item of cart) {
            if(item.id === id){
                founded = true;
                item.quantity = item.quantity + qty;
            }
        }
        if(!founded){
            cart.push(prod);
        }

        localStorage.setItem('CARRITO', JSON.stringify(cart));

        Swal.fire({
            title: '¡Producto añadido correctamente!',
            text: `Se ha añadido el curso "${prod.name}" (${prod.quantity} unidades) al carrito.`,
            icon: 'success',
            showConfirmButton: false,
            timer: 2000
        })
        
        counter();
        showTotal()
        showCart()
    }

    // ADD STOCK
    function addStock(e){
        let qty = e.target.parentElement.querySelector('span').innerText;
        e.target.parentElement.querySelector('span').innerText = Number(qty) + 1;
    }
    function addStockCart(e){
        let id = Number(e.target.parentElement.parentElement.getAttribute('data-id'));
        cart = JSON.parse(localStorage.getItem("CARRITO"));

        for (const item of cart) {
            if(item.id === id){
                item.quantity = item.quantity + 1;
            }
        }

        localStorage.setItem("CARRITO", JSON.stringify(cart)); 

        document.querySelector('#cart').classList.toggle('visible');
        counter();
        showCart();
    }

    // REMOVE STOCK
    function removeStock(e){
        let qty = e.target.parentElement.querySelector('span').innerText;
        if(Number(qty) > 1){
            e.target.parentElement.querySelector('span').innerText = Number(qty) - 1;
        }
    }
    function removeStockCart(e){
        let id = Number(e.target.parentElement.parentElement.getAttribute('data-id'));
        cart = JSON.parse(localStorage.getItem("CARRITO"));

        cart.forEach((item, index)=>{
            if(item.id === id){
                if(item.quantity>1){
                    item.quantity = item.quantity - 1;
                } else {
                    cart.splice(index,1)
                }
            }
        })

        localStorage.setItem("CARRITO", JSON.stringify(cart)); 

        document.querySelector('#cart').classList.toggle('visible');
        counter();
        showCart();
    }

    // MOSTRAR SUBTOTAL
    function showSubtotal(){
        const subtotal = cart.reduce((acumulador, product) => acumulador + (Number(product.price) * Number(product.quantity)),0);
        document.querySelector('.subtotal').getElementsByTagName('span')[0].innerText = subtotal + '$';
        return subtotal;
    }

    // MOSTRAR IVA
    function showIVA(){
        let iva = 0;
        for (const producto of cart) {
            iva += Number(producto.price * producto.quantity * 0.21);
        }
        document.querySelector('.iva').getElementsByTagName('span')[0].innerText = Math.round((iva * 100))/100 + '$';
        return iva;
    }

    // MOSTRAR TOTAL
    function showTotal(){
        let total = Math.floor((showSubtotal() + showIVA()) * 100) / 100;
        document.querySelector('.total').getElementsByTagName('span')[0].innerText = total + '$';
    }

    // MOSTRAR CARRITO
    document.querySelector('#cart-btn').addEventListener("click", showCart)
    function showCart(){
        cart = JSON.parse(localStorage.getItem("CARRITO"));
        document.querySelector('#cart').classList.toggle('visible');
        if(!cart.length){
            document.querySelector('#coursesCart').innerHTML = "No hay productos en el carrito";
            document.querySelector('.calc').style.display = 'none';
        } else {
            document.querySelector('#coursesCart').innerHTML = '';
            document.querySelector('.calc').style.display = 'block';
            cart.map((course) => {
                let inCart = cart.find(element => element.id === course.id);

                let divC = document.createElement('div');
                divC.id = 'cart-'+course.id;
                divC.classList.add('item');
                divC.setAttribute('data-id', course.id);
                let text = document.createElement('div');
                let h3 = document.createElement('h3');
                h3.innerText = course.name;
                let entity = document.createElement('span');
                entity.innerText = course.entity;
                let stock = document.createElement("div");
                stock.classList.add('stock');
                    let remove = document.createElement("button");
                    remove.classList.add("removeStock");
                    remove.addEventListener("click", removeStockCart);
                    remove.innerText = "-";
                    stock.appendChild(remove);
                    let stockAct = document.createElement("span");

                    // CHECK IF ALREADY IN CART
                    if(inCart){
                        stockAct.innerText = inCart.quantity;
                    } else {
                        stockAct.innerText = product.quantity;
                    }

                    stock.appendChild(stockAct);
                    let plus = document.createElement("button");
                    plus.classList.add("addStock");
                    plus.addEventListener("click", addStockCart);
                    plus.innerText = "+";
                    stock.appendChild(plus);
                    text.appendChild(h3);
                    text.appendChild(entity);
                divC.appendChild(text);
                divC.appendChild(stock);
                document.querySelector('#coursesCart').appendChild(divC)
            })
            showTotal()
        }
    }

    counter();
    function counter(){
        cart = JSON.parse(localStorage.getItem("CARRITO"));
        document.querySelector('#counter').innerText = cart.length;
    }
});