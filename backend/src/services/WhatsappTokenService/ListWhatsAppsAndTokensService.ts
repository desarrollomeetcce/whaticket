import WhaticketApiToken from "../../models/WhaticketApiToken";
import Whatsapp from "../../models/Whatsapp";

const ListWhatsAppsAndTokensService = async (): Promise<Whatsapp[]> => {
  const whatsapps = await Whatsapp.findAll({
    include: [
      {
        model: WhaticketApiToken,
       
        attributes: ["id", "wpid", "message","imagePath", "token"]
      }
    ]
  });

  return whatsapps;
};

export default ListWhatsAppsAndTokensService;
