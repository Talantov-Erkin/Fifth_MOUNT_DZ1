import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Alert, Empty, Rate, Spin, Tag } from "antd"
import { getOldPrice, getProducts } from "../helpers/helpers"
import styles from "../styles/ProductsPage.module.scss"

const ProductCard = ({ product }) => {
  const { id, title, thumbnail, category, rating, price, discountPercentage } = product

  return (
    <Link to={`/products/${id}`} className={styles.card}>
      <div className={styles.imageWrap}>
        <img src={thumbnail} alt={title} loading="lazy" />
        {discountPercentage > 0 && (
          <Tag color="red" className={styles.badge}>
            -{Math.round(discountPercentage)}%
          </Tag>
        )}
      </div>

      <div className={styles.body}>
        <span className={styles.category}>{category}</span>
        <h3 className={styles.name}>{title}</h3>

        <div className={styles.rating}>
          <Rate disabled allowHalf value={rating} style={{ fontSize: 14 }} />
          <span>{rating.toFixed(1)}</span>
        </div>

        <div className={styles.priceRow}>
          <span className={styles.price}>${price}</span>
          {discountPercentage > 0 && (
            <span className={styles.oldPrice}>
              ${getOldPrice(price, discountPercentage)}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}

const ProductsPage = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts(20)
        setProducts(data)
      } catch {
        setError("Не удалось загрузить товары. Попробуйте позже")
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  if (loading) {
    return (
      <div className={styles.center}>
        <Spin size="large" />
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.page}>
        <Alert type="error" title={error} showIcon />
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Каталог</h1>

      {products.length === 0 ? (
        <Empty description="Товаров нет" />
      ) : (
        <div className={styles.grid}>
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  )
}

export default ProductsPage