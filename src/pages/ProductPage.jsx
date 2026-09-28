import { useParams } from "react-router-dom"

const ProductPage = () => {

  const { id } = useParams()

  return <h1>Товар номер {id}</h1>
}

export default ProductPage