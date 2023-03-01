window.addEventListener('DOMContentLoaded',() => {
    // PRODUCTOS
    let nProds = COURSES.length;
    console.log("Hay "+nProds+" servicios disponibles: ");
    COURSES.forEach((prod)=>console.log(`   · ${prod.name}`));

    // LOCAL STORAGE
    let carrito = JSON.parse(localStorage.getItem('CARRITO'));
    if(!localStorage.getItem("CARRITO")){
        localStorage.setItem('CARRITO', '[]');
    }
    showTotal();

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
    showCourses(COURSES)
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
            let inCart = cart.find(element => element.id === product.id);
            if(inCart) box.style.opacity = 0.35;

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

                    // CHECK IF ALREADY IN CART
                    if(inCart){
                        stockAct.innerText = inCart.quantity;
                    } else {
                        stockAct.innerText = product.quantity;
                    }

                    stock.appendChild(stockAct);
                    let plus = document.createElement("button");
                    plus.classList.add("addStock");
                    plus.addEventListener("click", addStock);
                    plus.innerText = "+";
                    stock.appendChild(plus);
                let cartBtn = document.createElement("button");
                cartBtn.classList.add("add-to-cart");

                // CHECK IF ALREADY IN CART
                if(inCart){
                    cartBtn.disabled = true;
                    cartBtn.classList.add("disabled");
                    cartBtn.innerText = "Añadido";
                } else {
                    cartBtn.addEventListener("click", addToCart);
                    cartBtn.innerText = "Añadir";
                }
            addCart.appendChild(stock);
            addCart.appendChild(cartBtn);
            box.appendChild(addCart);
            wrapper.appendChild(box);
        }
    }

    // AÑADIR O QUITAR DEL CARRITO
    function addToCart(e){
        let id = e.target.parentElement.parentElement.getAttribute("data-index");
        let qty = e.target.parentElement.querySelector('span').innerText;

        let prod = COURSES.find(product => product.id === Number(id));
        prod.quantity = qty;

        cart = JSON.parse(localStorage.getItem("CARRITO"));
        let prodExist = cart.indexOf(element => element.id === prod.id);
        if(prodExist <= 0){
            cart.push(prod);
        } else {
            Swal.fire({
                title: 'Error!',
                text: 'Ya has añadido este producto al carrito',
                icon: 'error',
                confirmButtonText: 'Volver'
            })
        }

        localStorage.setItem('CARRITO', JSON.stringify(cart));

        e.target.disabled = true;
        e.target.classList.add("disabled");
        e.target.innerText = "Añadido";
        e.target.parentElement.parentElement.style.opacity = 0.35;

        Swal.fire({
            title: '¡Producto añadido correctamente!',
            text: `Se ha añadido el curso "${prod.name}" (${prod.quantity} unidades) al carrito.`,
            icon: 'success',
            showConfirmButton: false,
            timer: 2000
        })
        
        showTotal()
    }

    // ADD STOCK
    function addStock(e){
        let qty = e.target.parentElement.querySelector('span').innerText;
        e.target.parentElement.querySelector('span').innerText = Number(qty) + 1;
    }

    // REMOVE STOCK
    function removeStock(e){
        let qty = e.target.parentElement.querySelector('span').innerText;
        if(Number(qty) > 1){
            e.target.parentElement.querySelector('span').innerText = Number(qty) - 1;
        }
    }

    // MOSTRAR SUBTOTAL
    function showSubtotal(){
        const subtotal = cart.reduce((acumulador, product) => acumulador + (Number(product.price) * Number(product.quantity)),0);
        console.log("");
        console.log("Su subtotal actual es: "+subtotal+"$");
        document.querySelector('.subtotal').getElementsByTagName('span')[0].innerText = subtotal + '$';
        return subtotal;
    }

    // MOSTRAR IVA
    function showIVA(){
        let iva = 0;
        for (const producto of cart) {
            iva += Number(producto.price * producto.quantity * 0.21);
        }
        console.log("El IVA actual total es: "+Math.round((iva * 100))/100+"$");
        document.querySelector('.iva').getElementsByTagName('span')[0].innerText = Math.round((iva * 100))/100 + '$';
        return iva;
    }

    // MOSTRAR TOTAL
    function showTotal(){
        cart = JSON.parse(localStorage.getItem("CARRITO"));
        let total = Math.floor((showSubtotal() + showIVA()) * 100) / 100;
        document.querySelector('.total').getElementsByTagName('span')[0].innerText = total + '$';
        console.log("Y EL TOTAL ACTUAL ES: "+total+"$");
    }
});