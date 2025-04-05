
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

const readingLevels = [
  'Casual Reader',
  'Regular Reader',
  'Book Enthusiast',
  'Bookworm',
  'Literary Scholar'
];

const OnboardingPage = () => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [readingLevel, setReadingLevel] = useState(readingLevels[2]);
  const [englishProficiency, setEnglishProficiency] = useState(3);

  const { updateUserProfile } = useAuth();
  const navigate = useNavigate();

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleComplete = () => {
    updateUserProfile({
      name,
      age: parseInt(age),
      readingLevel,
      englishProficiency,
      xp: 0,
      level: 1
    });

    toast.success('Profile created! Welcome to Xandria.');
    navigate('/bookstore');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background marble-texture py-12 px-4">
      <div className="w-full max-w-lg brutalist-container">
        <h2 className="font-serif text-2xl font-bold mb-6 text-center">Welcome to Xandria</h2>
        
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            {[1, 2, 3].map(i => (
              <div 
                key={i}
                className={`w-8 h-8 rounded-full flex items-center justify-center font-medium ${
                  i === step 
                    ? 'bg-primary text-primary-foreground' 
                    : i < step 
                    ? 'bg-muted text-primary' 
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {i}
              </div>
            ))}
          </div>
          <div className="w-full h-1 bg-muted">
            <div 
              className="h-full bg-primary transition-all" 
              style={{ width: `${(step - 1) * 50}%` }}
            />
          </div>
        </div>

        {step === 1 && (
          <div className="space-y-6 animate-fade-in">
            <h3 className="font-medium text-lg">Let's get to know you</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium">
                  What should we call you?
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
                  How old are you?
                </label>
                <input
                  id="age"
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full p-2 border rounded-md"
                  placeholder="Your age"
                  min={0}
                  max={120}
                  required
                />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-fade-in">
            <h3 className="font-medium text-lg">Your reading profile</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="readingLevel" className="block text-sm font-medium">
                  How would you describe yourself as a reader?
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
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-fade-in">
            <h3 className="font-medium text-lg">Language proficiency</h3>
            <div className="space-y-4">
              <div className="space-y-4">
                <label className="block text-sm font-medium">
                  How would you rate your English proficiency?
                </label>
                <div className="text-center font-medium text-lg">
                  {['Beginner', 'Elementary', 'Intermediate', 'Advanced', 'Native'][englishProficiency - 1]}
                </div>
                <Slider
                  defaultValue={[englishProficiency]}
                  min={1}
                  max={5}
                  step={1}
                  onValueChange={(value) => setEnglishProficiency(value[0])}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Beginner</span>
                  <span>Native</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={step === 1}
          >
            Back
          </Button>
          <Button onClick={handleNext}>
            {step === 3 ? 'Complete' : 'Next'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
