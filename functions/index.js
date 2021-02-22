const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database. 
const admin = require('firebase-admin');
// admin.initializeApp(functions.config().firebase);
admin.initializeApp();

const db = admin.firestore();

// const gmailEmail = functions.config().gmail.email
// const gmailPassword = functions.config().gmail.password


exports.createUser = functions.auth.user().onCreate(async(userRecord, context) => {
    const email = userRecord.email;
    const displayName = userRecord.displayName;
    const creationTime = userRecord.metadata.creationTime;
    console.log("user record: "+JSON.stringify(userRecord))
    console.log("creation time: "+creationTime)
    console.log(email+","+displayName+","+context.authType)

    const mailData = {
        to: email,
        message: {
          subject: "登録完了",
          text: "FuPicon へのアカウント登録が完了しました\n"+creationTime,
        },
    };
    await db.collection("mail").add(mailData);
})

// exports.scheduledFunctionCrontab = functions.pubsub.schedule('* 1 * * *')
//   .timeZone('Asia/Tokyo') // Users can choose timezone - default is America/Los_Angeles
//   .onRun((context) => {
//   console.log('This will be run every day at 01:** AM Eastern!');
//   return null;
// });