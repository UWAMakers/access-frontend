import feathers from '@feathersjs/feathers';
import socketio from '@feathersjs/socketio-client';
import auth from '@feathersjs/authentication-client';
import io from 'socket.io-client';
import { iff, discard } from 'feathers-hooks-common';
import feathersVuex from 'feathers-vuex';

const socket = io(process.env.VUE_APP_API_URL, { transports: ['websocket'] });
const transport = socketio(socket);

const feathersClient = feathers()
  .configure(transport)
  .configure(auth({ storage: window.localStorage }))
  .hooks({
    before: {
      all: [
        iff(
          (context) => ['create', 'update', 'patch'].includes(context.method),
          discard('__id', '__isTemp'),
        ),
      ],
      find: [
        async (ctx) => {
          if (ctx.arguments[0] && ctx.arguments[0].paginate !== false) return ctx;
          const { query } = ctx.arguments[0];
          const limit = query.$limit || 50;
          const { data, total } = await ctx.service.find({
            ...ctx.arguments[0],
            query: {
              ...query,
              $limit: limit,
            },
            paginate: true,
          });
          if (total <= limit) {
            // eslint-disable-next-line no-param-reassign
            ctx.result = data;
            return ctx;
          }
          const parts = [];
          for (let skip = limit; skip < total; skip += limit) parts.push(skip);
          const results = await Promise.all(parts.map(async (skip) => (await ctx.service.find({
            ...ctx.arguments[0],
            query: { ...ctx.params.query, $limit: limit, $skip: skip },
            paginate: true,
          })).data));
          // eslint-disable-next-line no-param-reassign
          ctx.result = results.reduce((a, result) => [...a, ...result], data);
          return ctx;
        },
      ],
    },
  });

export default feathersClient;

// Setting up feathers-vuex
const {
  makeServicePlugin, makeAuthPlugin, BaseModel, models, FeathersVuex,
} = feathersVuex(
  feathersClient,
  {
    serverAlias: 'api', // optional for working with multiple APIs (this is the default value)
    idField: '_id', // Must match the id field in your database table/collection
    whitelist: ['$regex', '$options'],
  },
);

export {
  makeAuthPlugin, makeServicePlugin, BaseModel, models, FeathersVuex, transport,
};
