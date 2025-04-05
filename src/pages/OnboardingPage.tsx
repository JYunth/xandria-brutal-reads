
import { useState, useRef } from 'react'; // Import useRef
import { useNavigate } from 'react-router-dom';
// Slider import removed
import Stepper, { Step } from '@/components/ui/Stepper'; // Import Stepper
import ElasticSlider from '@/components/ui/ElasticSlider'; // Import ElasticSlider
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

const readingLevels = [
  'Casual Reader',
  'Regular Reader',
  'Book Enthusiast',
  'Bookworm',
  'Literary Scholar',
];

const OnboardingPage = () => {
  // Step state removed
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [readingLevel, setReadingLevel] = useState(readingLevels[2]);
  const [englishProficiency, setEnglishProficiency] = useState(3);
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(false); // Add completion state
  const videoRef = useRef<HTMLVideoElement>(null); // Ref for video element

  const { updateUserProfile } = useAuth();
  const navigate = useNavigate();

  // handleNext and handleBack removed

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
    // Don't navigate immediately, set completion state instead
    setIsOnboardingComplete(true); 
  };

  const handleVideoEnd = () => {
    navigate('/bookstore'); // Navigate after video ends
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-background marble-texture py-12 px-4">
      {/* Apply brutalist container style directly */}
      {/* Adjusted padding for completion state */}
      <div className={`w-full max-w-lg brutalist-container ${isOnboardingComplete ? 'p-8' : 'p-0'}`}> 
        
        {!isOnboardingComplete ? (
          <>
            {/* Stepper Section */}
            {/* Removed padding p-0 as Stepper adds its own */}
            <h2 className="font-serif text-2xl font-bold mb-6 text-center pt-8 px-8">Welcome to Xandria</h2> 
            {/* Added padding back to title */}
            
            {/* Old step indicator removed */}

            <Stepper
              initialStep={1}
              onFinalStepCompleted={handleComplete}
          // Override default Stepper styling to fit brutalist theme
          className="flex-none min-h-0 p-0" // Remove Stepper's default layout/padding
          stepCircleContainerClassName="shadow-none rounded-none border-none max-w-full" // Remove Stepper's inner container border/shadow/rounding/max-width
          stepContainerClassName="px-8 pt-0 pb-4" // Adjust padding for step indicators
          contentClassName="px-0" // Remove Stepper's default content padding (Step adds its own)
          footerClassName="px-8 pb-8" // Keep footer padding
          backButtonText="Back"
          nextButtonText="Next"
          // Custom button styling to match project's Button component
          backButtonProps={{ className: "bg-background border border-foreground hover:bg-muted text-foreground px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50" }}
          nextButtonProps={{ className: "bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-md text-sm font-medium" }}
        >
          <Step>
            {/* Content from old step 1 */}
            <div className="space-y-6">
              {/* Added period to heading */}
              <h3 className="font-medium text-lg">Let's get to know you.</h3> 
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
            </div> {/* Added missing closing div */}
          </Step>

          <Step>
            {/* Content from old step 2 */}
            <div className="space-y-6">
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
            </div> {/* Added missing closing div */}
          </Step>

          <Step>
            {/* Content from old step 3 */}
            <div className="space-y-6">
              <h3 className="font-medium text-lg">Language proficiency</h3>
              <div className="space-y-4">
                <div className="space-y-4 pt-4"> {/* Added pt-4 for spacing */}
                  <label className="block text-sm font-medium text-center mb-4"> {/* Centered label */}
                    How would you rate your English proficiency?
                  </label>
                  {/* Removed old text display */}
                  {/* Replace old Slider with ElasticSlider */}
                  <ElasticSlider
                    startingValue={1}
                    maxValue={5}
                    defaultValue={englishProficiency}
                    isStepped={true}
                    stepSize={1}
                    onChange={setEnglishProficiency}
                    // Use text spans for icons, matching old style
                    leftIcon={<span className="text-xs text-muted-foreground">Beginner</span>}
                    rightIcon={<span className="text-xs text-muted-foreground">Native</span>}
                    // Override default width to fill container
                    className="w-full" 
                  />
                  {/* Removed old text labels below slider */}
                </div>
              </div>
            </div> {/* Added missing closing div */}
          </Step>
        </Stepper>
            {/* End Stepper */}
            
            {/* Old buttons removed */}
          </>
        ) : (
          <>
            {/* Completion Animation Section */}
            <div className="flex flex-col items-center justify-center animate-fade-in">
              <video 
                ref={videoRef}
                src="/lottie/ok.mp4" 
                autoPlay 
                muted // Mute if no sound needed, prevents autoplay issues
                onEnded={handleVideoEnd}
                className="w-48 h-48 mb-4" // Adjust size as needed
              />
              <p className="text-xl font-medium">All set!</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default OnboardingPage;
