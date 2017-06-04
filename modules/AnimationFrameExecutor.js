export default class AnimationFrameExecutor {
  constructor(targetFPS = 60) {
    this.maxDeadline = Math.floor(1000 / targetFPS);
  }

  execute(queue) {
    return new Promise(resolveQueue => {
      requestAnimationFrame((timestamp) => {
        const deadline = new Deadline(this.maxDeadline, timestamp);

        while (deadline.timeRemaining() > 0 && queue.length > 0) {
          const task = queue.shift();
          task.run();
        }

        if (queue.length > 0) {
          return resolveQueue(this.execute(queue));
        }

        resolveQueue();
      });
    });
  }
}

class Deadline {
  constructor(max, start) {
    this.deadline = start + max;
  }

  timeRemaining() {
    return this.deadline - performance.now();
  }
}
