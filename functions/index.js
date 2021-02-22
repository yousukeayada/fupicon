const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database. 
const admin = require('firebase-admin');
// admin.initializeApp(functions.config().firebase);
admin.initializeApp();

const db = admin.firestore();

// const gmailEmail = functions.config().gmail.email
// const gmailPassword = functions.config().gmail.password

const url = functions.config().project.url

exports.createUser = functions.region("asia-northeast1").auth.user().onCreate(async(userRecord, context) => {
    const email = userRecord.email;
    const displayName = userRecord.displayName;
    const creationTime = userRecord.metadata.creationTime;
    const creationTime_jst = new Date(creationTime).toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' });
    console.log("user record: "+JSON.stringify(userRecord))
    console.log("creation time: "+creationTime_jst)
    console.log(email+","+displayName+","+context.authType)

    const mailData = {
        to: email,
        message: {
          subject: "登録完了",
          text: "FuPicon へのアカウント登録が完了しました\n"+url+"\n\n"+creationTime_jst,
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

exports.word = functions.database.ref('/search/{userId}/word').onWrite((change, context) => {
    const key = change.after.key
    const val = change.after.val()
    console.log("changed: "+key+","+val)
    // const word = change.after.val().toLowerCase();
    const counter = change.after.ref.parent.child(`/count/`).once('value').then((snapshot) => {
      if (snapshot.val() === null) {
        return counter.set(1)
      } else {
        return counter.set(snapshot.val() + 1)
      }
    })
    console.log("counter: "+counter)
  })
