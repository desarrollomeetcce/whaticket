
import WhaticketApiToken from "../../models/WhaticketApiToken";


interface TokenData {
  wpid: number;
  message: string;
  token?: string;
}

const CreateTokenService = async (tokenData: TokenData): Promise<WhaticketApiToken> => {
 
  const tokenAPi = await WhaticketApiToken.create(tokenData);

  return tokenAPi;
};

export default CreateTokenService;
