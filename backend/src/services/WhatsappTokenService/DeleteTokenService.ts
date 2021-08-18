import ShowTokenService from "./ShowTokenService";
import WhaticketApiToken from "../../models/WhaticketApiToken";

const DeleteTokenService = async (tokenid: number | string): Promise<void> => {
  const tokenApi = await ShowTokenService(tokenid);

  await tokenApi.destroy();
};

export default DeleteTokenService;
