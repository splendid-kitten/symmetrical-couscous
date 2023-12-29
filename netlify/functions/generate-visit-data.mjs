/* eslint-disable no-undef */
import mongoose from 'mongoose';

const GeolocData = mongoose.model('GeolocData', new mongoose.Schema({}, { strict: false }), process.env.MONGODB_COLLECTION_GEOLOC);

const VisitData = mongoose.model('VisitData', new mongoose.Schema({}, { strict: false }), process.env.MONGODB_COLLECTION_VISIT);

export const handler = async (context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    // Connect to our MongoDB database
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const geolocData = await GeolocData.find().sort({ date: 1, time: 1 }); // Sort by date and time

    // Temp visits array
    const currentVisits = {};

    // Visits to be saved to the VisitData collection
    const visits = [];

    for (const data of geolocData) {
        // if 
        if (data.delta_time === 0 || (currentVisits[data.propulso_id] && currentVisits[data.propulso_id].propulso_id !== data.propulso_id)) {
            // Start of a new visit
            if (!currentVisits[data.propulso_id]) {
                currentVisits[data.propulso_id] = {
                    propulso_id: data.propulso_id,
                    lat: data.lat,
                    lng: data.lng,
                    start_time: data.time,
                    date: data.date,
                    ping_count: 1,
                };
            } else { 
                // Update the existing visit
                currentVisits[data.propulso_id].lat += data.lat;
                currentVisits[data.propulso_id].lng += data.lng;
                currentVisits[data.propulso_id].ping_count += 1;
            } 
        } else if (currentVisits[data.propulso_id]) {
            // End the current visit if the delta_time is not 0 and the visit exists in the temp array
            const currentVisit = currentVisits[data.propulso_id];
            currentVisit.end_time = data.time;

            // Calculate the duration of the visit in seconds by converting the string to a Date object

            const startTime = new Date(`${currentVisit.date}T${currentVisit.start_time}Z`);
            const endTime = new Date(`${data.date}T${data.time}Z`);

            currentVisit.duration = (endTime - startTime) / 1000;

            currentVisit.lat /= currentVisit.ping_count;
            currentVisit.lng /= currentVisit.ping_count;
            visits.push(currentVisit);

            // Remove the visit from currentVisits
            delete currentVisits[data.propulso_id];
        }
    }

    // If there's an ongoing visit at the end of the array, end it
    for (const propulso_id in currentVisits) {
        const currentVisit = currentVisits[propulso_id];
        currentVisit.end_time = geolocData[geolocData.length - 1].time; // Existing visit's end time is the last time in the array

        // Calculate the duration of the visit in seconds by converting thestring to a Date object
        const startTime = new Date(`${currentVisit.date}T${currentVisit.start_time}Z`);
        const endTime = new Date(`${geolocData[geolocData.length - 1].date}T${currentVisit.end_time}Z`);
        currentVisit.duration = (endTime - startTime) / 1000;

        currentVisit.lat /= currentVisit.ping_count;
        currentVisit.lng /= currentVisit.ping_count;
        visits.push(currentVisit);
    }

    // Save the visits to the VisitData collection
    await VisitData.insertMany(visits);
    
    return {
      statusCode: 200,
      body: JSON.stringify('success'),
    };
  } catch (error) {
    return { statusCode: 500, body: error.toString() };
  }
};