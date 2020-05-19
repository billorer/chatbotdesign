(() => {
  const chatbot = io.connect('http://35.157.80.184:8080/');

  const chatform = document.getElementById('chatform');
  const chatlist = document.getElementById('chatlist');

  let clientname = '';

  chatbot.on('message', (msg) => {
    const messageContainer = document.createElement('li');
    const messageInnerContainer = document.createElement('div');

    const message = document.createElement('p');
    const botUserName = document.createElement('p');
    const userTimeStamp = document.createElement('p');

    messageContainer.classList.add('message__container');

    message.classList.add('message');
    botUserName.classList.add('bot-username');
    userTimeStamp.classList.add('user-timestamp');

    // CLIENT
    if (msg.user === clientname) {
      messageInnerContainer.classList.add('message__innercontainer');

      messageContainer.classList.add('message__container--currentuser');
      message.classList.add('message__currentuser');

      // Append bot username and timestamp
      userTimeStamp.textContent = getMsgTimeStamp();
      messageInnerContainer.append(userTimeStamp);
      // BOT
    } else {
      messageInnerContainer.classList.add('message__innercontainer');
      message.classList.add('message__bot');

      // Append bot username and timestamp
      botUserName.textContent = `${msg.user}, ${getMsgTimeStamp()}`;
      messageInnerContainer.append(botUserName);
    }

    // Append message
    message.textContent = msg.message;

    messageInnerContainer.append(message);
    messageContainer.append(messageInnerContainer);
    chatlist.append(messageContainer);

    scrollToBottom();
  });

  // Scroll to bottom
  const scrollToBottom = () => {
    const chatcontainer = document.querySelector('.chat__container');
    chatcontainer.scrollTo(0, chatcontainer.scrollHeight);
  };

  const getMsgTimeStamp = () => {
    const currentDate = new Date();
    const hour = currentDate.getHours();
    const minutes = currentDate.getMinutes();
    return `${hour < 10 ? '0' + hour : hour}:${
      minutes < 10 ? '0' + minutes : minutes
    }`;
  };

  // FORM SUBMIT
  chatform.addEventListener('submit', (e) => {
    e.preventDefault();
    const clientmessage = document.getElementById('clientmessage').value;
    clientname = document.getElementById('clientname').value;
    if (clientname && clientmessage) {
      chatbot.emit('message', {
        message: clientmessage,
        user: clientname,
      });
    }
    document.getElementById('clientmessage').value = '';
  });

  // Uppon DOWN arrow click, we scroll to the bottom
  document.querySelector('.arrow__container').addEventListener('click', (e) => {
    e.preventDefault();
    scrollToBottom();
  });

  // SCROLL EVENT
  const chatcontainer = document.querySelector('.chat__container');
  chatcontainer.addEventListener('scroll', (e) => {
    const arrow = document.querySelector('.arrow__container');
    if (
      chatcontainer.scrollTop /
        (chatcontainer.scrollHeight - chatcontainer.clientHeight) !==
      1
    ) {
      arrow.classList.add('display');
    } else {
      arrow.classList.remove('display');
    }
  });

  // EMOJIS
  const setEmojiAvatar = (emo) => {
    document.querySelector('.avatar').value = emo;
    document.querySelector('.avatar').innerHTML = `&#x${emo}`;

    document.querySelector('.avatar-code').value = emo;
    document.querySelector(
      '.avatar-code'
    ).innerHTML = `${'Code:'.bold()} ${emo}`;
  };

  // Creates emojis from code to code
  const createEmojiFromTo = (from, to) => {
    const emojis = [];
    for (let i = from; i < to; i++) {
      emojis.push(`1f${i}`);
    }
    return emojis;
  };

  // Create 40 emoji
  const emojis = createEmojiFromTo(600, 640);
  const emojicontainer = document.querySelector('.icons__container');

  // Add emojis to the icon container
  emojis.forEach((emoji) => {
    const emojiSpan = document.createElement('div');
    emojiSpan.classList.add('emoji');
    emojiSpan.value = emoji;
    emojiSpan.innerHTML = `&#x${emoji}`;
    document.querySelector('.icons').append(emojiSpan);
  });

  // Initialize Emoji Avatar with the first emoji
  setEmojiAvatar('1f600');

  const emojiToggle = document.querySelector('.show-icon');
  emojiToggle.addEventListener('click', (e) => {
    e.preventDefault();
    if (emojicontainer.classList.contains('icons__container--display')) {
      emojicontainer.classList.remove('icons__container--display');
    } else {
      emojicontainer.classList.add('icons__container--display');
    }
  });

  // Check if outside click happened and close the icon container
  document.addEventListener('click', (e) => {
    const isClickInside = emojiToggle.contains(e.target);
    const isClickInside2 = document.querySelector('.icons').contains(e.target);

    if (!isClickInside && !isClickInside2) {
      emojicontainer.classList.remove('icons__container--display');
    }
  });

  // Add events event to emojis
  document.querySelectorAll('.emoji').forEach((emoji) => {
    // Clicked they appear in textarea
    emoji.addEventListener('click', (e) => {
      e.preventDefault();
      const emo = e.target.value;
      document.getElementById('clientmessage').value += String.fromCodePoint(
        `0x${emo}`
      );
    });

    // Hover
    emoji.addEventListener('mouseover', (e) => {
      e.preventDefault();
      setEmojiAvatar(e.target.value);
    });
  });
})();
