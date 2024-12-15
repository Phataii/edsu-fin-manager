import httpServer from "./app";
import dataSource from "./datasource/data-source";
// import trackerDatasource from "./datasource/tracker.datasource";
import Logger from "./utils/logger";



const logger = new Logger("server");

async function bootstrap() {
  try {
    await dataSource.initialize();
    logger.log('datasource initialized', { name: 'bas' });
  } catch (err) {
    logger.error('unable to initialize datasource', { name: 'bas', reason: err.message });
  }

  const PORT = process.env.PORT || 5113;
  const server = httpServer.listen(PORT, () => {
    logger.log(`bas is running`, { PORT });
  });


  const exitHandler = () => server.close(() => {
    // for (const crons of Object.values(cronjobs)) {
    //   logger.log('cron job stopped', {})
    //   crons.stop()
    // }
    logger.log('server closed', { PORT });
    process.exit(0);
  });

  process.on('SIGTERM', exitHandler);
  process.on('SIGINT', exitHandler);
}

bootstrap();