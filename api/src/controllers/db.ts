import { connect, connection, Connection, Types } from 'mongoose';
import config from '../config';
import { IEmployeeModel, Employee } from '../models/employee';
import { MongoMemoryServer } from 'mongodb-memory-server';

declare interface IModels {
  Employee: IEmployeeModel;
}

export default class DB {
  private static instance: DB;
  private mongod: MongoMemoryServer = new MongoMemoryServer();
  private uri: Promise<string> = this.mongod.getUri();
  /* new Promise((res, rej) => {
    res(
      'mongodb+srv://geckot_user:resu_tokceg321@cluster0-4oteq.gcp.mongodb.net/test?retryWrites=true&w=majority'
    );
  }); */
  private mongoUrl: string;

  private _db: Connection;
  private _models: IModels;

  private constructor() {
    this.uri.then(
      url => {
        connect(url, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
          useFindAndModify: false
        })
          .then(val => {
            if (val) this.connected();
          })
          .catch(err => this.error(err));
      },
      err => this.error(err)
    );
    this._db = connection;
    // this._db.on('open', this.connected);
    // this._db.on('error', this.error);

    this._models = {
      Employee: new Employee().model
    };
  }

  public static get Models() {
    if (!DB.instance) {
      DB.instance = new DB();
    }
    return DB.instance._models;
  }

  private connected() {
    console.log('Mongoose has connected');
  }

  private error(error) {
    console.log('Mongoose has error', error);
  }
}