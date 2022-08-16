import { createServer } from "http";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { mergeTypeDefs, mergeResolvers } from "@graphql-tools/merge"
import { loadFilesSync } from '@graphql-tools/load-files';
import path from 'path';
import { connect } from 'mongoose';
import * as dotenv from 'dotenv';

dotenv.config();
const resolversFiles = loadFilesSync(path.join(__dirname, './schema/resolvers'));
const typeDefsFiles = loadFilesSync(path.join(__dirname, './schema/typeDefs'));
const resolvers = mergeResolvers(resolversFiles)
const typeDefs = mergeTypeDefs(typeDefsFiles)

const startServer = async () => {
    // await connect(`${process.env.DB_PRODUCTION_PORT}`)
        await connect(`${process.env.DB_DEV_PORT}`)
        .then(e => console.log('DB Connected'))
        .catch(er => console.log('DB Connection Error', er));
    const app = express()
    const httpServer = createServer(app)

    const apolloServer = new ApolloServer({
        typeDefs,
        resolvers,
        context: ({ req }) => ({ req })
    }) as any

    await apolloServer.start()

    apolloServer.applyMiddleware({
        app,
        path: '/api'
    })

    httpServer.listen({ port: process.env.PORT || 4000 }, () =>
    // httpServer.listen({ port: process.env.PORT_DEV || 4001 }, () =>
        console.log(`Server listening on localhost:${process.env.PORT + apolloServer.graphqlPath}`)
    )
}

startServer()
