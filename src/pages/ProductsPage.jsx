import { useEffect, useState } from "react"
import { Link } from "react-router-dom";

const ProductsPage = () => {

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true)


    useEffect(() => {
        fetch("https://dummyjson.com/products?limit=20")
          .then((res) => res.json())
          .then((data) => setProducts(data.products))
          .finally(() => setLoading(false))
    }, [])

    if (loading) return <p>Загрузка...</p>

  return (
    <div className="grid">
        {products.map((p) => (
            <Link key={p.id} to={`/products/${p.id}`} className="card">
                <img src={p.thumbnail} alt={p.title} />
                <h3>{p.title}</h3>
                <p>{p.price}</p>
            </Link>
        ))}
    </div>
  )
}

export default ProductsPage