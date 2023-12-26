const { MongoClient } = require("mongodb");

const mongoClient = new MongoClient(process.env.MONGODB_URI);

const clientPromise = mongoClient.connect();

export const handler = async () => {
    try {
        const database = (await clientPromise).db(process.env.MONGODB_DATABASE);
        const geoloc_collection = database.collection(process.env.MONGODB_COLLECTION_GEOLOC);
        const visit_collection = database.collection(process.env.MONGODB_COLLECTION_VISIT);

        const geoloc_data = await geoloc_collection.aggregate([
            {
              $group: {
                _id: "$propulso_id",
                events: {
                  $push: {
                    _id: "$_id",
                    lat: "$lat",
                    lng: "$lng",
                    delta_time: "$delta_time",
                    date: "$date",
                    time: "$time"
                  }
                }
              }
            }
          ]).toArray();
          
        const visit_data = await visit_collection.find().toArray();
        



        
        let person = 0;




        geoloc_data.forEach(item => {
            const propulsoId = item.propulso_id;
            person = person + 1;
          });
        


        return {
            statusCode: 200,
            body: JSON.stringify(person),
        }
    } catch (error) {
        return { statusCode: 500, body: error.toString() }
    }
  }