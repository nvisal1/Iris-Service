import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as http from 'http';
import { 
  ServiceError,
  ServiceErrorReason 
} from '../errors';
import { enforceAuthenticatedAccess } from '../middleware/authentication-access';
import { Streams } from '../streams';
import { Users } from '../users';


export class Express {

    static app: express.Express;

    /**
     * Configures Express server
     */
    static build() {
      try {
        if (!Express.app) {
          const driver = new Express();
          driver.start();
        } else {
          throw new ServiceError(ServiceErrorReason.INTERNAL);
        }
      } catch (error) {
        console.error(error);
        throw new ServiceError(ServiceErrorReason.INTERNAL);
      }
    }

    start() {
      Express.app = express();
      this.attachConfigHandlers(Express.app);
      this.attachPublicRoutes(Express.app);
      this.attachPrivateRoutes(Express.app);
      this.startServer(Express.app);
    }

    attachConfigHandlers(app: express.Express) {
      app.use(
        bodyParser.urlencoded({
          extended: true,
        }),
      );

      app.use(bodyParser.json());

      app.use(
        cors({
          origin: true,
          credentials: true,
        }),
      );

      app.set('port', process.env.PORT);

      app.set('trust proxy', true);
    }

    attachPublicRoutes(app: express.Express) {
     // app.use(Streams.publicExpressRouter);
      // app.use(Users.publicExpressRouter);
    }

    attachPrivateRoutes(app: express.Express) {
      app.use(enforceAuthenticatedAccess);
      app.use((error: any, req: any, res: any, next: any) => {
        if (error.name === 'UnauthorizedError') {
          res.status(401).send('Invalid Access Token');
        }
      });
      // app.use(Streams.privateExpressRouter);
    }

    startServer(app: express.Express) {
      const server = http.createServer(app);
      server.listen(process.env.PORT, () =>
        console.log(`IRIS Service running on port: ${process.env.PORT}`),
      );
    }
  }
