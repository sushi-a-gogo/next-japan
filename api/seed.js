import mongoose from "mongoose";

import dotenv from "dotenv";
import fs from "node:fs/promises";
import connectDB from "./config/db.js";
import coordinator from "./lib/coordinators.js";
import Event from "./models/Event.js";
import EventLocation from "./models/EventLocation.js";
import EventOpportunity from "./models/EventOpportunity.js";
import User from "./models/User.js";
import UserReward from "./models/UserReward.js";
import {
  EVENTS_JSON,
  LOCATIONS_JSON,
  OPPORTUNITIES_JSON,
  USERS_JSON,
  USERS_REWARDS_JSON,
} from "./utils/paths.js";

// Load environment variables
dotenv.config();

const seedEvents = async () => {
  const json = await fs.readFile(EVENTS_JSON, "utf-8");
  const events = JSON.parse(json);

  await connectDB().catch((err) =>
    console.error("MongoDB connection error:", err)
  );

  for (let i = 0; i < events.length; i++) {
    const mock = events[i];
    const event = new Event({
      ...mock,
    });
    const i1 = getRandomIntInclusive(0, 3);
    const i2 = getRandomIntInclusive(0, 3);

    event.eventCoordinators = [coordinator.list[i1], coordinator.list[i2]];
    await event.save();
    console.log("Seeded event " + event.eventTitle);
  }

  mongoose.connection.close();
};

const seedLocations = async () => {
  try {
    // Read JSON file
    const locationJson = await fs.readFile(LOCATIONS_JSON, "utf-8");
    const locations = JSON.parse(locationJson);

    // Connect to MongoDB
    await connectDB().catch((err) =>
      console.error("MongoDB connection error:", err)
    );

    // Object to store location names and their _ids
    const locationIds = {};

    // Seed locations and capture _ids
    for (let i = 0; i < locations.length; i++) {
      const location = new EventLocation({
        ...locations[i],
      });
      const savedLocation = await location.save();
      locationIds[savedLocation.locationName] = savedLocation._id.toString();
      console.log(
        `Seeded event location: ${savedLocation.locationName} with _id: ${savedLocation._id}`
      );
    }

    // Write locationIds to a JSON file for reference
    await fs.writeFile(
      "./location_ids.json",
      JSON.stringify(locationIds, null, 2)
    );
    console.log("Location IDs saved to location_ids.json");

    // Close connection
    mongoose.connection.close();
  } catch (err) {
    console.error("MongoDB connection or seeding error:", err);
  }
};

const seedLocationNotes = async () => {
  try {
    // Read the JSON file with location data
    const locationJson = await fs.readFile(LOCATIONS_JSON, "utf-8");
    const locations = JSON.parse(locationJson);

    // Connect to MongoDB
    await connectDB().catch((err) => {
      console.error("MongoDB connection error:", err);
      throw err;
    });

    // Loop through locations and update locationNotes
    for (const location of locations) {
      const { locationName, locationNotes } = location;

      // Find and update the document by locationName
      const updatedLocation = await EventLocation.findOneAndUpdate(
        { locationName }, // Match by locationName
        { $set: { locationNotes } }, // Update locationNotes
        { new: true, upsert: false } // Return updated document, don't create new if not found
      );

      if (updatedLocation) {
        console.log(`Updated locationNotes for ${locationName}`);
      } else {
        console.log(`No matching location found for ${locationName}`);
      }
    }

    console.log("Location notes seeding completed.");
  } catch (error) {
    console.error("Error seeding location notes:", error);
  } finally {
    // Close the MongoDB connection
    await mongoose.connection.close();
    console.log("MongoDB connection closed.");
  }
};

const seedOpportunities = async () => {
  const json = await fs.readFile(OPPORTUNITIES_JSON, "utf-8");
  const opportunities = JSON.parse(json);

  await connectDB().catch((err) =>
    console.error("MongoDB connection error:", err)
  );

  for (let i = 0; i < opportunities.length; i++) {
    const opportunity = new EventOpportunity({
      ...opportunities[i],
    });
    await opportunity.save();
    console.log("Seeded event opportunity " + i);
  }

  mongoose.connection.close();
};

const seedUsers = async () => {
  const json = await fs.readFile(USERS_JSON, "utf-8");
  const users = JSON.parse(json);

  await connectDB().catch((err) =>
    console.error("MongoDB connection error:", err)
  );

  for (let i = 0; i < users.length; i++) {
    const user = new User({
      ...users[i],
      imageId: users[i].image.id,
      cloudflareImageId: users[i].image.cloudflareImageId,
      imageWidth: users[i].image.width,
      imageHeight: users[i].image.height,
    });
    await user.save();
    console.log("Seeded user " + user.email);
  }

  mongoose.connection.close();
};

const seedRewards = async () => {
  const json = await fs.readFile(USERS_REWARDS_JSON, "utf-8");
  const rewards = JSON.parse(json);

  await connectDB().catch((err) =>
    console.error("MongoDB connection error:", err)
  );

  for (let i = 0; i < rewards.length; i++) {
    const reward = new UserReward({
      ...rewards[i],
      userId: "689622131d95f863f6fbd545",
    });
    await reward.save();
    console.log("Seeded user reward " + reward.description);
  }

  mongoose.connection.close();
};

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min); // Ensures min is an integer (rounds up)
  max = Math.floor(max); // Ensures max is an integer (rounds down)
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

seedRewards();
