import React from 'react';
import AdminPage from './AdminPage';

export default function AdminHome({match}) {
    return (
      <div>
          {AdminPage(match)}
      </div>
    );
}
