'use strict'
const { createSignedUrl } = require('../server_utils/auth_utils')
const { Looker40SDK, Looker31SDK, NodeSession, NodeSettingsIniFile } = require('@looker/sdk')
const settings = new NodeSettingsIniFile()
const sdkSession = new NodeSession(settings)
const sdk = new Looker40SDK(sdkSession)
const rp = require('request-promise');
const { Storage } = require('@google-cloud/storage');
const projectId = process.env.CLOUD_PROJECT_ID
const keyFilename = './google-storage-auth.json';

//from here: https://cloud.google.com/storage/docs/samples/storage-generate-signed-url-v4
// Creates a client  
const storage = new Storage({ projectId, keyFilename });

module.exports.createCase = async (req, res, next) => {
  // console.log("createCase")
  let { session, body } = req;
  let options = {
    method: 'POST',
    uri: 'https://us-central1-pbl-demo-2020-281322.cloudfunctions.net/create_case',
    body: {
      "type": "cell",
      "scheduled_plan": null,
      "attachment": null,
      "data": {
        "value": body.applicationId,
        "rendered": body.applicationId,
        "application_id": body.applicationId,
        "security_key": session.cloudFunctionSecret,
        "email": session.userProfile.email
      },
      "form_params": {
        "reason_code": body.caseType
      }
    },
    json: true // Automatically stringifies the body to JSON
  };


  try {
    let postRsp = await rp(options)
    res.status(200).send({
      status: "success",
      message: "Case created!"
    })
  } catch (err) {
    // console.log({ err })
    let { message } = err
    // console.log({ message })
    res.status(400).send({
      status: "error",
      message: message
    })
  }
}

module.exports.addCaseNotes = async (req, res, next) => {
  // console.log("addCaseNotes")
  let { session, body } = req;

  let options = {
    method: 'POST',
    uri: 'https://us-central1-pbl-demo-2020-281322.cloudfunctions.net/add_case_notes',
    body: {
      "type": "cell",
      "scheduled_plan": null,
      "attachment": null,
      "data": {
        "value": body.caseId,
        "rendered": body.caseId,
        "case_id": body.caseId,
        "security_key": session.cloudFunctionSecret,
        "email": session.userProfile.email
      },
      "form_params": {
        "case_notes": body.caseNote
      }
    },
    json: true // Automatically stringifies the body to JSON
  };


  try {
    let postRsp = await rp(options)
    res.status(200).send({
      status: "success",
      message: "Case note added!"
    })
  } catch (err) {
    // console.log({ err })
    res.status(400).send({
      status: "error",
      message: err
    })
  }
}

module.exports.changeCaseStatus = async (req, res, next) => {
  // console.log("changeCaseStatus")

  let { session, body } = req;


  let options = {
    method: 'POST',
    uri: 'https://us-central1-pbl-demo-2020-281322.cloudfunctions.net/change_case_status',
    body: {
      "type": "cell",
      "scheduled_plan": null,
      "attachment": null,
      "data": {
        "value": body.caseId,
        "rendered": body.caseId,
        "case_id": body.caseId,
        "security_key": session.cloudFunctionSecret,
        "email": session.userProfile.email
      },
      "form_params": {
        "case_status": body.caseStatus
      }
    },
    json: true // Automatically stringifies the body to JSON
  };



  try {
    let postRsp = await rp(options)
    res.status(200).send({
      status: "success",
      message: "Case status changed!"
    })
  } catch (err) {
    res.status(400).send({
      status: "error",
      message: err
    })
  }
}


module.exports.generateV4ReadSignedUrl = async (req, res, next) => {
  const { body, body: { bucketName, fileName }, session } = req;

  // These options will allow temporary read access to the file
  const options = {
    version: 'v4',
    action: 'read',
    expires: Date.now() + 15 * 60 * 1000, // 15 minutes
  };

  // Get a v4 signed URL for reading the file
  const [url] = await storage
    .bucket(bucketName)
    .file(fileName)
    .getSignedUrl(options);
  res.status(200).send({
    status: "success",
    signedUrl: url
  })
}