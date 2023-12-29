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

    // Get the number of visits per day
    const visitsPerDay = await VisitData.aggregate([
      {
        $group: {
          _id: "$date",
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    return {
      statusCode: 200,
      body: JSON.stringify(visitsPerDay),
    };
  } catch (error) {
    return { statusCode: 500, body: error.toString() };
  }
};