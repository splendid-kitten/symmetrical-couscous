import mongoose from 'mongoose';

const GeolocData = mongoose.model('GeolocData', new mongoose.Schema({}, { strict: false }), process.env.MONGODB_COLLECTION_GEOLOC);

export const handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    // Connect to our MongoDB database
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Fetch the geolocData collection
    const data = await GeolocData.find().limit(10);

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    return { statusCode: 500, body: error.toString() };
  }
};