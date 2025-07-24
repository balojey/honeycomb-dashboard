import React from 'react';
import { ProfileList } from '../components/ProfileList';

interface UserListPageProps {}

export const UserListPage: React.FC<UserListPageProps> = () => {

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Users & Profiles</h2>
      <ProfileList />
    </div>
  );
};