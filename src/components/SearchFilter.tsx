import React, { useState, useEffect, useRef } from "react";
import { Search, X, ChevronDown } from "lucide-react";

interface SearchFilterProps {
  onSearch: (criteria: SearchCriteria) => void;
  isLoading?: boolean;
}

export interface SearchCriteria {
  keyword?: string;
  tags?: string[];
  startDate?: string;
  endDate?: string;
  isFavorite?: boolean;
  sortBy?: string;
  sortDirection?: string;
}

export const SearchFilter: React.FC<SearchFilterProps> = ({
  onSearch,
  isLoading = false,
}) => {
  const [keyword, setKeyword] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isFavorite, setIsFavorite] = useState<boolean | null>(null);
  const [sortBy, setSortBy] = useState("updatedAt");
  const [sortDirection, setSortDirection] = useState("desc");
  const [showAdvanced, setShowAdvanced] = useState(false);

  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const triggerSearch = () => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    searchTimeoutRef.current = setTimeout(() => {
      const criteria: SearchCriteria = {};
      if (keyword.trim()) criteria.keyword = keyword.trim();
      if (tags.length > 0) criteria.tags = tags;
      if (startDate) criteria.startDate = startDate;
      if (endDate) criteria.endDate = endDate;
      if (isFavorite !== null) criteria.isFavorite = isFavorite;
      criteria.sortBy = sortBy;
      criteria.sortDirection = sortDirection;
      onSearch(criteria);
    }, 300);
  };

  useEffect(() => {
    triggerSearch();
  }, [keyword, tags, startDate, endDate, isFavorite, sortBy, sortDirection]);



  const handleReset = () => {
    setKeyword("");
    setTags([]);
    setStartDate("");
    setEndDate("");
    setIsFavorite(null);
    setSortBy("updatedAt");
    setSortDirection("desc");
    setShowAdvanced(false);
  };

  return (
    <div style={{
      width: '100%',
      backgroundColor: 'var(--bg-elevated)',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--border-color)',
      boxShadow: 'var(--shadow-sm)',
      padding: '1rem',
      marginBottom: '1.5rem'
    }}>
      {/* Main Search Bar */}
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} size={16} />
          <input
            type="text"
            placeholder="Search notes by title or content..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '0.625rem 2.5rem',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-color)',
              backgroundColor: 'var(--bg-secondary)',
              color: 'var(--text-primary)',
              fontSize: '0.95rem'
            }}
          />
          {keyword && (
            <button
              onClick={() => setKeyword("")}
              style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }}
            >
              <X size={16} />
            </button>
          )}
        </div>

        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          style={{
            padding: '0.625rem 1rem',
            backgroundColor: 'var(--bg-secondary)',
            color: 'var(--text-primary)',
            borderRadius: 'var(--radius-lg)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.9rem',
            fontWeight: 500,
            border: '1px solid var(--border-color)'
          }}
        >
          <ChevronDown size={16} style={{ transform: showAdvanced ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
          Filters
        </button>

        <button
          onClick={handleReset}
          style={{
            padding: '0.625rem 1rem',
            color: 'var(--text-secondary)',
            fontSize: '0.9rem',
            fontWeight: 500
          }}
        >
          Reset
        </button>
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>


          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
              />
            </div>
          </div>

          <div>
             <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Sort By</label>
             <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
              >
                <option value="updatedAt">Last Updated</option>
                <option value="createdAt">Created Date</option>
                <option value="title">Title (A-Z)</option>
             </select>
          </div>
        </div>
      )}
    </div>
  );
};
