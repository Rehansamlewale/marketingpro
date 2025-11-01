import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

// Icons (you can replace these with actual icon libraries like react-icons)
const SearchIcon = () => <span style={{ marginRight: '4px' }}>🔍</span>;
const AddIcon = () => <span style={{ marginRight: '4px' }}>➕</span>;
const EditIcon = () => <span style={{ marginRight: '4px' }}>✏️</span>;
const ClockIcon = () => <span style={{ marginRight: '4px' }}>🕒</span>;
const WarningIcon = () => <span style={{ marginRight: '4px' }}>⚠️</span>;
const CheckIcon = () => <span style={{ marginRight: '4px' }}>✓</span>;
const ErrorIcon = () => <span style={{ marginRight: '4px' }}>❌</span>;
const UsersIcon = () => <span style={{ marginRight: '8px' }}>👥</span>;

// Format date with relative time
const formatDate = (timestamp) => {
  if (!timestamp) return 'N/A';
  const date = new Date(parseInt(timestamp));
  const now = new Date();
  const diffTime = now - date;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  const timeStr = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  
  if (date.toDateString() === now.toDateString()) {
    return `Today, ${timeStr}`;
  }
  
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) {
    return `Yesterday, ${timeStr}`;
  }
  
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Get remaining days with relative time
const getRemainingDays = (expiryTimestamp) => {
  if (!expiryTimestamp) return 'No expiry';
  
  const now = Date.now();
  const expiryDate = parseInt(expiryTimestamp);
  const diffTime = expiryDate - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffTime < 0) {
    return `Expired ${Math.abs(diffDays)} day${Math.abs(diffDays) === 1 ? '' : 's'} ago`;
  }
  
  return `Expires in ${diffDays} day${diffDays === 1 ? '' : 's'}`;
};

// Format phone number - remove 91 prefix
const formatPhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return 'N/A';
  
  // Remove any non-digit characters
  const cleaned = phoneNumber.toString().replace(/\D/g, '');
  
  // Remove 91 prefix if present
  if (cleaned.startsWith('91') && cleaned.length > 10) {
    return cleaned.substring(2);
  }
  
  return cleaned;
};

// Styled Components
const Container = styled.div`
  padding: 2rem;
  max-width: 100%;
  overflow-x: auto;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const Title = styled.h2`
  color: #1f2937;
  font-size: 1.875rem;
  font-weight: 700;
  margin: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const UserCount = styled.div`
  background: rgba(79, 70, 229, 0.1);
  color: #4f46e5;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.875rem;
  font-weight: 600;
  border: 1px solid rgba(79, 70, 229, 0.2);
`;

const AddButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 0.75rem;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(79, 70, 229, 0.3);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(79, 70, 229, 0.4);
    background: linear-gradient(135deg, #4338ca 0%, #6d28d9 100%);
  }
`;

const SearchContainer = styled.div`
  margin-bottom: 2rem;
  position: relative;
  max-width: 500px;
  width: 100%;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  border: 2px solid #e5e7eb;
  border-radius: 1rem;
  font-size: 1rem;
  background: white;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  
  &:focus {
    outline: none;
    border-color: #4f46e5;
    box-shadow: 0 4px 12px rgba(79, 70, 229, 0.2);
    transform: translateY(-1px);
  }
  
  &::placeholder {
    color: #9ca3af;
  }
`;

const SearchIconContainer = styled.div`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  font-size: 1.1rem;
`;

const TableContainer = styled.div`
  background: white;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: white;
`;

const TableHeader = styled.thead`
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-bottom: 2px solid #e5e7eb;
`;

const TableRow = styled.tr`
  transition: all 0.2s ease;
  border-bottom: 1px solid #f1f5f9;
  
  &:hover {
    background-color: #f8fafc;
    transform: scale(1.01);
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const TableHeaderCell = styled.th`
  padding: 1.25rem 1rem;
  text-align: left;
  font-size: 0.875rem;
  font-weight: 700;
  color: #374151;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 1rem;
    right: 1rem;
    height: 2px;
    background: linear-gradient(90deg, #4f46e5, #7c3aed);
    opacity: 0.5;
  }
`;

const TableCell = styled.td`
  padding: 1.25rem 1rem;
  font-size: 0.95rem;
  color: #4b5563;
  font-weight: 500;
`;

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 1rem;
  border-radius: 1rem;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: capitalize;
  transition: all 0.2s ease;
  border: 1px solid transparent;
  
  &.admin {
    background: linear-gradient(135deg, #eef2ff, #e0e7ff);
    color: #3730a3;
    border-color: #c7d2fe;
  }
  
  &.user {
    background: linear-gradient(135deg, #ecfdf5, #d1fae5);
    color: #065f46;
    border-color: #a7f3d0;
  }
  
  &.active {
    background: linear-gradient(135deg, #dcfce7, #bbf7d0);
    color: #166534;
    border-color: #86efac;
  }
  
  &.inactive {
    background: linear-gradient(135deg, #fef2f2, #fee2e2);
    color: #991b1b;
    border-color: #fca5a5;
  }
  
  &.expired {
    background: linear-gradient(135deg, #ffedd5, #fed7aa);
    color: #9a3412;
    border-color: #fdba74;
  }
`;

const ActionLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: #4f46e5;
  text-decoration: none;
  font-weight: 600;
  padding: 0.5rem 1rem;
  border-radius: 0.75rem;
  background: rgba(79, 70, 229, 0.1);
  border: 1px solid rgba(79, 70, 229, 0.2);
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(79, 70, 229, 0.2);
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(79, 70, 229, 0.2);
    text-decoration: none;
  }
`;

const NoData = styled.td`
  padding: 3rem 2rem;
  text-align: center;
  color: #6b7280;
  font-style: italic;
  background: #f9fafb;
`;

const Loading = styled.div`
  padding: 3rem;
  text-align: center;
  color: #4b5563;
  font-size: 1.1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid #e5e7eb;
  border-top: 4px solid #4f46e5;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ErrorMessage = styled.div`
  padding: 1.5rem;
  background: linear-gradient(135deg, #fef2f2, #fee2e2);
  color: #b91c1c;
  border-radius: 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin: 1rem 0;
  border: 1px solid #fecaca;
  box-shadow: 0 4px 6px rgba(220, 38, 38, 0.1);
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  border: 1px solid #e5e7eb;
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
  }
  
  ${props => props.active && `
    background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
    color: white;
    
    ${StatValue}, ${StatLabel} {
      color: white;
    }
  `}
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.5rem;
  transition: color 0.3s ease;
`;

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 600;
  transition: color 0.3s ease;
`;

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'active', 'expired'

 useEffect(() => {
  const fetchUsers = async () => {
    try {
      const response = await fetch(
        'https://scroller-4d10f-default-rtdb.firebaseio.com/MarketingPro/users.json'
      );

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();

      const usersArray = [];
      for (const phoneNumber in data) {
        if (data[phoneNumber] !== null) {
          usersArray.push({
            id: phoneNumber,
            ...data[phoneNumber]
          });
        }
      }

      // ✅ Sort latest first
      const sortedUsers = usersArray.sort((a, b) => b.created_at - a.created_at);
      setUsers(sortedUsers);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  fetchUsers();
}, []);

  // Filter users based on search term and active filter
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.phone_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.referrer?.toLowerCase().includes(searchTerm.toLowerCase());
    
   const now = Date.now();
const matchesFilter = 
  activeFilter === 'all' ? true :
  activeFilter === 'active' ? (user.expiry_date && parseInt(user.expiry_date) >= now) :
  activeFilter === 'expired' ? (user.expiry_date && parseInt(user.expiry_date) < now) :
  true;

    
    return matchesSearch && matchesFilter;
  });

// Calculate stats properly
const now = Date.now();

const totalUsers = users.length;

// Users whose expiry date is in the future (or today)
const activeUsers = users.filter(user => 
  user.expiry_date && parseInt(user.expiry_date) >= now
).length;

// Users whose expiry date has passed
const expiredUsers = users.filter(user => 
  user.expiry_date && parseInt(user.expiry_date) < now
).length;


  // Handle filter clicks
  const handleFilterClick = (filterType) => {
    setActiveFilter(filterType);
  };

  if (loading) {
    return (
      <Container>
        <Loading>
          <LoadingSpinner />
          Loading users...
        </Loading>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <ErrorMessage>
          <ErrorIcon />
          {error}
        </ErrorMessage>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <TitleContainer>
          <Title>
            <UsersIcon />
            Users Management
          </Title>
          <UserCount>{totalUsers} Users</UserCount>
        </TitleContainer>
        <AddButton to="/add-user">
          <AddIcon />
          Add New User
        </AddButton>
      </Header>
      
      <StatsContainer>
        <StatCard 
          active={activeFilter === 'all'}
          onClick={() => handleFilterClick('all')}
        >
          <StatValue>{totalUsers}</StatValue>
          <StatLabel>Total Users</StatLabel>
        </StatCard>
        <StatCard 
          active={activeFilter === 'active'}
          onClick={() => handleFilterClick('active')}
        >
          <StatValue>{activeUsers}</StatValue>
          <StatLabel>Active Users</StatLabel>
        </StatCard>
        <StatCard 
          active={activeFilter === 'expired'}
          onClick={() => handleFilterClick('expired')}
        >
          <StatValue>{expiredUsers}</StatValue>
          <StatLabel>Expired Users</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{filteredUsers.length}</StatValue>
          <StatLabel>Filtered Results</StatLabel>
        </StatCard>
      </StatsContainer>
      
      <SearchContainer>
        <SearchIconContainer>
          <SearchIcon />
        </SearchIconContainer>
        <SearchInput
          type="text"
          placeholder="Search by phone, name, or referrer..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </SearchContainer>
      
      <TableContainer>
        <Table>
          <TableHeader>
            <tr>
              
              <TableHeaderCell>User Name</TableHeaderCell>
              <TableHeaderCell>Phone Number</TableHeaderCell>
              <TableHeaderCell>Role</TableHeaderCell>
              <TableHeaderCell>Created On</TableHeaderCell>
              <TableHeaderCell>Expiry Date</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
              <TableHeaderCell>Referrer</TableHeaderCell>
           
            </tr>
          </TableHeader>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => {
                const isExpired = user.expiry_date && user.expiry_date < Date.now();
                const expiryStatus = getRemainingDays(user.expiry_date);
                
                return (
                  <TableRow key={user.id}>
                  
                    <TableCell>{user.user_name || 'N/A'}</TableCell>
                      <TableCell>
                      <div style={{ fontWeight: '600', color: '#1f2937' }}>
                        {formatPhoneNumber(user.phone_number)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={user.role?.toLowerCase() || 'user'}>
                        {user.role || 'user'}
                      </Badge>
                    </TableCell>
                    
                    <TableCell>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <ClockIcon />
                        {formatDate(user.created_at)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <span>{formatDate(user.expiry_date)}</span>
                        <Badge className={isExpired ? 'expired' : 'active'}>
                          {isExpired ? <WarningIcon /> : <CheckIcon />}
                          {expiryStatus}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={user.status?.toLowerCase() || 'inactive'}>
                        {user.status || 'inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>{user.referrer || 'N/A'}</TableCell>
                    
                  </TableRow>
                );
              })
            ) : (
              <tr>
                <NoData colSpan="8">
                  {searchTerm || activeFilter !== 'all' 
                    ? 'No users found matching your criteria.' 
                    : 'No users found. Add a new user to get started.'}
                </NoData>
              </tr>
            )}
          </tbody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default UsersList;