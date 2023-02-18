// Import the Axios library for making HTTP requests
import axios from "axios";
// Import the Leap AI SDK
// Based on documentation from Leap AI
import { Leap } from "@leap-ai/sdk"

// Initialize the Leap AI SDK with the API key
const leap = new Leap("6bdf75a3-60c1-4ea2-8e26-025acaa03dfb");

// Use the Leap SDK to fine-tune an AI model for identifying boats in images
const { data: model, error1 } = await leap.fineTune.createModel({
  title: "Boats", // Title of the model
  subjectKeyword: "@boatimage", // Keyword used to identify the images of boats
});

// Get the ID of the newly created model
const modelId = model.id;

// Upload sample images to the model for training purposes
const { data, error2 } = await leap.fineTune.uploadImageSamples({
  modelId: modelId, // ID of the model
  images: [ // Upload images here with URIs
    "https://cloud-5bwficr8j-hack-club-bot.vercel.app/0d0001_0.jpg",
    "https://cloud-5bwficr8j-hack-club-bot.vercel.app/1d0002_0.jpg",
    "https://cloud-5bwficr8j-hack-club-bot.vercel.app/2d0003_0.jpg",
    "https://cloud-5bwficr8j-hack-club-bot.vercel.app/3d0010_0.jpg",
    "https://cloud-5bwficr8j-hack-club-bot.vercel.app/4d0013_1.jpg",
    "https://cloud-5bwficr8j-hack-club-bot.vercel.app/5d0015_0.jpg",
    "https://cloud-5bwficr8j-hack-club-bot.vercel.app/6d0005_1.jpg"
  ],
});

// Queue a training job for the model and get the new version ID
const { data: newVersion, error3 } = await leap.fineTune.queueTrainingJob({
  modelId: modelId // ID of the model to be trained
});
const newVersionId = newVersion.id;

// Check the status of the new version of the model
const { data: checkVersion, error4} = await leap.fineTune.getModelVersion({
  modelId: modelId, // ID of the model
  versionId: newVersionId, // ID of the new version
});
const status = checkVersion.status; // Get the status of the new version

// If the new version is completed, continue
if (status === "completed") {
  // Do something
}

// Use the fine-tuned model to generate a new boat image
const { data2, error5 } = await leap.generate.generateImage({
  prompt: "@boatimage", // Keyword used to identify the image
  modelId: modelId // ID of the model to be used
});
