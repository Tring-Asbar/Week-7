import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import typeDefs from "./src/Schema/typeDefs.js";
import resolvers from "./src/Resolvers/resolvers.js";
import  dotenv  from 'dotenv';

dotenv.config();

const server = new ApolloServer({ typeDefs, resolvers });

const { url } = await startStandaloneServer(server, {
    listen: { port:Number(process.env.PORT) },
});

console.log(`Server is running at: ${url}`);

