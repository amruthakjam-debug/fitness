import confetti from 'canvas-confetti';

export function fireGoalCelebration() {
  try {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#10b981', '#06b6d4', '#f59e0b', '#3b82f6', '#ec4899'],
    });
  } catch {
    // Graceful fallback if window or canvas not available
  }
}

export function fireAchievementCelebration() {
  try {
    const end = Date.now() + 1.2 * 1000;
    const colors = ['#10b981', '#fbbf24', '#60a5fa'];

    (function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors,
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  } catch {
    // Graceful fallback
  }
}
