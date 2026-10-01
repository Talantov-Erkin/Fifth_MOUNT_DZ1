import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { Alert, Button, Descriptions, Rate, Result, Spin, Tag } from "antd"
import { getOldPrice, getProductById } from "../helpers/helpers"
import styles from "../styles/ProductPage.module.scss"

// Галерея — получает images и title через пропсы
const ProductGallery = ({ images, title }) => {
  const [activeImage, setActiveImage] = useState(0)

  return (
    <div className={styles.gallery}>
      <div className={styles.mainImage}>
        <img src={images[activeImage]} alt={title} />
      </div>

      {images.length > 1 && (
        <div className={styles.thumbs}>
          {images.map((img, index) => (
            <button
              key={img}
              type="button"
              className={`${styles.thumb} ${index === activeImage ? styles.thumbActive : ""}`}
              onClick={() => setActiveImage(index)}
            >
              <img src={img} alt={`${title} ${index + 1}`} />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// Информация о товаре — получает product через пропс
const ProductInfo = ({ product }) => {
  const {
    title, brand, category, tags, rating, reviews, price,
    discountPercentage, stock, description, sku,
    warrantyInformation, shippingInformation, returnPolicy, minimumOrderQuantity,
  } = product

  const details = [
    { key: "sku", label: "Артикул", children: sku },
    { key: "warranty", label: "Гарантия", children: warrantyInformation },
    { key: "shipping", label: "Доставка", children: shippingInformation },
    { key: "return", label: "Возврат", children: returnPolicy },
    { key: "min", label: "Мин. заказ", children: `${minimumOrderQuantity} шт.` },
  ]

  return (
    <div className={styles.info}>
      <div className={styles.tags}>
        <Tag color="blue">{category}</Tag>
        {tags?.map((tag) => (
          <Tag key={tag}>{tag}</Tag>
        ))}
      </div>

      <h1 className={styles.title}>{title}</h1>
      {brand && <p className={styles.brand}>Бренд: {brand}</p>}

      <div className={styles.rating}>
        <Rate disabled allowHalf value={rating} />
        <span>
          {rating.toFixed(1)} · отзывов: {reviews?.length ?? 0}
        </span>
      </div>

      <div className={styles.priceRow}>
        <span className={styles.price}>${price}</span>
        {discountPercentage > 0 && (
          <>
            <span className={styles.oldPrice}>
              ${getOldPrice(price, discountPercentage)}
            </span>
            <Tag color="red">-{Math.round(discountPercentage)}%</Tag>
          </>
        )}
      </div>

      <div>
        {stock > 0 ? (
          <Tag color={stock > 10 ? "green" : "orange"}>В наличии: {stock} шт.</Tag>
        ) : (
          <Tag color="red">Нет в наличии</Tag>
        )}
      </div>

      <p className={styles.description}>{description}</p>

      <Descriptions bordered size="small" column={1} items={details} />
    </div>
  )
}

// Отзывы — получает reviews через пропс
const ProductReviews = ({ reviews }) => {
  if (!reviews?.length) return null

  return (
    <section className={styles.reviews}>
      <h2 className={styles.reviewsTitle}>Отзывы</h2>

      <div className={styles.reviewsList}>
        {reviews.map((r) => (
          <div key={`${r.reviewerEmail}-${r.date}`} className={styles.review}>
            <div className={styles.reviewHead}>
              <span className={styles.reviewer}>{r.reviewerName}</span>
              <span className={styles.reviewDate}>
                {new Date(r.date).toLocaleDateString("ru-RU")}
              </span>
            </div>
            <Rate disabled value={r.rating} style={{ fontSize: 14 }} />
            <p className={styles.reviewText}>{r.comment}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

const ProductPage = () => {
  const { id } = useParams()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null) // 'not-found' или текст ошибки

  useEffect(() => {
    // флаг, чтобы не записать в state ответ старого запроса,
    // если id уже сменился или компонент размонтирован
    let ignore = false

    const fetchProduct = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await getProductById(id)
        if (!ignore) setProduct(data)
      } catch (err) {
        if (!ignore) {
          setError(
            err.response?.status === 404
              ? "not-found"
              : "Не удалось загрузить товар. Попробуйте позже"
          )
        }
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    fetchProduct()

    return () => {
      ignore = true
    }
  }, [id])

  if (loading) {
    return (
      <div className={styles.center}>
        <Spin size="large" />
      </div>
    )
  }

  if (error === "not-found") {
    return (
      <Result
        status="404"
        title="Товар не найден"
        subTitle={`Товара с номером ${id} не существует`}
        extra={
          <Link to="/products">
            <Button type="primary">В каталог</Button>
          </Link>
        }
      />
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
      <Link to="/products" className={styles.back}>
        ← Назад в каталог
      </Link>

      <div className={styles.product}>
        {/* key сбрасывает выбранную картинку при переходе на другой товар */}
        <ProductGallery key={product.id} images={product.images} title={product.title} />
        <ProductInfo product={product} />
      </div>

      <ProductReviews reviews={product.reviews} />
    </div>
  )
}

export default ProductPage