import WhaticketApiToken from "../../models/WhaticketApiToken";
import ShowTokenService from "./ShowTokenService";

interface TokenApiData {

  message?: string;
  imagePath?:string;
}

const UpdateQueueService = async (
  tokenId: number | string,
  tokenApiData: TokenApiData
): Promise<WhaticketApiToken> => {

  const queue = await ShowTokenService(tokenId);

  await queue.update(tokenApiData);

  return queue;
};

export default UpdateQueueService;
