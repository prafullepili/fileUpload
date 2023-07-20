const url = '/api/v1/products'
const fileFormDOM = document.querySelector('.file-form')

const nameInputDOM = document.querySelector('#name')
const priceInputDOM = document.querySelector('#price')
const imageInputDOM = document.querySelector('#image')

const containerDOM = document.querySelector('.container')
let imageValue;

// imageInputDOM.addEventListener('change',(e)=>{
//  const file = e.target.files[0];
//  console.log(file);
// })





function errorHandle(imageFile) {
  let small = document.getElementById('img-error');
  if (imageFile == undefined) {
    small.append('Please select image file')
    small.style.color = 'red';
  } else {
    small.innerText = '';
  }
}

imageInputDOM.addEventListener('change', async (e) => {
  const imageFile = e.target.files[0];
  errorHandle(imageFile)
})

const uploadImage = async (e) => {
  const imageFile = e.currentTarget[2].files[0]
  const formData = new FormData();
  formData.append('image', imageFile);
  imageFile == undefined && errorHandle(imageFile)
  try {
    const { data: { image: { src } } } = await axios.post(`${url}/uploads`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return src
  } catch (error) {
    console.log(error);
    return src
  }
}

fileFormDOM.addEventListener('submit', async (e) => {
  e.preventDefault()
  const nameValue = nameInputDOM.value;
  const priceValue = priceInputDOM.value;
  const imageValue = await uploadImage(e);
  if (imageValue == null) return;
  try {
    const product = { name: nameValue, price: priceValue, image: imageValue }
    await axios.post(url, product);
    fetchProducts()
  } catch (error) {
    console.log(error);
  }
})



async function fetchProducts() {
  try {
    const { data: { products } } = await axios.get(url);

    const productsDOM = products.map((product) => {
      return `<article class="product">
<img src="${product.image}" alt="${product.name}" class="img"/>
<footer>
<p>${product.name}</p>
<span>$${product.price}</span>
</footer>
</article>`
    }).join('')
    containerDOM.innerHTML = productsDOM
  } catch (error) {
    console.log(error);
  }

}

fetchProducts()