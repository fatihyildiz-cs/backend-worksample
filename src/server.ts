import makeApp from "./app"
import connectDB from "./app/database"
import setupSwagger from '../swagger';
// I chose to decouple the app from the server so that we can test the app without initializing the server.
const port = process.env.PORT || '3000'
const app = makeApp(connectDB, setupSwagger)
app.listen(port)