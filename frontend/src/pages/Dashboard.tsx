import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { sweetService, Sweet } from '../services/api';
import SweetCard from '../components/SweetCard';
import SweetModal from '../components/SweetModal';
import SearchBar from '../components/SearchBar';
import './Dashboard.css';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [sweets, setSweets] = useState<Sweet[]>([]);
  const [filteredSweets, setFilteredSweets] = useState<Sweet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingSweet, setEditingSweet] = useState<Sweet | null>(null);
  const [searchParams, setSearchParams] = useState({
    name: '',
    category: '',
    minPrice: '',
    maxPrice: '',
  });

  useEffect(() => {
    loadSweets();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [sweets, searchParams]);

  const loadSweets = async () => {
    try {
      setLoading(true);
      const data = await sweetService.getAll();
      setSweets(data);
      setFilteredSweets(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load sweets');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = async () => {
    try {
      const params: any = {};
      if (searchParams.name) params.name = searchParams.name;
      if (searchParams.category) params.category = searchParams.category;
      if (searchParams.minPrice) params.minPrice = Number(searchParams.minPrice);
      if (searchParams.maxPrice) params.maxPrice = Number(searchParams.maxPrice);

      if (Object.keys(params).length > 0) {
        const filtered = await sweetService.search(params);
        setFilteredSweets(filtered);
      } else {
        setFilteredSweets(sweets);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to filter sweets');
    }
  };

  const handlePurchase = async (id: string) => {
    try {
      await sweetService.purchase(id, 1);
      await loadSweets();
    } catch (err: any) {
      setError(err.message || 'Failed to purchase sweet');
    }
  };

  const handleCreate = () => {
    setEditingSweet(null);
    setShowModal(true);
  };

  const handleEdit = (sweet: Sweet) => {
    setEditingSweet(sweet);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this sweet?')) {
      return;
    }

    try {
      await sweetService.delete(id);
      await loadSweets();
    } catch (err: any) {
      setError(err.message || 'Failed to delete sweet');
    }
  };

  const handleRestock = async (id: string, quantity: number) => {
    try {
      await sweetService.restock(id, quantity);
      await loadSweets();
    } catch (err: any) {
      setError(err.message || 'Failed to restock sweet');
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingSweet(null);
    loadSweets();
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>🍬 Sweet Shop Management</h1>
          <div className="header-actions">
            <span className="user-info">
              {user?.email} ({user?.role})
            </span>
            {user?.role === 'admin' && (
              <button onClick={handleCreate} className="btn-add">
                + Add Sweet
              </button>
            )}
            <button onClick={logout} className="btn-logout">
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="dashboard-content">
        <SearchBar
          searchParams={searchParams}
          onSearchChange={setSearchParams}
        />

        {error && <div className="error-banner">{error}</div>}

        {loading ? (
          <div className="loading">Loading sweets...</div>
        ) : (
          <div className="sweets-grid">
            {filteredSweets.length === 0 ? (
              <div className="empty-state">
                <p>No sweets found. {user?.role === 'admin' && 'Add some sweets to get started!'}</p>
              </div>
            ) : (
              filteredSweets.map((sweet) => (
                <SweetCard
                  key={sweet._id}
                  sweet={sweet}
                  onPurchase={handlePurchase}
                  onEdit={user?.role === 'admin' ? handleEdit : undefined}
                  onDelete={user?.role === 'admin' ? handleDelete : undefined}
                  onRestock={user?.role === 'admin' ? handleRestock : undefined}
                />
              ))
            )}
          </div>
        )}
      </div>

      {showModal && (
        <SweetModal
          sweet={editingSweet}
          onClose={handleModalClose}
          onSave={handleModalClose}
        />
      )}
    </div>
  );
};

export default Dashboard;

