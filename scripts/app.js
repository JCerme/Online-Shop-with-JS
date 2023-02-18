const CART = [];
document.addEventListener("DOMContentLoaded",() => {
    

    // CONSOLE LOG INFORMATIVO
    let nProds = COURSES.length;
    console.log("Hay "+nProds+" servicios disponibles: ");
    COURSES.forEach((course)=>console.log(`   · ${course.name}`));
    
    // BUCLE
    let stillShopping = true;
    do {
        const titles = COURSES.map(course => course.name);
    
        let msgList = "Bienvenido. Estos son los cursos disponibles:\n";
        titles.forEach((course) => {
            msgList += `    · ${course} \n`;
        });
        msgList += "Elige uno:";

        let selectedCourse = prompt(msgList).toLowerCase();
        let selectedObject = COURSES.find(course => course.name.toLowerCase() == selectedCourse);
        if(selectedObject){
            alert("El curso seleccionado es: " + selectedObject.name + " y cuesta " + selectedObject.price + "$.");
            let gift = confirm("¿Quieres comprar más de uno para regalarselo a alguien?");
        
            let qty;
            if(gift){
                qty = Number(prompt("Indica las unidades que quieres comprar."));
            } else {
                qty = 1;
            }
        
            alert("Has comprado " + qty + " curso/s de " + selectedObject.name);
            
            objIndex = CART.findIndex((course => course.id == selectedObject.id));
            if(objIndex !== -1){
                CART[objIndex].quantity += Number(qty);
            } else {
                selectedObject.quantity = qty;
                CART.push(selectedObject);
            }
        
            stillShopping = confirm("¿Deseas comprar otro producto?");
            if (stillShopping === false) {
                showTotal();
                console.log(CART)
            }
        } else {
            alert("Este curso no existe, revisa si lo has introducido bien.");
            stillShopping = true;
        }
    } while(stillShopping);
    
    
    // MOSTRAR SUBTOTAL
    function showSubtotal(){
        const subtotal = CART.reduce((acum, course) => acum + (Number(course.price) * Number(course.quantity)),0);
        console.log("");
        console.log("Su subtotal actual es: "+subtotal+"$");
        return subtotal;
    }

    // MOSTRAR IVA
    function showIVA(){
        let iva = 0;
        for (const course of CART) {
            iva += Number(course.price * course.quantity * 0.21);
        }
        console.log("El IVA actual total es: "+Math.round((iva * 100))/100+"$");
        return iva;
    }

    // MOSTRAR TOTAL
    function showTotal(){
        let subtotal = showSubtotal();
        let IVA = showIVA()
        let total = Math.floor((subtotal + IVA) * 100) / 100;

        console.log("EL TOTAL ACTUAL ES: "+total+"$");
        const titles = CART.map(course => course.name);
    
        alert(`Productos comprados: ${titles.join(", ")}
                · Su subtotal actual es: ${subtotal}$
                · El IVA actual total es: ${IVA}$
                · Y EL TOTAL ACTUAL ES: ${total}$`)
    }
});
