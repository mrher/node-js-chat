import Realm from "realm";

const MessagesSchema = {
    name: "Message",
    properties: {
        _id: "int",
        text: "string",
        status: "string?",
        owner_id: "string?",
    },
    primaryKey: "_id",
};

const realm = await Realm.open({
    path: "realm-files/myrealm",
    schema: [MessagesSchema],
});
const messages = realm.objects("Message");

messages.forEach((msg) => {
  console.log(`${msg._id}: ${msg.text}`)
})

function onMsgsChange(messages, changes) {
  // Update UI in response to deleted objects
  // changes.deletions.forEach((index) => {
  //   // Deleted objects cannot be accessed directly,
  //   // but we can update a UI list, etc. knowing the index.
  //   console.log(`A task was deleted at the ${index} index`);
  // });
  // Update UI in response to inserted objects
  if (changes?.insertions){
    changes.insertions.forEach((index) => {
      let insertedMessages = messages[index];
      console.log(
        //`${tasks[index]._id}: ${tasks[index].text}`
        `${insertedMessages._id}: ${insertedMessages.text}`
        //`insertedTasks: ${JSON.stringify(insertedTasks, null, 2)}`
      );
      // ...
    });
  }
  // Update UI in response to modified objects
  // `newModifications` contains object indexes from after they were modified
  // changes.newModifications.forEach((index) => {
  //   let modifiedTask = tasks[index];
  //   console.log(`modifiedTask: ${JSON.stringify(modifiedTask, null, 2)}`);
  //   // ...
  // });
}

try {
  messages.addListener(onMsgsChange);
} catch (error) {
  console.error(
    `An exception was thrown within the change listener: ${error}`
  );
}

process.stdin.on("data", text => {
  text = text.toString().replaceAll('\n', '')
  realm.write(() => {
    const _id = messages.length;
    realm.create("Message", { text, _id });
  });
})
