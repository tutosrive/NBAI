class ScoreCalculator {
  constructor() {
    this.score = 0;
  }

  recordHit() {
    this.score += 10;
  }

  recordMiss() {
    this.score -= 1;
  }

  recordNearMiss() {
    this.score -= 3;
  }

  getTotalScore() {
    return this.score;
  }
}

export default ScoreCalculator;
