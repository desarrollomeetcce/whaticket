import WhaticketApiToken from "../../models/WhaticketApiToken";

const ListQueuesService = async (): Promise<WhaticketApiToken[]> => {
  const tokensAPi = await WhaticketApiToken.findAll({ order: [["id", "ASC"]] });

  return tokensAPi;
};

export default ListQueuesService;
