/* eslint-disable no-undef */
import mongoose from 'mongoose';

const VisitData = mongoose.model('VisitData', new mongoose.Schema({}, { strict: false }), process.env.MONGODB_COLLECTION_VISIT);

export const handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    // Connect to our MongoDB database
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Fetch the geolocData collection
    const count = await VisitData.countDocuments();

    return {
      statusCode: 200,
      body: JSON.stringify(count),
    };
  } catch (error) {
    return { statusCode: 500, body: error.toString() };
  }
};