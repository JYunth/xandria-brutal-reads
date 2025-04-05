export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  message: string;
  timestamp: string;
}

export const getUserData = () => {
  try {
    const userDataString = localStorage.getItem('userData');
    return userDataString ? JSON.parse(userDataString) : {};
  } catch (error) {
    console.error('Failed to retrieve user data from localStorage', error);
    return {};
  }
};

export const updateUserData = (key: string, value: any) => {
  try {
    const userData = getUserData();
    userData[key] = value;
    localStorage.setItem('userData', JSON.stringify(userData));
  } catch (error) {
    console.error('Failed to update user data in localStorage', error);
  }
};
