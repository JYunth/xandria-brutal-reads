
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileStats from '@/components/ProfileStats';
import ProfileSettings from '@/components/ProfileSettings';
import { useAuth } from '@/context/AuthContext';

const ProfilePage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-8">
      <div className="text-center max-w-2xl mx-auto mb-8">
        <h1 className="font-serif text-4xl font-bold mb-4">Your Profile</h1>
        <p className="text-muted-foreground">
          View your reading statistics and manage your account settings
        </p>
      </div>

      <Tabs defaultValue="dashboard" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto mb-8">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard" className="animate-fade-in">
          <ProfileStats />
        </TabsContent>
        
        <TabsContent value="settings" className="animate-fade-in">
          <ProfileSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfilePage;
