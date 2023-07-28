import { Agenda } from "@hokify/agenda";

const mongoConnectionString =
  "mongodb+srv://doadmin:42grXYi78ob5t163@db-mongodb-nyc1-28695-b503c2cb.mongo.ondigitalocean.com/admin?tls=true&authSource=admin";

const agenda = new Agenda({ db: { address: mongoConnectionString } });

export default agenda;
