const { createApp, ref, onMounted } = Vue;

const App = {
  setup() {
    const view = ref("login");
    const user = ref(null);
    const channels = ref([]);
    const messages = ref([]);
    const currentChannel = ref(null);
    const text = ref("");

    const loginUser = async (u, p) => {
      const data = await api.login(u, p);
      if (data.success) {
        api.setToken(data.token);
        user.value = u;
        view.value = "channels";
        loadChannels();
      } else {
        alert("Login failed");
      }
    };

    const loadChannels = async () => {
      const data = await api.getChannels();
      if (data.success) channels.value = data.channels;
    };

    const openChannel = async (c) => {
      currentChannel.value = c;
      view.value = "chat";
      const data = await api.getMessages(c.id);
      if (data.success) messages.value = data.messages;
    };

    const send = async () => {
      const data = await api.sendMessage(currentChannel.value.id, text.value);
      if (data.success) messages.value.push(data.message);
      text.value = "";
    };

    return { view, user, channels, messages, currentChannel, text, loginUser, loadChannels, openChannel, send };
  },
  template: `
    <div v-if="view==='login'">
      <h2>Login</h2>
      <input v-model="username" placeholder="Username">
      <input v-model="password" type="password" placeholder="Password">
      <button @click="loginUser(username,password)">Login</button>
    </div>

    <div v-else-if="view==='channels'">
      <h2>Channels</h2>
      <ul>
        <li v-for="c in channels" :key="c.id">
          <a href="#" @click.prevent="openChannel(c)">{{c.name}}</a>
        </li>
      </ul>
    </div>

    <div v-else-if="view==='chat'">
      <h2>Chat: {{ currentChannel.name }}</h2>
      <div v-for="m in messages" :key="m.id">
        <b>{{m.from}}:</b> {{m.text}}
      </div>
      <input v-model="text" @keyup.enter="send" placeholder="Message...">
    </div>
  `
};

createApp(App).mount("#app");
