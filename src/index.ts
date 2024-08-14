

import Express from "express";
import bodyParser from "body-parser";
// // import {MongoService} from "./MongoService";
import {Route} from "./Routes";
// import * as config from '../config/config.json';
// import cors from 'cors';
import Cors from "cors";
const app = Express()
//Port
const port = 3005;

app.use(Cors({credentials: true}));
app.use(bodyParser.json());

app.get('/events/accountId',Route.Get.QuerryAllByAddress);
app.get('/events/filerecords',Route.Get.QuerryAllByFile);

app.listen(port, () => console.log(`File System Deprov Query listening on port ${port}`));


