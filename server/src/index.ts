import { ApolloServer, AuthenticationError } from 'apollo-server-express';
import cors from 'cors';
import DataLoader from 'dataloader';
import express from 'express';
import http from 'http';
import jwt, { Secret } from 'jsonwebtoken';
import morgan from 'morgan';

import loaders from './loaders';
import models, { connectDb} from './models';
import resolvers from './resolvers';
import schema from './schema';

import 'dotenv/config';
import { IUserModel } from './models/user';
import { cast } from './utils';
import { IMessageModel } from './models/message';

const app = express();

app.use(cors());

app.use(morgan('dev'));

const getMe = async (req: express.Request) => {
  const token: string = req.headers['x-token'] as string;
  const secret = process.env.SECRET as Secret;
  if (token) {
    try {
      return await jwt.verify(token, secret);
    } catch (e) {
      throw new AuthenticationError(
        'Your session expired. Sign in again.',
      );
    }
  }
};

const server = new ApolloServer({
  introspection: true,
  typeDefs: schema,
  resolvers,
  formatError: error => {
    // remove the internal sequelize error message
    // leave only the important validation error
    const message = error.message
      .replace('SequelizeValidationError: ', '')
      .replace('Validation error: ', '')

    return {
      ...error,
      message,
    };
  },
  context: async ({ req, connection }) => {
    if (connection) {
      return {
        models,
        loaders: {
          user: new DataLoader((keys: string []) =>
            loaders.user.batchUsers(keys, models),
          ),
        },
      };
    }

    if (req) {
      const me = await getMe(req);
      return {
        models,
        me,
        secret: process.env.SECRET,
        loaders: {
          user: new DataLoader((keys: string []) =>
            loaders.user.batchUsers(keys, models),
          ),
        },
      };
    }
  },
});

server.applyMiddleware({ app, path: '/graphql' });

const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);

const isTest = !!process.env.TEST_DATABASE_URL;
const isProduction = process.env.NODE_ENV === 'production';
const port = process.env.PORT || 8000;

connectDb().then(async () => {
  const UserModel: IUserModel = cast(models.User);
  const MessageModel: IMessageModel = cast(models.Message);
  // reset database
  // await Promise.all([
  //   UserModel.deleteMany({}),
  //   MessageModel.deleteMany({}),
  // ]);

  // createUsersWithMessages(new Date());

  httpServer.listen({ port }, () => {
    console.log(`Apollo Server on http://localhost:${port}/graphql`);
  });
});
