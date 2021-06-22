declare namespace Express {
  export interface Request {
    user: { id: string; profile: string };
    info: { wpId: number;
      num: string;
      msg: string
    };
  }
}
