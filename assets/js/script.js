fetch('https://dummyjson.com/products/category/smartphones')
.then(res => res.json())
.then(console.log);