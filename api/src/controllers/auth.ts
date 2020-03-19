import { Request, Response } from 'express';
import { Auth } from '../services/Auth';
import { IEmployee } from '../models/employee';
import DB from './db';

export class AuthController {
  public auth: Auth = new Auth();
  public Authenticate = async (req: Request, res: Response) => {
    const { username, password } = req.body;
    const user = await DB.Models.Employee.findByCredentials(username, password);
    if (!user) {
      return res
        .status(401)
        .send({ error: 'Login failed! Check authentication credentials' });
    }
    const token = await user.generateAuthToken();
    user.password = '';
    res.send({ user, token });
  }

  public Authenticate1 = (req: Request, res: Response) => {
    const { username, password } = req.body;
    this.auth
      .authenticate(username, password)
      .then((user: IEmployee) => {
        if (user) {
          res.json(user);
        } else {
          throw new Error('Login failure!');
        }
      })
      .catch(err => {
        console.log(err);
        res.status(400).json({ message: 'Username or password is incorrect' });
      });
  };
}
