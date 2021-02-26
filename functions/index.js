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

exports.scheduledFunctionCrontab = functions.pubsub.schedule('0 * * * *')
    .timeZone('Asia/Tokyo') // Users can choose timezone - default is America/Los_Angeles
    .onRun((context) => {
        console.log('This will be run every day at **:00!');
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


        return null;
});

exports.sendTodoList = functions.pubsub.schedule('0 12 * * *').timeZone('Asia/Tokyo').onRun((context) => {
    admin.database().ref(`/users/`).once('value').then((snapshot) => {
        const key = snapshot.key
        const val = snapshot.val()

        console.log("remake user object")
        let users = []
        for(let v in val) {
            let user = { id: v, username: val[v].username, todo_list: val[v].todo_list, channel_id: val[v].discord_channel_id }
            users.push(user)
        }

        console.log("send TODO")
        const client = new Discord.Client();
        client.on('ready', () => {
            console.log(`Logged in as ${client.user.tag}!`);

            for(let i=0; i<users.length; i++) {
                console.log(users[i].username+", "+users[i].channel_id)
                if(users[i].channel_id) {
                    // メッセージ作成＆送信
                    let msg = "**[定期通知]**\n"+users[i].username+" さん\n- 未完のタスク\n"
                    for(let v in users[i].todo_list) {
                        if(users[i].todo_list[v].state === 0)
                            msg += users[i].todo_list[v].text + "（" + users[i].todo_list[v].deadline + "）\n"
                    }
                    client.channels.cache.get(users[i].channel_id).send(msg)
                }
            }
        });
        client.login(token);
        
    })
})

exports.changeChannelId = functions.database.ref('/users/{userId}/discord_channel_id').onWrite(async(change, context) => {
    const key = change.after.key
    const val = change.after.val()
    const user_id = context.params.userId
    let username = ""
    await admin.database().ref(`/users/${user_id}/username`).once("value").then(async(snapshot) => {
        username = await snapshot.val();
    });
    console.log("user_id: "+user_id)
    console.log("username: "+username)
    console.log("discord_channel_id: "+val)

    const client = new Discord.Client();
    client.on('ready', () => {
        console.log(`Logged in as ${client.user.tag}!`);

        const channel = client.channels.cache.get(val)
        channel.send(`**[確認メッセージ]**\n${username} さん\nこちらのチャンネル「${channel.name}」にTODOを通知します`)
    });
    client.login(token);
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
