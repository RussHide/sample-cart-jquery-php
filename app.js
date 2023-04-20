$(document).ready(function () {
    getProducts()
    let cartItems = []
    let allProducts = []

    function getProducts() {
        $.ajax({
            type: "GET",
            url: "inde.php",
            data: { getProducts: 1 },
            success: function (response) {
                template = ''
                const products = JSON.parse(response)
                allProducts = products
                products.forEach(product => {
                    template += `
                <div class="flex items-center justify-center px-4">
                <div id="${product.id}"
                    class="max-w-sm overflow-hidden rounded-xl bg-white shadow-md duration-200 hover:scale-105 hover:shadow-xl">
                    <img src="https://i.imgur.com/5dmBrx6.jpg" alt="plant" class=" w-full" />
                    <div class="p-5">
                        <div class="flex justify-between">
                        <h2>$${product.price}</h2>
                        <h2 class="text-gray-400">Stock: ${product.stock}</h2>
                        </div>
                            <p class="text-medium mb-5 text-gray-700">${product.title}</p>
                        <button type="submit"
                            class="w-full rounded-md bg-indigo-600  py-2 text-indigo-100 hover:bg-indigo-500 hover:shadow-md duration-75 addItem">Agregar
                            al carrito</button>
                    </div>
                </div>
            </div>
                `
                });
                $('#productContainer').html(template)
            }
        });
    }

    $(document).on('click', '.addItem', function () {
        const currentProduct = $(this)[0].parentElement.parentElement
        const id = $(currentProduct).attr('id')
        const isInCart = cartItems.find(product => product.id === id)
        if (isInCart) {
            cartItems[cartItems.indexOf(isInCart)].quantity += 1
            updateProductContent()
            return
        }
        const selectedProduct = allProducts.find(product => product.id === id)
        const newItem = {
            id: id,
            quantity: 1,
            price: selectedProduct.price,
            title: selectedProduct.title,
        }
        cartItems.push(newItem)
        console.log(cartItems);
        updateProductContent()
    });

    function updateProductContent() {
        if (cartItems.length > 0) {
            let total = 0
            let cartItemsString = ''
            for (let index = 0; index < cartItems.length; index++) {
                cartItemsString += `<div  class="flex justify-between items-center mt-6 pt-6" id="${cartItems[index].id}">
                    <div class="flex items-center" >
                        <img src="https://i.imgur.com/5dmBrx6.jpg" width="60" class="rounded-full ">
                        <div class="flex flex-col ml-3">
                            <span class="md:text-md font-medium">${cartItems[index].title}</span>
                            <span class="text-xs font-light text-gray-400">Precio individual - $${cartItems[index].price}</span>
                        </div>
                    </div>
                    <div class="flex justify-center items-center">
                        <div class="pr-8 flex ">
                            <button class="font-semibold resButton">-</button>
                            <span  class="focus:outline-none bg-gray-100 border h-6 w-8 rounded text-sm px-2 mx-2">${cartItems[index].quantity}</span>
                            <button class="font-semibold sumButton">+</button>
                        </div>
                        <div class="pr-8 ">
                            <span class="text-xs font-medium">$${cartItems[index].price * cartItems[index].quantity}</span>
                        </div>
                        <div>
                            <i class="fa fa-close text-xs font-medium"></i>
                        </div>
                    </div>
                </div >`
                $('#cartContainer').html(cartItemsString)
            }
            for (let jndex = 0; jndex < cartItems.length; jndex++) {
                total += cartItems[jndex].price * cartItems[jndex].quantity
                console.log(total)
                $('#total').text('Total: $' + total)
            }
        } else {
            const emptyCart = `<div class="w-full flex items-center justify-center h-full text-2xl font-semibold text-gray-400">No hay productos aun</div>`
            $('#cartContainer').html(emptyCart)
            $('#total').text('Total: $' + 0)
        }
    }

    $(document).on('click', '.resButton', function () {
        const currentButton = $(this)[0].parentElement.parentElement.parentElement
        const id = $(currentButton).attr('id')
        const isInCart = cartItems.find(item => item.id === id)
        if (isInCart) {
            if (cartItems[cartItems.indexOf(isInCart)].quantity - 1 === 0) {
                const indexToRemove = cartItems.indexOf(isInCart);
                cartItems.splice(indexToRemove, 1);
                console.log(cartItems);
                updateProductContent()
                return
            }
            cartItems[cartItems.indexOf(isInCart)].quantity -= 1
            updateProductContent()
            return
        }
    });

    $(document).on('click', '.sumButton', function () {
        const currentButton = $(this)[0].parentElement.parentElement.parentElement
        const id = $(currentButton).attr('id')
        const isInCart = cartItems.find(item => item.id === id)
        if (isInCart) {
            cartItems[cartItems.indexOf(isInCart)].quantity += 1
            updateProductContent()
            return
        }
    });

    $(document).on('click', '#btnPay', function () {

        if (cartItems <= 0) {
            alert('No tienes articulos en el carrito')
            return
        }

        const data = cartItems.map(item => {
            return {
                id: item.id,
                quantity: item.quantity
            }
        })

        $.ajax({
            type: "POST",
            url: "inde.php",
            data: { payOrder: data },
            success: function (response) {
                if (response) {
                    alert('La compra se completo correctamente')
                    getProducts()
                }else{
                    alert('Hubo un error al completar la compra')
                    getProducts()
                }
            }
        });
    });

});

