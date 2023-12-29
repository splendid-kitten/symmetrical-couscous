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

    // Getting unique propulso_id per day
    const uniquePropulsoIdPerDay = await VisitData.aggregate([
      {
        $group: {
          _id: "$date",
          uniquePropulsoId: { $addToSet: "$propulso_id" }
        }
      },
      {
        $project: {
          _id: 1,
          count: { $size: "$uniquePropulsoId" }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);
    
    return {
      statusCode: 200,
      body: JSON.stringify(uniquePropulsoIdPerDay),
    };
  } catch (error) {
    return { statusCode: 500, body: error.toString() };
  }
};