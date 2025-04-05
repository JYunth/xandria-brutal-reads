
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';

const readingLevels = [
  'Casual Reader',
  'Regular Reader',
  'Book Enthusiast',
  'Bookworm',
  'Literary Scholar'
];

const ProfileSettings = () => {
  const { user, updateUserProfile } = useAuth();
  
  const [name, setName] = useState(user?.name || '');
  const [age, setAge] = useState(user?.age || 0);
  const [readingLevel, setReadingLevel] = useState(user?.readingLevel || readingLevels[2]);
  const [englishProficiency, setEnglishProficiency] = useState(user?.englishProficiency || 3);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    updateUserProfile({
      name,
      age,
      readingLevel,
      englishProficiency
    });
    
    toast.success('Profile updated successfully!');
  };
  
  return (
    <div className="brutalist-container">
      <h3 className="font-serif text-xl mb-6">Edit Profile</h3>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium">
              Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border rounded-md"
              placeholder="Your name"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="age" className="block text-sm font-medium">
              Age
            </label>
            <input
              id="age"
              type="number"
              value={age}
              onChange={(e) => setAge(parseInt(e.target.value))}
              className="w-full p-2 border rounded-md"
              min={0}
              max={120}
              required
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="readingLevel" className="block text-sm font-medium">
            Reading Level
          </label>
          <select
            id="readingLevel"
            value={readingLevel}
            onChange={(e) => setReadingLevel(e.target.value)}
            className="w-full p-2 border rounded-md"
            required
          >
            {readingLevels.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium">
            English Proficiency: {['Beginner', 'Elementary', 'Intermediate', 'Advanced', 'Native'][englishProficiency - 1]}
          </label>
          <Slider
            defaultValue={[englishProficiency]}
            min={1}
            max={5}
            step={1}
            onValueChange={(value) => setEnglishProficiency(value[0])}
          />
        </div>
        
        <Button type="submit" className="w-full">
          Save Changes
        </Button>
      </form>
    </div>
  );
};

export default ProfileSettings;
