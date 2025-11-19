const url = 'https://dummyjson.com/products'

/* Variables Globales de Estado */
let carrito = []
let totalCart = null
let productos = null
let cargandoServidor = false
let errorServidor = null

/* Captura de elementos del DOM */
const containerProducts = document.getElementById('div__sectionProducts')
const containerItemCart = document.getElementById('div__sectionCart')
const containerPriceTotalCart = document.getElementById('totalCart')
const containerErrorServidor = document.getElementById('errorServidor')
const containerSpinnerProducts = document.getElementById('spinnerProducts')
const containerSpinnerCart = document.getElementById('spinnerCart')

/* Fetch */
const fechDatos = async(url)=> {
    try {
        let response
        setCargandoProductos(true)
        const response_http = await fetch(
            url,
            {
                method: "GET",
            }
        )
        response = await response_http.json()
        setTimeout(()=>{setProductos(response.products)}, 2000)
        
    } 
    catch (error) {
        setErrorServidor(error)
    }
    
}


/* Funciones Rederizado */

const renderProductos = ()=> {
    containerProducts.innerHTML = ''

        if(productos && productos.length > 0){

            let html = ''

            for (const producto of productos){
                
                const productInCart = veificacionDeExistenciaEnCarrito(producto.id)
                let html_controls_products = ''

                if(productInCart){
                    html_controls_products = `
                        <button class="btn-product-Remove buttonPrimari" data-product_id=${producto.id}> Quitar del Carrito </button>
                        <button class="btn-product-increase buttonSecundari" data-product_id=${producto.id}> + </button>
                        <button class="btn-product-decrease buttonSecundari" data-product_id=${producto.id}> - </button>
                    `
                }else{
                    html_controls_products = `
                        <button class="btn-product-Add buttonPrimari" data-product_id=${producto.id}> Agregar al Carrito </button> 
                    `
                }
                
                html = html + `
                <div class="cardProducts">
                    <div class="cardProducts-container__descirption">
                        <span class="ocultar">${producto.id}</span>
                        <h2 >${producto.title}</h2>
                        <p class="cardProducts-container__text-precio">Precio</p>
                        <p class="cardProducts-container__number-precio">$${producto.price}</p>
                        <p class="cardProducts-container__text-stock">Stock</p>
                        <p class="cardProducts-container__numbre-stock">${producto.stock}</p>
                    </div>
                    <div class="cardProducts-container__container-buttons">
                        ${html_controls_products}  
                    </div>

                </div>
                `
            }
            containerProducts.innerHTML = html
            escuchadorBotonesProductos()
        }
        else if(errorServidor){
            renderError()
        }
}

const renderCarrito = ()=> {
    containerItemCart.innerHTML = ''

        if(carrito.length > 0){

            let html = ''

            for (const item of carrito){
                
                html = html + `
                <div class="cardItem">
                    <span class="hidden">${item.id}</span>
                    <h2 class="carItem__h2">${item.title}</h2>
                    <p class="cardItem__text-precio">Precio</p>
                    <p class="cardItem__number-precio">$${item.precio}</p>
                    <p class="cardItem__text-cantidad">Cantidad</p>
                    <p class="cardItem__number-cantidad">${item.cantidad}</p>
                    <div class="container-buttons">
                        <button class="btn-item-increase buttonSecundari" data-item_id=${item.id}> + </button>
                        <button class="btn-item-decrease buttonSecundari" data-item_id=${item.id}> - </button>
                        <button class="btn-item-Remove buttonPrimari" data-item_id=${item.id}> Quitar del Carrito </button> 
                        <span class="item_total" data-item_total=${(item.cantidad * item.precio).toFixed(2)}>$${(item.cantidad * item.precio).toFixed(2)} </span>
                    </div>
                </div>
                `
            }
            containerItemCart.innerHTML = html
            escuchadorBotonesItem()
        }
        else if(errorServidor){
            renderError()
        }
}

const renderTotal = ()=> {

    let html = ''
    if(carrito.length === 0){
        return containerPriceTotalCart.innerHTML = ''
    }

    html =`
            <p>Total Carrito</p>
            <span>$${totalCart}</span>
            <button class="btn-total_vaciar buttonPrimari"> Vaciar Carrito </button>
            <button class="btn-total_aceptar buttonPrimari"> Confirmar Carrito </button>
        `

    containerPriceTotalCart.innerHTML = html

    const btn_Vaciar = document.getElementsByClassName('btn-total_vaciar')
    for (const btnVaciar of btn_Vaciar){
        btnVaciar.addEventListener('click', (e)=> {
        setCarrito('vaciar')
        })
    }

    const btn_Confirmar = document.getElementsByClassName('btn-total_aceptar')
    for (const btnConfirmar of btn_Confirmar){
        btnConfirmar.addEventListener('click', (e)=> {
            alert(`Total Carrito $${totalCart}`)
        })
    }
}

const renderSpinnerServidor = ()=> {

    if(cargandoServidor){
        let html = `<span class="loader"></span>`
        containerSpinnerProducts.classList.remove("ocultar")
        return containerSpinnerProducts.innerHTML = html
    }
    else{
        let html = ``
        containerSpinnerProducts.classList.add('ocultar')
        return containerSpinnerProducts.innerHTML = html
    }
}

const renderError = ()=> {

    let html = `<span> Error del Servidor al Obtener Productos ${errorServidor} </span>`
    return containerErrorServidor.innerHTML = html
}


/* Funciones setters */

const setCarrito = (operacion, IdProducto)=> {
    
    if (operacion === 'vaciar'){
        actualizacionCantidadCarritoProductos[operacion]()
    }else{
        actualizacionCantidadCarritoProductos[operacion](IdProducto)
    }
}

const setProductos = async(nuevosProductos)=> {

    productos = nuevosProductos
    setCargandoProductos(false)
    renderProductos(productos)
}

const setCargandoProductos = (estado)=> {

    cargandoServidor = estado
    renderSpinnerServidor() 
}

const setErrorServidor = (error)=> {

        errorServidor = error
        renderError(error)

}

const setTotalCart = ()=> {

    let acumulado = 0
    for(let index = 0; index < carrito.length; index ++){
        const nuevoTotal = carrito[index].precio * carrito[index].cantidad
        acumulado = acumulado + nuevoTotal
    }

    totalCart = acumulado.toFixed(2)
    renderTotal()
    
}


/* Funciones busqueda en Arrays */

const veificacionDeExistenciaEnCarrito = (productoId)=> {
    let existencia = false
    for (let producto of carrito){
        if(producto.id === productoId){
            existencia = true
        }
    }
    return existencia
}

const getProductById = (productoId)=> {
    for(const producto of productos){
        if(producto.id === productoId){
            return producto
        }
    }
    return null
}

const getItemCarritoById = (productoId)=> {
    for(const item of carrito){
        if(item.id === productoId){
            return item
        }
    }
    return null
}

const findIndexItmeCarrito = (productId)=> {
    let indexIntem
    for (let index = 0; index < carrito.length; index ++) {
        if(productId === carrito[index].id){
            return indexIntem = index
        }
    }
    return null   
}


/* Agregar Escuchador de Eventos */

const escuchadorBotonesProductos = ()=> {

    const btn_increase = document.getElementsByClassName('btn-product-increase')
    for(const btnIncrease of btn_increase){
        btnIncrease.addEventListener('click', (e)=> {
            const productId = Number(e.target.dataset.product_id)
            setCarrito('incrementar',productId)
        })
    }

    const btn_decrease =  document.getElementsByClassName('btn-product-decrease')
    for(const btnDecrease of btn_decrease){
        btnDecrease.addEventListener('click', (e)=> {
            const productId = Number(e.target.dataset.product_id)
            setCarrito('decrementar', productId)
        })
    }

    const btn_add = document.getElementsByClassName('btn-product-Add')
    for(const btnAdd of btn_add){
        btnAdd.addEventListener('click', (e)=> {
            const productId = Number(e.target.dataset.product_id)
            setCarrito('agregar', productId)
        })
    }

    const btn_remove = document.getElementsByClassName('btn-product-Remove')
    for(const btnRemove of btn_remove){
        btnRemove.addEventListener('click', (e)=> {
            const productId = Number(e.target.dataset.product_id)
            setCarrito('eliminar', productId)
        })
    }
}

const escuchadorBotonesItem = ()=> {

    const btn_increase = document.getElementsByClassName('btn-item-increase')
    for(const btnIncrease of btn_increase){
        btnIncrease.addEventListener('click', (e)=> {
            const itemId = Number(e.target.dataset.item_id)
            setCarrito('incrementar', itemId)
        })
    }

    const btn_decrease =  document.getElementsByClassName('btn-item-decrease')
    for(const btnDecrease of btn_decrease){
        btnDecrease.addEventListener('click', (e)=> {
            const itemId = Number(e.target.dataset.item_id)
            setCarrito('decrementar', itemId)
        })
    }

    const btn_remove = document.getElementsByClassName('btn-item-Remove')
    for(const btnRemove of btn_remove){
        btnRemove.addEventListener('click', (e)=> {
            const itemId = Number(e.target.dataset.item_id)
            setCarrito('eliminar', itemId)
        })
    }
    
}


/* Funciones de Botones */

const incrementarEnCarrito = (IdProducto)=> {
    const producto = getProductById(IdProducto)
    const itemCarrito = getItemCarritoById(IdProducto)

    if(producto.stock >= 1){
        itemCarrito.cantidad = itemCarrito.cantidad + 1
        producto.stock = producto.stock - 1
        setTotalCart()
        renderCarrito()
        renderProductos()
    }
}

const decrementarEnCarrito = (IdProducto)=> {
    const producto = getProductById(IdProducto)
    const itemCarrito = getItemCarritoById(IdProducto)

    if(itemCarrito.cantidad >= 1){
        itemCarrito.cantidad = itemCarrito.cantidad - 1
        producto.stock = producto.stock + 1
        setTotalCart()
        renderCarrito()
        renderProductos()
    }
    if(itemCarrito.cantidad === 0){
        setCarrito('eliminar', itemCarrito.id)
    }  
}

const agregarAlCarrito = (IdProducto)=> {
    const producto = getProductById(IdProducto)
   
    if(producto.stock >= 1){
        const newItemCart = {
            id:producto.id,
            title:producto.title,
            precio:producto.price,
            cantidad: 0 
        }
        carrito.push(newItemCart)
        setCarrito('incrementar', IdProducto)
    }
    renderCarrito()
    renderProductos()
}

const quitarDelCarrito = (IdProducto)=> {
    const productoLista = getProductById(IdProducto)
    const itemCarrito =  getItemCarritoById(IdProducto)
    const indexProductoEnCarrito = findIndexItmeCarrito(IdProducto)
    productoLista.stock = productoLista.stock + itemCarrito.cantidad
    carrito.splice(indexProductoEnCarrito,1)
    renderCarrito()
    renderProductos()
    setTotalCart()
}

const vaciarCarrito = ()=> {
const carritoTrsbajo = [...carrito]
    for(let item of carritoTrsbajo){
        quitarDelCarrito(item.id)
    }
}

const actualizacionCantidadCarritoProductos = 
    {
        incrementar: incrementarEnCarrito,
        decrementar: decrementarEnCarrito,
        agregar: agregarAlCarrito,
        eliminar: quitarDelCarrito,
        vaciar: vaciarCarrito    
    }

fechDatos(url)
