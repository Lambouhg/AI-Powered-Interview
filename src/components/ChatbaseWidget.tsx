

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";

const ChatbaseWidget = () => {
  const { user } = useUser();

  useEffect(() => {
    const loadChatbase = async () => {
      if (!user?.id) return;

      try {
        const res = await fetch("/api/chatbase-sign", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.id }),
        });

        const { hmac } = await res.json();

        if (document.getElementById("kUtvdrQXJiYjuYjDSJFmC")) return;

        const script = document.createElement("script");
        script.src = "https://www.chatbase.co/embed.min.js";
        script.id = "kUtvdrQXJiYjuYjDSJFmC";
        script.setAttribute("data-user-id", user.id);
        script.setAttribute("data-user-signature", hmac);
        script.setAttribute("data-domain", "www.chatbase.co");

        document.body.appendChild(script);
      } catch (error) {
        console.error("Lỗi r nè", error);
      }
    };

    loadChatbase();
  }, [user]);

  return null;
};

export default ChatbaseWidget;
