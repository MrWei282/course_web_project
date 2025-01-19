import React from 'react';

import { Navigate } from 'react-router-dom';

import AuthContext from 'AuthContext';

const ProtectedRoute = ({ element }) => {
  const { token } = React.useContext(AuthContext);
  return (
    token
      ? element
      : <Navigate to="/login" />
  );
}

export default ProtectedRoute;
