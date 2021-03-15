const Discord = require('discord.js');
const line = require('@line/bot-sdk');
const express = require('express');
const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database. 
const admin = require('firebase-admin');
// admin.initializeApp(functions.config().firebase);
admin.initializeApp();

const db = admin.firestore();


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

exports.scheduledFunctionCrontab = functions.pubsub.schedule('0 7 * * *')
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

exports.pushTodoDiscord = functions.pubsub.schedule('0 12 * * *').timeZone('Asia/Tokyo').onRun((context) => {
    admin.database().ref(`/users/`).once('value').then((snapshot) => {
        const key = snapshot.key
        const val = snapshot.val()

        let users = []
        for(let v in val) {
            let user = { id: v, username: val[v].username, todo_list: val[v].todo_list, channel_id: val[v].discord_channel_id }
            users.push(user)
        }

        console.log("push TODO on Discord")
        const client = new Discord.Client();
        client.on('ready', async() => {
            console.log(`Logged in as ${client.user.tag}!`);

            for(let i=0; i<users.length; i++) {
                let username = users[i].username;
                let channel_id = users[i].channel_id;
                console.log(username+", "+channel_id);
                if(channel_id) {
                    // メッセージ作成＆送信
                    let msg = "";
                    let channel = client.channels.cache.get(channel_id);
                    let owner_id = channel.guild.ownerID;
                    await client.users.fetch(owner_id).then(user => {
                        console.log(user.tag);
                        msg += `<@${owner_id}>\n`;
                    });
                    msg += `**[定期通知]**\n${username} さん\n\n未完了のタスク\n`;
                    let todo_list = users[i].todo_list;
                    for(let v in todo_list) {
                        if(todo_list[v].state === 0)
                            msg += `・${todo_list[v].text} （${todo_list[v].deadline}）\n`;
                    }
                    msg += url;
                    client.channels.cache.get(channel_id).send(msg);
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
    client.on('ready', async() => {
        console.log(`Logged in as ${client.user.tag}!`);

        let msg = "";
        const channel = client.channels.cache.get(val);
        const owner_id = channel.guild.ownerID;
        await client.users.fetch(owner_id).then(user => {
            console.log(user.tag);
            msg += "<@" + owner_id + ">\n";
        });
        msg += `**[確認メッセージ]**\n${username} さん\nこちらのチャンネル「${channel.name}」にTODOを通知します\n`;
        msg += url;
        channel.send(msg);
    });
    client.login(token);
})


const lineConfig = {
    channelSecret: functions.config().line.secret,
    channelAccessToken: functions.config().line.token,
};
const lineApp = express();

lineApp.post('/webhook', line.middleware(lineConfig), (req, res) => {
    const events = req.body.events[0];
    console.log(events);
    console.log(events.type);
    // Promise
    // .all(events.map(handleEvent))
    // .then((result) => {
    //     // console.log(res.json(result));

    //     const message = {
    //         type: 'text',
    //         text: '**[確認メッセージ]**\nこちらにTODOを通知します\n'+url
    //     };
    //     client.pushMessage('U20054db1cea797aec77ad94e192870e9', message)
    //     .then(() => {
    //         console.log("push success");
    //     })
    //     .catch((err) => {
    //         console.log("push failed");
    //     });
    // });
    if(events.type === "follow") {
        const client = new line.Client(lineConfig);
        const message = {
            type: 'text',
            text: `[重要]\nユーザ ID を設定してください\nユーザ ID：${events.source.userId}\n${url}`
        };
        client.pushMessage(events.source.userId, message)
        .then(() => {
            console.log("push success");
        })
        .catch((err) => {
            console.log("push failed: "+err);
        });
    }
});

async function handleEvent(event) {
    console.log("Line userId: "+event.source.userId);
    const client = new line.Client(lineConfig);

    if (event.type !== 'message' || event.message.type !== 'text') {
        return Promise.resolve(null);
    }

    return client.replyMessage(event.replyToken, {
        type: 'text',
        text: event.message.text //実際に返信の言葉を入れる箇所
    });
}

exports.lineApp = functions.https.onRequest(lineApp);

exports.changeUserId = functions.database.ref('/users/{userId}/line_user_id').onWrite(async(change, context) => {
    const key = change.after.key;
    const lineUserId = change.after.val();
    const user_id = context.params.userId;
    let username = "";
    await admin.database().ref(`/users/${user_id}/username`).once("value").then(async(snapshot) => {
        username = await snapshot.val();
    });
    console.log("user_id: "+user_id);
    console.log("username: "+username);
    console.log("line_user_id: "+lineUserId);

    const client = new line.Client(lineConfig);
    const message = {
        type: 'text',
        text: `[確認メッセージ]\n${username} さん\nユーザ ID を設定しました\n以降毎日12時に TODO を通知します`
    };
    client.pushMessage(lineUserId, message)
    .then(() => {
        console.log("push success");
    })
    .catch((err) => {
        console.log("push failed: "+err);
    });
})

exports.pushTodoLine = functions.pubsub.schedule('0 12 * * *').timeZone('Asia/Tokyo').onRun((context) => {
    admin.database().ref(`/users/`).once('value').then((snapshot) => {
        const key = snapshot.key;
        const val = snapshot.val();

        let users = [];
        for(let v in val) {
            let user = { id: v, username: val[v].username, todo_list: val[v].todo_list, line_user_id: val[v].line_user_id };
            users.push(user);
        }

        console.log("push TODO on LINE");
        const client = new line.Client(lineConfig);

        for(let i=0; i<users.length; i++) {
            let username = users[i].username;
            let lineUserId = users[i].line_user_id;
            console.log(username+", "+lineUserId);
            if(lineUserId) {
                // メッセージ作成＆送信        
                let msg = `[定期通知]\n${username} さん\n\n未完了のタスク\n`;
                let todo_list = users[i].todo_list;
                for(let v in todo_list) {
                    if(todo_list[v].state === 0)
                        msg += `・${todo_list[v].text} （${todo_list[v].deadline}）\n`;
                }
                msg += url;
                const message = {
                    type: 'text',
                    text: msg
                };
                client.pushMessage(lineUserId, message)
                .then(() => {
                    console.log("push success");
                })
                .catch((err) => {
                    console.log("push failed: "+err);
                });
            }
        }
        
    })
});

