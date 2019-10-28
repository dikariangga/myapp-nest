import { ApplicationContext } from './app.context';
import { configService } from './config/config.service';

async function bootstrap() {
  const app = await ApplicationContext();
  await app.listen(configService.getPort());
}

bootstrap();
