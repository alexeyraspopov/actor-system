export default class ProcessTickExecutor {
  constructor(batchSize) {
    this.batchSize = parseInt(batchSize) || 4;
  }

  execute(queue) {
    return new Promise(resolveQueue => {
      process.nextTick(() => {
        let maxRoutines = this.batchSize;

        console.info(this.batchSize, queue.length);
        for (let i = 0; i < this.batchSize && queue.length > 0; i++) {
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
