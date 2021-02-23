const Discord = require('discord.js');
const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database. 
const admin = require('firebase-admin');
// admin.initializeApp(functions.config().firebase);
admin.initializeApp();

const db = admin.firestore();

// const gmailEmail = functions.config().gmail.email
// const gmailPassword = functions.config().gmail.password

const url = functions.config().project.url
const token = functions.config().discord.token
const client = new Discord.Client();

exports.createUser = functions.region("asia-northeast1").auth.user().onCreate(async(userRecord, context) => {
    const email = userRecord.email;
    const displayName = userRecord.displayName;
    const creationTime = userRecord.metadata.creationTime;
    const creationTime_jst = new Date(creationTime).toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' });
    console.log("user record: "+JSON.stringify(userRecord))
    console.log("context: "+JSON.stringify(context))
    console.log("creation time: "+creationTime_jst)
    console.log(email+","+displayName)

    const mailData = {
        to: email,
        message: {
          subject: "登録完了",
          text: "FuPicon へのアカウント登録が完了しました\n"+url+"\n\n"+creationTime_jst,
        },
    };
    await db.collection("mail").add(mailData);
})

exports.scheduledFunctionCrontab = functions.pubsub.schedule('* 23 * * *')
    .timeZone('Asia/Tokyo') // Users can choose timezone - default is America/Los_Angeles
    .onRun((context) => {
        console.log('This will be run every day at 01:** AM Eastern!');
        console.log(JSON.stringify(context))
        let users = []
        admin.database().ref(`/users/`).once('value').then((snapshot) => {
            const key = snapshot.key
            const val = snapshot.val()
            for(let v in val) {
                let user = { id: v, username: val[v].username, todo_list: val[v].todo_list }
                users.push(user)
            }
            // users = JSON.stringify(snapshot.val())
            console.log("users: "+users)
        })


        client.on('ready', () => {
            console.log(`Logged in as ${client.user.tag}!`);
            client.channels.fetch('442243535153004546')
            .then(channel => {
                console.log(channel.name)
            })
            .catch(console.error);
            for(let i=0; i<users.length; i++) {
                client.channels.cache.get('442243535153004546').send(users[i].id)
                client.channels.cache.get('442243535153004546').send(users[i].todo_list)
            }
            //   client.destroy()
        });
        client.login(token);

        return null;
});

exports.sendTodoList = functions.pubsub.schedule('* 2 * * *').timeZone('Asia/Tokyo').onRun((context) => {
    admin.database().ref(`/users/`).once('value').then((snapshot) => {
        const key = snapshot.key
        const val = snapshot.val()
        let users = []
        for(let v in val) {
            let user = { id: v, username: val[v].username, todo_list: val[v].todo_list, channel_id: val[v].discord_channel_id }
            users.push(user)
        }
        for(let i=0; i<user.length; i++) {
            console.log(users[i].channel_id)
        }
    })
})

exports.word = functions.database.ref('/search/{userId}/word').onWrite((change, context) => {
    const key = change.after.key
    const val = change.after.val()
    console.log("changed: "+key+","+val)
    // const word = change.after.val().toLowerCase();
    change.after.ref.parent.child(`/count/`).once('value').then((snapshot) => {
        console.log("count: "+snapshot.key+","+snapshot.val())
    })
    admin.database().ref(`/count/`).once('value').then((snapshot) => {
        console.log("admin count: "+snapshot.key+","+snapshot.val())
    })
  })
