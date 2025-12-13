import './SearchBar.css';

interface SearchParams {
  name: string;
  category: string;
  minPrice: string;
  maxPrice: string;
}

interface SearchBarProps {
  searchParams: SearchParams;
  onSearchChange: (params: SearchParams) => void;
}

const SearchBar = ({ searchParams, onSearchChange }: SearchBarProps) => {
  const handleChange = (field: keyof SearchParams, value: string) => {
    onSearchChange({
      ...searchParams,
      [field]: value,
    });
  };

  const handleClear = () => {
    onSearchChange({
      name: '',
      category: '',
      minPrice: '',
      maxPrice: '',
    });
  };

  return (
    <div className="search-bar">
      <div className="search-group">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchParams.name}
          onChange={(e) => handleChange('name', e.target.value)}
          className="search-input"
        />
      </div>
      <div className="search-group">
        <input
          type="text"
          placeholder="Category..."
          value={searchParams.category}
          onChange={(e) => handleChange('category', e.target.value)}
          className="search-input"
        />
      </div>
      <div className="search-group">
        <input
          type="number"
          placeholder="Min Price"
          value={searchParams.minPrice}
          onChange={(e) => handleChange('minPrice', e.target.value)}
          className="search-input"
          min="0"
        />
      </div>
      <div className="search-group">
        <input
          type="number"
          placeholder="Max Price"
          value={searchParams.maxPrice}
          onChange={(e) => handleChange('maxPrice', e.target.value)}
          className="search-input"
          min="0"
        />
      </div>
      <button onClick={handleClear} className="btn-clear">
        Clear
      </button>
    </div>
  );
};

export default SearchBar;

