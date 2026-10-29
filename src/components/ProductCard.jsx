import { Link } from 'react-router-dom';
import SmartImage from './SmartImage.jsx';
import Icon from './Icon.jsx';
import { formatPriceRange, productPath } from '../utils/format.js';

export default function ProductCard({ product, eager = false }) {
  const path = productPath(product);
  return (
    <article className="product-card">
      <Link to={path} className="product-card__media" tabIndex={-1} aria-hidden="true">
        <SmartImage src={product.imageUrl} alt="" width={600} height={600} eager={eager} />
      </Link>
      <div className="product-card__body">
        <p className="product-card__category">{product.category.name}</p>
        <h3 className="product-card__title">
          <Link to={path}>{product.name}</Link>
        </h3>
        <p className="product-card__desc">{product.shortDescription}</p>
        <div className="product-card__meta">
          <p className="price">{formatPriceRange(product.minPrice, product.maxPrice)}<span> / unit</span></p>
          <p className="moq">MOQ {product.minOrderQuantity}</p>
        </div>
        <Link to={path} className="product-card__link">
          View details <Icon name="arrowRight" size={16} />
        </Link>
      </div>
    </article>
  );
}
