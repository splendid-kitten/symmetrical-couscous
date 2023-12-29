/* eslint-disable no-undef */
import mongoose from 'mongoose';

const VisitData = mongoose.model('VisitData', new mongoose.Schema({}, { strict: false }), process.env.MONGODB_COLLECTION_VISIT);

export const handler = async (context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    // Connect to our MongoDB database
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Get the average visit duration
    const avgDuration = await VisitData.aggregate([
      {
        $group: {
          _id: null,
          avgDuration: { $avg: "$duration" }
        }
      }
    ]);

    return {
      statusCode: 200,
      body: JSON.stringify(Math.round(avgDuration[0]?.avgDuration || 0)),
    };
  } catch (error) {
    return { statusCode: 500, body: error.toString() };
  }
};