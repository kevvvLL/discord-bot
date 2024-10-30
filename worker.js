export default {
  async fetch(request, env) { // add 'env' as a parameter
    const countKey = "message_count";
    const currentCount = (await env.MESSAGE_COUNT.get(countKey)) || 0; // Access MESSAGE_COUNT from env
    return new Response(`Worker is running. 消息发送计数：${currentCount}`, { status: 200 });
  },

  async scheduled(event, env, ctx) {
    const countKey = "message_count";
    let currentCount = await env.MESSAGE_COUNT.get(countKey) || 0;

    const now = new Date();
    const currentTime = now.toLocaleString("zh-CN", { timeZone: "Asia/Shanghai" });
    const DISCORD_BOT_TOKEN = env.DISCORD_BOT_TOKEN;
    const DISCORD_CHANNEL_ID = env.DISCORD_CHANNEL_ID;

    const messageContent = {
      content: `⏰ 当前时间：${currentTime}`
    };

    await fetch(`https://discord.com/api/v10/channels/${DISCORD_CHANNEL_ID}/messages`, {
      method: "POST",
      headers: {
        "Authorization": `Bot ${DISCORD_BOT_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(messageContent)
    });

    await env.MESSAGE_COUNT.put(countKey, (parseInt(currentCount) + 1).toString());

    console.log(`消息已发送到 Discord：${currentTime}`);
    console.log(`消息发送计数：${parseInt(currentCount) + 1}`);
  }
};
