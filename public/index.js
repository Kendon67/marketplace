fetch('/api/product_listings.php')
  .then((response) => {
    if (!response.ok) {
      throw new Error('Failed to fetch product listings');
    }
    return response.text(); // Parse the response as plain text first
  })
  .then((data) => {
    try {
      const listings = JSON.parse(data); // Try to parse the JSON
      const productList = document.getElementById('listing_container');
      productList.innerHTML = ''; // Clear existing content

      // Loop through the listings and create product cards
      listings.forEach((listing) => {
        const productCard = document.createElement('div');
        productCard.classList.add('listing_card');
        productCard.innerHTML = `
          <img src="${listing.image}" alt="${listing.name}">
          <h3>${listing.name}</h3>
          <p>${listing.description}</p>
          <p class="price">$${listing.price}</p>
        `;
        productList.appendChild(productCard);
      });
    } catch (error) {
      console.error('Invalid JSON response:', data);
    }
  })
  .catch((error) => {
    console.error('Error fetching product listings:', error);
  });