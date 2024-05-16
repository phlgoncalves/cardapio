const menu = document.getElementById("menu")
const cartBtn = document.getElementById("cart-btn")
const cartModal = document.getElementById("cart-modal")
const cartItemsContainer = document.getElementById("cart-items")
const cartTotal = document.getElementById("cart-total")
const checkoutBtn = document.getElementById("checkout-btn")
const closeModalBtn = document.getElementById("close-modal-btn")
const cartCounter = document.getElementById("cart-count")
const addressInput = document.getElementById("address")
const addressWanr = document.getElementById("address-warn")

let cart = []

// Abrir o modal
cartBtn.addEventListener('click', function () {
    updateCartModal()
    cartModal.style.display = "flex"
})

// Fechar o modal quando clicar fora e também pelo botão
cartModal.addEventListener('click', function (ev) {
    if (ev.target === cartModal) {
        cartModal.style.display = "none"
    }
})

closeModalBtn.addEventListener('click', function () {
    cartModal.style.display = "none"
})

// Botão do carrinho no menu
menu.addEventListener('click', function (ev) {
    let parentButton = ev.target.closest(".add-to-cart-btn") //ele somente acionará o ev click SE for clicado em um elemento que tenha a classe .add-to-cart-btn OU algum 'filho' dela
    if (parentButton) {
        const name = parentButton.getAttribute("data-name")
        const price = parseFloat(parentButton.getAttribute("data-price"))

        addToCart(name, price)
    }
})

// Função para adicionar no carrinho
function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name) //verificar se existe pelo nome - find 'passa' por todas informações dos itens

    if (existingItem) {
        // se o item já existe aumenta apenas a quantidade +1
        existingItem.quantity += 1
    } else { //senão só adicione o item pela primeira vez
        cart.push({
            name,
            price,
            quantity: 1,
        })
    }

    updateCartModal()
}

// Atualiza carrinho
function updateCartModal() {
    cartItemsContainer.innerHTML = ""
    let total = 0

    cart.forEach(item => { //percorre todos os itens da lista e adiciona as informações html
        const cartItemElement = document.createElement("div")
        cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col")

        cartItemElement.innerHTML = `
        <div class="flex items-center justify-between">
            <div>
                <p class="font-medium">${item.name}</p>
                <p>Qtd: ${item.quantity}</p>
                <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
            </div>
            <div>
                <button class="remove-from-cart-btn" data-name="${item.name}">Remover</button>
            </div>
        </div>
        `

        total += item.price * item.quantity

        cartItemsContainer.appendChild(cartItemElement)
    })

    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    })

    cartCounter.innerText = cart.length
}

// Função para remover item do carrinho

cartItemsContainer.addEventListener('click', function (ev) {
    if (ev.target.classList.contains("remove-from-cart-btn")) {
        const name = ev.target.getAttribute("data-name")

        removeItemCart(name)
    }
})

function removeItemCart(name) {
    const index = cart.findIndex(item => item.name === name) //Se o name devolvido ao clicar no botão for igual ao name que está no array item ele devolve o item para o index
    if (index !== -1) { //se for diferente de -1 é porque encontrou pelo menos 1
        const item = cart[index] //devolverá o item encontrado no findIndex

        if (item.quantity > 1) { //se for maior do que 1 ele removerá apenas 1 e atualizará o modal do carrinho
            item.quantity -= 1
            updateCartModal()
            return
        }

        cart.splice(index, 1) //Se for apenas 1 ele somente irá excluir e depois atualizará o carrinho
        updateCartModal()

    }
}


addressInput.addEventListener('input', function (ev) {
    let inputValue = ev.target.value

    if (inputValue !== "") {
        addressInput.classList.remove("border-red-500")
        addressWanr.classList.add("hidden")
    }
})

// Finalizar pedido
checkoutBtn.addEventListener('click', function () {

    const isOpen = checkRestaurantOpen()
    if (!isOpen) {

        Toastify({
            text: "Ops o restaurante está fechado!",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
                background: "#ef4444",
            },
        }).showToast()
        return
    }

    if (cart.length === 0) return
    if (addressInput.value === "") {
        addressWanr.classList.remove("hidden")
        addressInput.classList.add("border-red-500")
        return
    }

    // Enviar o pedido para o whats
    const cartItems = cart.map((item) => {
        return (
            `${item.name} Quantidade: (${item.quantity}) Preço: R$${item.price} |\n`
        )
    }).join("")

    const message = encodeURIComponent(cartItems)
    const phone = "14981872081"

    window.open(`http://wa.me/${phone}?text=${message} Endereço: ${addressInput.value}`, "_bland")

    cart = []
    updateCartModal()
})

// Verifica hora e manipula o card horário
function checkRestaurantOpen() {
    const data = new Date()
    const hora = data.getHours()
    return hora >= 18 && hora < 22
}

const spanItem = document.getElementById("date-span")
const isOpen = checkRestaurantOpen()

if (isOpen) {
    spanItem.classList.remove("bg-red-500")
    spanItem.classList.add("bg-green-600")
} else {
    spanItem.classList.remove("bg-green-600")
    spanItem.classList.add("bg-red-500")
}
