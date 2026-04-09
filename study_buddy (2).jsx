import React, { useState, useEffect } from 'react';
import Confetti from 'react-confetti';

export default function StudyBuddyApp() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
  const savedXP = parseInt(localStorage.getItem('xp')) || 0;
  const savedStreak = parseInt(localStorage.getItem('streak')) || 0;
  const savedPet = localStorage.getItem('selectedPet') || '🐰';
  const savedPremium = JSON.parse(localStorage.getItem('premiumPets')) || [];
  const savedPremiumAccess = JSON.parse(localStorage.getItem('hasPremium')) || false;

  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [streak, setStreak] = useState(savedStreak);
  const [xp, setXp] = useState(savedXP);
  const [newTask, setNewTask] = useState('');
  const [newDue, setNewDue] = useState('');
  const [tasks, setTasks] = useState(savedTasks);
  const [selectedPet, setSelectedPet] = useState(savedPet);
  const [showConfetti, setShowConfetti] = useState(false);
  const [customHour, setCustomHour] = useState(0);
  const [customMinute, setCustomMinute] = useState(25);
  const [customSecond, setCustomSecond] = useState(0);
  const [premiumPets, setPremiumPets] = useState(savedPremium);
  const [hasPremium, setHasPremium] = useState(savedPremiumAccess);

  const pets = ['🐰', '🐶', '🐱', '🦊', '🐼', '🐹'];
  const premiumPetsOptions = ['🦄', '🐉', '🦋'];
  const premiumThemes = ['🌸 Pink', '🌌 Galaxy', '🍀 Nature'];
  const premiumSounds = ['🎵 Lo-fi', '🎶 Classical', '🔔 Custom Alerts'];
  const premiumPrice = '$3.00/month';

  useEffect(() => {
    if (loggedIn) {
      localStorage.setItem('tasks', JSON.stringify(tasks));
      localStorage.setItem('xp', xp);
      localStorage.setItem('streak', streak);
      localStorage.setItem('selectedPet', selectedPet);
      localStorage.setItem('premiumPets', JSON.stringify(premiumPets));
      localStorage.setItem('hasPremium', JSON.stringify(hasPremium));
    }
  }, [tasks, xp, streak, selectedPet, loggedIn, premiumPets, hasPremium]);

  useEffect(() => {
    let timer;
    if (running && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [running, timeLeft]);

  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  const resetTimer = () => {
    setRunning(false);
    setTimeLeft(customHour * 3600 + customMinute * 60 + customSecond);
  };

  const addTask = () => {
    if (!newTask.trim() || !newDue) return;
    const updatedTasks = [...tasks, { subject: newTask, due: newDue, done: false }];
    setTasks(updatedTasks);
    setNewTask('');
    setNewDue('');
  };

  const finishTask = (index) => {
    const updated = [...tasks];
    updated[index].done = true;
    setTasks(updated);
    setXp(xp + 10);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  const petSize = Math.min(5 + Math.floor(xp / 20), 10);

  const handleLogin = () => {
    if (username && password) {
      setLoggedIn(true);
    }
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setUsername('');
    setPassword('');
  };

  const purchasePremiumPet = (pet) => {
    if (!hasPremium) {
      alert('💖 Unlock premium access to buy premium pets!');
      return;
    }
    if (!premiumPets.includes(pet)) {
      setPremiumPets([...premiumPets, pet]);
      alert(`🎉 Purchase successful! You unlocked ${pet}`);
    }
  };

  const buyPremium = () => {
    setHasPremium(true);
    alert(`🎉 Premium unlocked for ${premiumPrice}! You now get premium pets, themes, sounds, and extra features.`);
  };

  if (!loggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-pink-50 via-purple-50 to-white">
        <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-xl w-full max-w-xs sm:max-w-md text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-purple-700 mb-4">📚 Study Buddy</h1>
          <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full px-4 py-2 mb-3 rounded-xl border border-purple-200 text-base sm:text-lg" />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-2 mb-3 rounded-xl border border-purple-200 text-base sm:text-lg" />
          <button onClick={handleLogin} className="w-full py-2 bg-gradient-to-r from-pink-200 to-purple-200 text-white rounded-xl font-semibold hover:scale-105 transition-transform mb-4 text-base sm:text-lg">Log In / Register</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-purple-50 to-white p-4 sm:p-6 font-sans relative space-y-6 w-full">
      <button onClick={handleLogout} className="absolute top-4 right-4 px-3 py-2 rounded-xl bg-purple-200 text-white font-semibold hover:scale-105 transition-transform text-sm sm:text-base">Logout</button>
      {showConfetti && <Confetti />}

      {/* Timer Section */}
      <div className="max-w-full sm:max-w-md mx-auto bg-white rounded-3xl shadow-lg p-4 sm:p-6 border border-pink-200 text-center space-y-2">
        <h2 className="text-purple-700 font-bold text-xl sm:text-2xl">⏰ Study Timer</h2>
        <div className="flex justify-center gap-2 mb-2">
          <input type="number" min="0" max="23" value={customHour} onChange={(e) => setCustomHour(parseInt(e.target.value) || 0)} className="w-16 px-2 py-1 rounded-xl border border-purple-200 text-center" />
          <span className="text-purple-500 font-bold">:</span>
          <input type="number" min="0" max="59" value={customMinute} onChange={(e) => setCustomMinute(parseInt(e.target.value) || 0)} className="w-16 px-2 py-1 rounded-xl border border-purple-200 text-center" />
          <span className="text-purple-500 font-bold">:</span>
          <input type="number" min="0" max="59" value={customSecond} onChange={(e) => setCustomSecond(parseInt(e.target.value) || 0)} className="w-16 px-2 py-1 rounded-xl border border-purple-200 text-center" />
        </div>
        <p className="text-center text-purple-500 text-lg sm:text-xl">{`${hours.toString().padStart(2,'0')}:${minutes.toString().padStart(2,'0')}:${seconds.toString().padStart(2,'0')}`}</p>
        <div className="flex justify-center gap-2">
          <button onClick={() => setRunning(!running)} className="px-4 py-2 bg-pink-200 rounded-xl text-white font-semibold hover:scale-105 transition-transform text-base sm:text-lg">{running ? 'Pause' : 'Start'}</button>
          <button onClick={resetTimer} className="px-4 py-2 bg-purple-200 rounded-xl text-white font-semibold hover:scale-105 transition-transform text-base sm:text-lg">Reset</button>
        </div>
      </div>

      {/* Tasks Section */}
      <div className="max-w-full sm:max-w-md mx-auto bg-white rounded-3xl shadow-lg p-4 sm:p-6 border border-pink-200 space-y-2">
        <h2 className="text-purple-700 font-bold text-xl sm:text-2xl text-center">📝 Homework Tasks</h2>
        {tasks.map((task, index) => (
          <div key={index} className={`flex justify-between items-center p-2 rounded-xl ${task.done ? 'bg-purple-100 line-through' : 'bg-pink-50'}`}>
            <span className="text-sm sm:text-base">{task.subject} - {task.due}</span>
            {!task.done && <button onClick={() => finishTask(index)} className="px-2 py-1 bg-purple-200 text-white rounded-xl text-sm sm:text-base">Done</button>}
          </div>
        ))}
        <div className="flex flex-wrap gap-2 mt-2">
          <input placeholder="New Task" value={newTask} onChange={(e) => setNewTask(e.target.value)} className="flex-1 px-2 py-1 rounded-xl border border-purple-200 text-sm sm:text-base" />
          <input type="date" value={newDue} onChange={(e) => setNewDue(e.target.value)} className="px-2 py-1 rounded-xl border border-purple-200 text-sm sm:text-base" />
          <button onClick={addTask} className="px-3 py-1 bg-pink-200 text-white rounded-xl text-sm sm:text-base">Add</button>
        </div>
      </div>

      {/* Pet Section */}
      <div className="max-w-full sm:max-w-md mx-auto bg-white rounded-3xl shadow-lg p-4 sm:p-6 text-center border border-pink-200">
        <h2 className="text-purple-700 font-bold text-xl sm:text-2xl mb-2">🐾 Your Pet</h2>
        <div className="text-4xl sm:text-5xl">{selectedPet.repeat(petSize)}</div>
        <div className="flex flex-wrap justify-center gap-2 mt-2">
          {pets.map((pet) => (
            <button key={pet} onClick={() => setSelectedPet(pet)} className={`text-2xl sm:text-3xl px-2 py-1 rounded-xl ${selectedPet === pet ? 'bg-purple-200' : 'bg-pink-100'} hover:scale-110 transition-transform`}>{pet}</button>
          ))}
          {hasPremium && premiumPetsOptions.map((pet) => (
            <button key={pet} onClick={() => setSelectedPet(pet)} className={`text-2xl sm:text-3xl px-2 py-1 rounded-xl ${selectedPet === pet ? 'bg-purple-200' : 'bg-pink-100'} hover:scale-110 transition-transform`}>{pet}</button>
          ))}
        </div>
      </div>

      {/* Premium Section */}
      <div className="max-w-full sm:max-w-md mx-auto bg-white rounded-3xl shadow-lg p-4 sm:p-6 border border-pink-200 text-center space-y-2">
        {!hasPremium ? (
          <>
            <h2 className="text-purple-700 font-bold text-xl sm:text-2xl">💖 Go Premium!</h2>
            <p className="text-purple-500 text-sm sm:text-base">Unlock premium pets, themes, sounds, and extra features!</p>
            <button onClick={buyPremium} className="px-4 py-2 bg-pink-300 text-white rounded-xl hover:scale-105 transition-transform text-base sm:text-lg">Buy Premium ({premiumPrice})</button>
          </>
        ) : (
          <>
            <h2 className="text-purple-700 font-bold text-xl sm:text-2xl">✨ Premium Unlocked!</h2>
            <p className="text-purple-500 text-sm sm:text-base">You now have access to premium pets, themes, sounds, and extra features.</p>
          </>
        )}
      </div>
    </div>
  );
}
