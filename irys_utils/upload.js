
import { Uploader } from "@irys/upload";
import { Aptos } from "@irys/upload-aptos";
import { configDotenv } from "dotenv";
import * as fs from "fs";
import * as path from "path";

configDotenv();

// use fs library to get all files in the epubs folder
function getAllFiles(dirPath, filesList = []) {
  const entries = fs.readdirSync(dirPath);
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry);
    const stats = fs.statSync(fullPath);
    if (stats.isDirectory()) {
      getAllFiles(fullPath, filesList);
    } else {
      filesList.push(fullPath);
    }
  }
  return filesList;
}

// initialise uploader in testnet 
const getIrysUploader = async () => {
  const rpcUrl = "testnet";
  return Uploader(Aptos)
    .withWallet(process.env.PRIVATE_KEY)
    .withRpc(rpcUrl)
    .devnet();
};

// upload all files in the epubs folder to the irys network
const uploadData = async () => {
  const irysUploader = await getIrysUploader();
  const epubsFolder = "epubs";
  const allFiles = getAllFiles(epubsFolder);
  let uploadedUrls = [];

  for (const file of allFiles) {
    const { size } = fs.statSync(file);
    const price = await irysUploader.getPrice(size);
    console.log(`Uploading ${file} (${size} bytes) costs ${irysUploader.utils.fromAtomic(price)}`);
    await irysUploader.fund(price);
    try {
      const response = await irysUploader.uploadFile(file);
      const url = `https://gateway.irys.xyz/${response.id}`;
      console.log(`File uploaded ==> ${url}`);
      uploadedUrls.push(url);
    } catch (e) {
      console.log("Error uploading file", e);
    }
  }

  return uploadedUrls;
};

uploadData()
  .then(urls => {
    console.log("Uploaded URLs:", urls);
  })
  .catch(err => {
    console.error(err);
  });