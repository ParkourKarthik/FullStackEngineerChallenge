import config from '../config';
import jwt from 'jsonwebtoken';
import DB from '../controllers/db';
import { IEmployee } from '../models/employee';
import { CryptoUtil } from '../_helpers/crypto';

export class Auth {
  public crypto: CryptoUtil = new CryptoUtil();

  public generateToken = _id => {
    const token = jwt.sign({ _id }, process.env.JWT_KEY || config.secret);
    return token;
  };

  public authenticate = async (
    username: string,
    password: string
  ): Promise<any> => {
    return new Promise<IEmployee>((resolve, reject) => {
      DB.Models.Employee.findOne({ username })
        .exec()
        .then(employee => {
          console.log(employee, 'employee');
          if (employee) {
            this.crypto
              .validatePassword(password, employee.password)
              .then((res: boolean) => {
                if (res) {
                  const token = jwt.sign(
                    { sub: employee },
                    process.env.JWT_SECRET || config.secret
                  );
                  employee.password = '';
                  employee.tokens.push(token);
                  resolve(employee);
                } else {
                  resolve(null);
                }
              });
          } else {
            resolve(null);
          }
        });
    });
  };
}
