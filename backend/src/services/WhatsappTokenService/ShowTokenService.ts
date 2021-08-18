import AppError from "../../errors/AppError";
import WhaticketApiToken from "../../models/WhaticketApiToken";

const ShowTokenService = async (tokenId: number | string): Promise<WhaticketApiToken> => {
  console.log(tokenId);  
  const tokenApi = await WhaticketApiToken.findOne({
    where: { id: tokenId }
  });

  if (!tokenApi) {
    throw new AppError("ERR_TOKEN_NOT_FOUND");
  }

  return tokenApi;
};

export default ShowTokenService;
