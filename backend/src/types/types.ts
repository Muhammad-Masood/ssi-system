export type Certificate = {
  issuer_did: string;
  issuer_address: string;
  holder_did: string;
  holder_address: string;
  certificate: any;
};

export type User = {
  // id: number;
  // name: string;
  user_address: string;
  did: string;
  issued_certificates: string[];
  owned_certificates: string[];
};

export type Credentials = {
  address: string;
  access_token: string;
}

export type Wallet = {
  privateKey: string;
  address: string;
}