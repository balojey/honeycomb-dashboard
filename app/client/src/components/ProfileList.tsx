import React from 'react';
import { useProfileStore } from '../stores/profileStore';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const ProfileList: React.FC = () => {
  const { profiles, isLoading, error } = useProfileStore();

  if (isLoading) {
    return <div>Loading profiles...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  if (profiles.length === 0) {
    return <p>No profiles found for this project.</p>;
  }

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Profiles</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User ID</TableHead>
              <TableHead>Profile Address</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Avatar</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {profiles.map((profile) => (
              <TableRow key={profile.address}>
                <TableCell>{profile.user.id}</TableCell>
                <TableCell title={profile.address}>
                  {truncateAddress(profile.address)}
                </TableCell>
                <TableCell>{profile.info.name || 'N/A'}</TableCell>
                <TableCell>
                  {profile.info.pfp ? (
                    <img src={profile.info.pfp} alt={profile.info.name || 'avatar'} className="w-10 h-10 rounded-full" />
                  ) : (
                    'N/A'
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
