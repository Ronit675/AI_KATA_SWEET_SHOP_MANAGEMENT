import { Sweet } from '../services/api';
import './SweetCard.css';

interface SweetCardProps {
  sweet: Sweet;
  onPurchase: (id: string) => void;
  onEdit?: (sweet: Sweet) => void;
  onDelete?: (id: string) => void;
  onRestock?: (id: string, quantity: number) => void;
}

const SweetCard = ({
  sweet,
  onPurchase,
  onEdit,
  onDelete,
  onRestock,
}: SweetCardProps) => {
  const handleRestock = () => {
    const quantity = prompt('Enter quantity to restock:');
    if (quantity && !isNaN(Number(quantity)) && Number(quantity) > 0) {
      onRestock?.(sweet._id, Number(quantity));
    }
  };

  return (
    <div className="sweet-card">
      <div className="sweet-header">
        <h3>{sweet.name}</h3>
        <span className="sweet-category">{sweet.category}</span>
      </div>
      <div className="sweet-details">
        <div className="sweet-price">₹{sweet.price}</div>
        <div className={`sweet-quantity ${sweet.quantity === 0 ? 'out-of-stock' : ''}`}>
          {sweet.quantity === 0 ? 'Out of Stock' : `Stock: ${sweet.quantity}`}
        </div>
      </div>
      <div className="sweet-actions">
        <button
          onClick={() => onPurchase(sweet._id)}
          disabled={sweet.quantity === 0}
          className="btn-purchase"
        >
          Purchase
        </button>
        {onEdit && (
          <button onClick={() => onEdit(sweet)} className="btn-edit">
            Edit
          </button>
        )}
        {onDelete && (
          <button onClick={() => onDelete(sweet._id)} className="btn-delete">
            Delete
          </button>
        )}
        {onRestock && (
          <button onClick={handleRestock} className="btn-restock">
            Restock
          </button>
        )}
      </div>
    </div>
  );
};

export default SweetCard;

