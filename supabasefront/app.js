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
