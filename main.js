const openModal = () => document.getElementById('modal')
    .classList.add('active')

const closeModal = () => {
    clearFields()
    document.getElementById('modal').classList.remove('active')
}

const getLocalStorage = () => JSON.parse(localStorage.getItem('db_product')) ?? []
const setLocalStorage = (dbProduct) => localStorage.setItem('db_product', JSON.stringify(dbProduct))

const deleteProduct = (index) => {
    const dbProduct = readProduct()
    dbProduct.splice(index, 1)
    setLocalStorage(dbProduct)
}

const updateProduct = (index, product) => {
    const dbProduct = readProduct()
    dbProduct[index] = product
    setLocalStorage(dbProduct)
} 

const readProduct = () => getLocalStorage()

const createProduct = (product) => {
    const dbProduct = getLocalStorage()
    dbProduct.push (product)
    setLocalStorage(dbProduct)
}

const isValidFields = () => {
    return document.getElementById('form').reportValidity()
}

const clearFields = () => {
    const fields = document.querySelectorAll('.modal-field')
    fields.forEach(field => field.value = '')
}

const salveProduct = () => {
    if (isValidFields()) {
        const product = {
            nome: document.getElementById('nome').value,
            descrição: document.getElementById('descriçao').value,
            preço: document.getElementById('preço').value,
            dataCriaçao: document.getElementById('data').value
        }
        const index = document.getElementById('nome').dataset.index
        if (index == 'new') {
            createProduct(product)
            updateTable()
            closeModal()
        }else {
            updateProduct(index, product)
            updateTable()
            closeModal()
        }
        
    }
}

const createRow = (product, index) => {
    const newRow = document.createElement('tr')
    newRow.innerHTML = `
        <td>${product.nome}</td>
        <td>${product.descrição}</td>
        <td>R$${product.preço}</td>
        <td>${product.dataCriaçao}</td>
        <td>
            <button type="button" class="button green" id="edit-${index}">editar</button>
            <button type="button" class="button red" id="delete-${index}">excluir</button>
        </td>
    `
    document.querySelector('#tableProduct>tbody').appendChild(newRow)
}

const clearTable = () => {
    const rows = document.querySelectorAll('#tableProduct>tbody tr')
    rows.forEach(row => row.parentNode.removeChild(row))
}

const updateTable = () => {
    const dbProduct = readProduct()
    clearTable()
    dbProduct.forEach(createRow)
}

const fillFields = (product) => {
    document.getElementById('nome').value = product.nome
    document.getElementById('descriçao').value = product.descrição
    document.getElementById('preço').value = product.preço
    document.getElementById('data').value = product.dataCriaçao
    document.getElementById('nome').dataset.index = product.index
}

const editProduct = (index) => {
    const product = readProduct()[index]
    product.index = index
    fillFields(product)
    openModal()
}

const editDelete = (event) => {
    if (event.target.type == 'button') {
       const [action, index] =  event.target.id.split('-')

       if (action == 'edit') {
            editProduct(index)
       }else {
            deleteProduct(index)
            updateTable()
       }
    }
}

updateTable()

document.getElementById('cadastrarProduto')
    .addEventListener('click', openModal)

document.getElementById('modalClose')
    .addEventListener('click', closeModal)

document.getElementById('salvar').addEventListener('click', salveProduct)
document.getElementById('cancelar').addEventListener('click', closeModal)

document.querySelector('#tableProduct>tbody').addEventListener('click', editDelete)