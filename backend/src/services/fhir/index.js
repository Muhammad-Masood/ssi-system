import { EthrDID } from "ethr-did";
import { ES256KSigner, hexToBytes } from "did-jwt";
import { ethers, uuidV4 } from "ethers";
import crypto from "crypto";
import dotenv from "dotenv";
import {
  bytesHexToString,
  contract,
  pinataIPFSGateway,
  provider,
  storeDataOnIPFS,
  stringToBytesHex,
} from "../../index.js";
import CryptoJS from "crypto-js";
import axios from "axios";
import {
  addDoc,
  collection,
  getDoc,
  getDocs,
  query,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../database/firebase.js";
import { Patient } from "../../types/schema.js";

dotenv.config();

/**
 * @param {Patient} patient
 * @returns {string}
 */
const create_patient_resource = async (patient) => {
  try {
    const patientDoc = await addDoc(collection(db, "fhir_patient"), patient);
    return patientDoc.id;
  } catch (error) {
    console.log("Error storing FHIR Patient resource", error);
  }
};

/**
 * @param {string} patient_id
 * @returns {Patient} patient
 */
const get_patient_resource = async (patient_id) => {};

export { create_patient_resource, get_patient_resource };
