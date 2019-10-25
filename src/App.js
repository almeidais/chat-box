import React, { Component } from 'react';
import './App.css';
import Messages from "./components/Messages";
import Input from "./components/Input";

function randomName() {
  const adjectives = [
    "saggy", "sparkly", "still", "misty", "silent", "empty", "dry", "dark",
    "summer", "spicy", "delicate", "quiet", "white", "cool", "spring", "winter",
    "falling", "twilight", "dawn", "crimson", "wispy", "weathered", "blue",
    "billowing", "broken", "cold", "damp", "patient", "frosty", "green", "long",
    "late", "lingering", "bold", "little", "morning", "muddy", "old", "red",
    "rough", "bitter", "small", "sparkling", "throbbing", "shy", "wandering",
    "withered", "wild", "black", "young", "holy", "solitary", "fragrant",
    "aged", "snowy", "proud", "floral", "restless", "divine", "polished",
    "ancient", "purple", "lively", "nameless"
  ];
  const nouns = [
    "whale", "dolphin", "tiger", "raccoon", "beluga", "axolotl", "sloth", "fox",
    "snail", "turtle", "wombat", "pig", "dodo", "bat", "dog", "cat",
    "monkey", "fish", "chicken", "leopard", "ostrich", "meerkat", "boar", "bear",
    "horse", "mouse", "lion", "chameleon", "lizard", "squid", "crab", "octopus",
    "dove", "peacock", "seagull", "quokka", "pelican", "crane", "elephant",
    "hyena", "sheep", "goat", "buffalo", "zebra", "okapi", "crow",
    "heron", "snake", "hippo", "gorilla", "giraffe", "deer", "rhinoceros",
    "alligator", "crocodile", "ant", "panther", "slug", "spider", "stingray", "porpoise", "manatee",
    "koala", "sealion"
  ];
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  return adjective + noun;
}

function randomColor() {
  return '#' + Math.floor(Math.random() * 0xFFFFFF).toString(16);
}

class App extends Component {
  state = {
    messages: [
      {
        text: "This is a test message!",
        member: {
          color: "blue",
          username: "bluemoon"
        }
      }
    ],
    member: {
      username: randomName(),
      color: randomColor()
    }
  }

  constructor() {
    super();
    this.drone = new window.Scaledrone("GjKQrO53UKlC0CYI", {
      data: this.state.member
    });
    this.drone.on('open', error => {
      if (error) {
        return console.error(error);
      }
      const member = {...this.state.member};
      member.id = this.drone.clientId;
      this.setState({member});
    });
    const room = this.drone.subscribe("observable-room");
    room.on('data', (data, member) => {
      const messages = this.state.messages;
      messages.push({member, text: data});
      this.setState({messages});
    });
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h1>My Chat App</h1>
        </div>
        <Messages
          messages={this.state.messages}
          currentMember={this.state.member}
        />
        <Input
          onSendMessage={this.onSendMessage}
        />
      </div>
    );
  }

  onSendMessage = (message) => {
    this.drone.publish({
      room: "observable-room",
      message
    });
  }

}

export default App;
