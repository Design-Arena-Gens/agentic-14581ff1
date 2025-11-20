'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [workouts, setWorkouts] = useState([]);
  const [workoutType, setWorkoutType] = useState('');
  const [duration, setDuration] = useState('');
  const [intensity, setIntensity] = useState('medium');
  const [notes, setNotes] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('workouts');
    if (saved) {
      setWorkouts(JSON.parse(saved));
    }
  }, []);

  const saveWorkouts = (newWorkouts) => {
    localStorage.setItem('workouts', JSON.stringify(newWorkouts));
  };

  const addWorkout = (e) => {
    e.preventDefault();
    if (!workoutType || !duration) return;

    const newWorkout = {
      id: Date.now(),
      type: workoutType,
      duration: parseInt(duration),
      intensity,
      notes,
      date: new Date().toLocaleDateString(),
      timestamp: new Date().toISOString()
    };

    const updated = [newWorkout, ...workouts];
    setWorkouts(updated);
    saveWorkouts(updated);

    setWorkoutType('');
    setDuration('');
    setNotes('');
    setIntensity('medium');
    setShowForm(false);
    setAnimate(true);
    setTimeout(() => setAnimate(false), 1000);
  };

  const deleteWorkout = (id) => {
    const updated = workouts.filter(w => w.id !== id);
    setWorkouts(updated);
    saveWorkouts(updated);
  };

  const totalWorkouts = workouts.length;
  const totalMinutes = workouts.reduce((sum, w) => sum + w.duration, 0);
  const streak = calculateStreak(workouts);

  function calculateStreak(workouts) {
    if (workouts.length === 0) return 0;

    const dates = [...new Set(workouts.map(w => w.date))].sort((a, b) =>
      new Date(b) - new Date(a)
    );

    let streak = 0;
    const today = new Date().toLocaleDateString();
    let checkDate = new Date();

    for (let date of dates) {
      const compareDate = checkDate.toLocaleDateString();
      if (date === compareDate) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  }

  const intensityColors = {
    light: '#4ade80',
    medium: '#fbbf24',
    hard: '#f87171',
    beast: '#dc2626'
  };

  const intensityEmojis = {
    light: '💚',
    medium: '💛',
    hard: '🔥',
    beast: '💀'
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>
          <span style={styles.titleIcon}>💪</span>
          PUMP TRACKER
          <span style={styles.titleIcon}>🔥</span>
        </h1>
        <p style={styles.subtitle}>CRUSH YOUR GOALS. TRACK YOUR GAINS.</p>
      </div>

      <div style={styles.statsContainer}>
        <div style={{...styles.statCard, ...(animate ? styles.statCardAnimate : {})}}>
          <div style={styles.statNumber}>{totalWorkouts}</div>
          <div style={styles.statLabel}>TOTAL WORKOUTS</div>
        </div>
        <div style={{...styles.statCard, ...(animate ? styles.statCardAnimate : {})}}>
          <div style={styles.statNumber}>{totalMinutes}</div>
          <div style={styles.statLabel}>MINUTES</div>
        </div>
        <div style={{...styles.statCard, ...(animate ? styles.statCardAnimate : {})}}>
          <div style={styles.statNumber}>{streak} 🔥</div>
          <div style={styles.statLabel}>DAY STREAK</div>
        </div>
      </div>

      {!showForm ? (
        <button
          style={styles.addButton}
          onClick={() => setShowForm(true)}
          onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
          onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
        >
          <span style={styles.addButtonText}>+ LOG WORKOUT</span>
        </button>
      ) : (
        <form onSubmit={addWorkout} style={styles.form}>
          <div style={styles.formGrid}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>WORKOUT TYPE</label>
              <input
                type="text"
                value={workoutType}
                onChange={(e) => setWorkoutType(e.target.value)}
                placeholder="Bench Press, Running, Yoga..."
                style={styles.input}
                required
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>DURATION (MIN)</label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="30"
                style={styles.input}
                required
                min="1"
              />
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>INTENSITY</label>
            <div style={styles.intensityGrid}>
              {['light', 'medium', 'hard', 'beast'].map(level => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setIntensity(level)}
                  style={{
                    ...styles.intensityButton,
                    backgroundColor: intensity === level ? intensityColors[level] : '#374151',
                    transform: intensity === level ? 'scale(1.1)' : 'scale(1)',
                  }}
                >
                  <span style={styles.intensityEmoji}>{intensityEmojis[level]}</span>
                  <span style={styles.intensityLabel}>{level.toUpperCase()}</span>
                </button>
              ))}
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>NOTES (OPTIONAL)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="PR today! 💪"
              style={{...styles.input, ...styles.textarea}}
            />
          </div>

          <div style={styles.formButtons}>
            <button type="submit" style={styles.submitButton}>
              🚀 LOG IT!
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              style={styles.cancelButton}
            >
              CANCEL
            </button>
          </div>
        </form>
      )}

      <div style={styles.workoutsList}>
        {workouts.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>💪</div>
            <div style={styles.emptyText}>NO WORKOUTS YET</div>
            <div style={styles.emptySubtext}>Time to get pumped! Log your first workout.</div>
          </div>
        ) : (
          workouts.map((workout) => (
            <div key={workout.id} style={styles.workoutCard}>
              <div style={styles.workoutHeader}>
                <div style={styles.workoutType}>{workout.type}</div>
                <button
                  onClick={() => deleteWorkout(workout.id)}
                  style={styles.deleteButton}
                >
                  ×
                </button>
              </div>
              <div style={styles.workoutDetails}>
                <span style={styles.workoutBadge}>
                  ⏱️ {workout.duration} min
                </span>
                <span
                  style={{
                    ...styles.workoutBadge,
                    backgroundColor: intensityColors[workout.intensity]
                  }}
                >
                  {intensityEmojis[workout.intensity]} {workout.intensity.toUpperCase()}
                </span>
                <span style={styles.workoutBadge}>
                  📅 {workout.date}
                </span>
              </div>
              {workout.notes && (
                <div style={styles.workoutNotes}>{workout.notes}</div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    color: '#fff',
    padding: '20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  header: {
    textAlign: 'center',
    marginBottom: '40px',
    paddingTop: '20px',
  },
  title: {
    fontSize: '48px',
    fontWeight: '900',
    margin: '0',
    textTransform: 'uppercase',
    letterSpacing: '4px',
    background: 'linear-gradient(45deg, #ff6b6b, #feca57, #48dbfb, #ff9ff3)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundSize: '300% 300%',
    animation: 'gradient 3s ease infinite',
  },
  titleIcon: {
    margin: '0 15px',
  },
  subtitle: {
    fontSize: '16px',
    fontWeight: '700',
    letterSpacing: '3px',
    color: '#48dbfb',
    margin: '10px 0 0 0',
  },
  statsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '20px',
    maxWidth: '900px',
    margin: '0 auto 40px',
  },
  statCard: {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    borderRadius: '20px',
    padding: '30px 20px',
    textAlign: 'center',
    border: '2px solid rgba(255, 255, 255, 0.2)',
    transition: 'transform 0.3s ease',
  },
  statCardAnimate: {
    animation: 'pulse 0.5s ease',
  },
  statNumber: {
    fontSize: '36px',
    fontWeight: '900',
    color: '#feca57',
    marginBottom: '8px',
  },
  statLabel: {
    fontSize: '12px',
    fontWeight: '700',
    letterSpacing: '2px',
    color: '#ddd',
  },
  addButton: {
    display: 'block',
    width: '100%',
    maxWidth: '600px',
    margin: '0 auto 40px',
    padding: '20px',
    fontSize: '20px',
    fontWeight: '900',
    color: '#fff',
    background: 'linear-gradient(135deg, #ff6b6b, #ee5a6f)',
    border: 'none',
    borderRadius: '15px',
    cursor: 'pointer',
    transition: 'transform 0.2s ease',
    boxShadow: '0 10px 30px rgba(255, 107, 107, 0.4)',
  },
  addButtonText: {
    letterSpacing: '2px',
  },
  form: {
    maxWidth: '600px',
    margin: '0 auto 40px',
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    borderRadius: '20px',
    padding: '30px',
    border: '2px solid rgba(255, 255, 255, 0.2)',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    marginBottom: '20px',
  },
  inputGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    fontSize: '12px',
    fontWeight: '700',
    letterSpacing: '2px',
    marginBottom: '8px',
    color: '#feca57',
  },
  input: {
    width: '100%',
    padding: '15px',
    fontSize: '16px',
    background: 'rgba(0, 0, 0, 0.3)',
    border: '2px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '10px',
    color: '#fff',
    outline: 'none',
    boxSizing: 'border-box',
  },
  textarea: {
    minHeight: '80px',
    resize: 'vertical',
    fontFamily: 'inherit',
  },
  intensityGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '10px',
  },
  intensityButton: {
    padding: '15px 10px',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    color: '#fff',
    fontWeight: '700',
    fontSize: '12px',
  },
  intensityEmoji: {
    display: 'block',
    fontSize: '24px',
    marginBottom: '5px',
  },
  intensityLabel: {
    display: 'block',
    fontSize: '10px',
    letterSpacing: '1px',
  },
  formButtons: {
    display: 'flex',
    gap: '10px',
    marginTop: '25px',
  },
  submitButton: {
    flex: 1,
    padding: '18px',
    fontSize: '16px',
    fontWeight: '900',
    color: '#fff',
    background: 'linear-gradient(135deg, #48dbfb, #0abde3)',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    letterSpacing: '2px',
    transition: 'transform 0.2s ease',
  },
  cancelButton: {
    flex: 1,
    padding: '18px',
    fontSize: '14px',
    fontWeight: '700',
    color: '#fff',
    background: 'rgba(255, 255, 255, 0.1)',
    border: '2px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '12px',
    cursor: 'pointer',
    letterSpacing: '2px',
    transition: 'transform 0.2s ease',
  },
  workoutsList: {
    maxWidth: '800px',
    margin: '0 auto',
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px',
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '20px',
    border: '2px dashed rgba(255, 255, 255, 0.2)',
  },
  emptyIcon: {
    fontSize: '64px',
    marginBottom: '20px',
  },
  emptyText: {
    fontSize: '24px',
    fontWeight: '900',
    letterSpacing: '2px',
    marginBottom: '10px',
    color: '#feca57',
  },
  emptySubtext: {
    fontSize: '16px',
    color: '#aaa',
  },
  workoutCard: {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    borderRadius: '15px',
    padding: '20px',
    marginBottom: '15px',
    border: '2px solid rgba(255, 255, 255, 0.2)',
    transition: 'transform 0.2s ease',
  },
  workoutHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px',
  },
  workoutType: {
    fontSize: '22px',
    fontWeight: '900',
    color: '#fff',
  },
  deleteButton: {
    background: 'rgba(255, 107, 107, 0.3)',
    border: 'none',
    borderRadius: '8px',
    color: '#fff',
    fontSize: '24px',
    width: '35px',
    height: '35px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  workoutDetails: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    marginBottom: '10px',
  },
  workoutBadge: {
    padding: '8px 15px',
    background: 'rgba(0, 0, 0, 0.3)',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: '700',
    color: '#fff',
  },
  workoutNotes: {
    marginTop: '15px',
    padding: '15px',
    background: 'rgba(0, 0, 0, 0.2)',
    borderRadius: '10px',
    fontSize: '14px',
    color: '#ddd',
    fontStyle: 'italic',
  },
};
