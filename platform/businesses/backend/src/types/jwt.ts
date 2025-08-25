export interface DecodedToken {
  sub: string;
  email: string;
  username: string;
  [key: string]: any;
}
