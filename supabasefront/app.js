const productList = document.querySelector('#products');
const addProductForm = document.querySelector('#add-product-form');
const updateProductForm = document.querySelector('#update-product-form');
const updateProductId = document.querySelector('#update-id');
const updateProductName = document.querySelector('#update-name');
const updateProductPrice = document.querySelector('#update-price');
const updateProductDescription = document.querySelector('#update-description');

// Function to fetch all products from the server
async function fetchProducts() {
  const response = await fetch('http://54.92.208.203:3000/products');
  const products = await response.json();

  // Clear product list
  productList.innerHTML = '';

  // Add each product to the list
  products.forEach(product => {
    const li = document.createElement('li');
    li.innerHTML = `${product.name} - $${product.price}`;

    // Add delete button for each product
    const deleteButton = document.createElement('button');
    deleteButton.innerHTML = 'Delete';
    deleteButton.addEventListener('click', async () => {
      await deleteProduct(product.id);
      await fetchProducts();
    });
    li.appendChild(deleteButton);

    // Add update button for each product
    const updateButton = document.createElement('button');
    updateButton.innerHTML = 'Update';
    updateButton.addEventListener('click', () => {
      updateProductId.value = product.id;
      updateProductName.value = product.name;
      updateProductPrice.value = product.price;
      updateProductDescription.value = product.description || '';

      updateProductForm.style.display = 'block'; // Mostra o formulário de atualização
      addProductForm.style.display = 'none';
    });
    li.appendChild(updateButton);

    productList.appendChild(li);
  });
}

// Event listener for Add Product form submit button
addProductForm.addEventListener('submit', async event => {
  event.preventDefault();
  const name = addProductForm.elements['name'].value;
  const price = addProductForm.elements['price'].value;
  await addProduct(name, price);
  addProductForm.reset();
  await fetchProducts();
});

// Function to add a new product
async function addProduct(name, price) {
  const response = await fetch('http://54.92.208.203:3000/products', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name, price })
  });
  return response.json();
}

// Function to delete a product
async function deleteProduct(id) {
  const response = await fetch('http://54.92.208.203:3000/products/' + id, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
  });
  return response.json();
}

// Event listener for Update Product form submit button
updateProductForm.addEventListener('submit', async event => {
  event.preventDefault();
  const id = updateProductId.value;
  const name = updateProductName.value;
  const price = updateProductPrice.value;
  const description = updateProductDescription.value;

  // Call the function to update the product
  await updateProduct(id, { name, price, description });

  // Reset and hide the form
  updateProductForm.reset();
  updateProductForm.style.display = 'none';
  addProductForm.style.display = 'block';

  // Refresh the product list
  await fetchProducts();
});

// Function to update a product
async function updateProduct(id, updatedData) {
  const response = await fetch('http://54.92.208.203:3000/products/' + id, {
    method: 'PUT', // Use PUT or PATCH, depending on your API
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updatedData)
  });

  if (!response.ok) {
    console.error('Failed to update product:', await response.text());
  }

  return response.json();
}

// Fetch all products on page load
fetchProducts();
