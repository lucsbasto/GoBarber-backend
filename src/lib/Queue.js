import Bee from 'bee-queue';
import CancellationMail from '../app/jobs/CancellationMail';
import redisConfig from '../config/redis';

// coloca todos os jobs na fila
const jobs = [CancellationMail];

class BeeQueue {
  constructor() {
    this.queues = {};
    this.init();
  }

  // inicia o job
  init() {
    jobs.forEach(({ key, handle }) => {
      this.queues[key] = {
        // key do job e a configuração do redis
        bee: new Bee(key, { redis: redisConfig }),
        // metodo que envia faz o processo em cada job (enviar email etc)
        handle,
      };
    });
  }

  // adiciona o job na fila de envio de email
  add(queue, job) {
    return this.queues[queue].bee.createJob(job).save();
  }

  // processa o job em si
  processQueue() {
    jobs.forEach(job => {
      const { bee, handle } = this.queues[job.key];
      bee.process(handle);
    });
  }
}

export default new BeeQueue();
