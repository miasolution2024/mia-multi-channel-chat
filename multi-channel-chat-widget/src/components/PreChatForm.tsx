import React, { useState } from "react";
import { startNewChatAsync} from "../actions/auth";
import type { UserInfo } from "../model";

function PreChatForm({
  onStartChat,
}: {
  onStartChat: (userInfo: UserInfo) => void;
}) {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [whatsapp, setWhatsapp] = useState<string>("");

  const handleStartChat = async (data: UserInfo) => {
    console.log("User Info collected:", data);
    const response = await startNewChatAsync(data);

    console.log(response);

    const userInfo: UserInfo = {
      name: data.name,
      email: data.email,
      whatsapp: data.whatsapp,
      conversationId: response.data?.conversationId,
      token: response.data?.token,
    };
    onStartChat(userInfo);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name || !whatsapp) {
      alert("Please enter your Name and WhatsApp Number.");
      return;
    }
    handleStartChat({ name, email, whatsapp });
  };

  return (
    <form className="my-chat-pre-chat-form" onSubmit={handleSubmit}>
      <h2>
        Hello! 👋 Could you share your WhatsApp number? Our tailor can assist
        and confirm details.
      </h2>
      <div className="my-chat-form-group">
        <input
          type="text"
          id="name"
          placeholder="Your Name"
          value={name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setName(e.target.value)
          }
          required
        />
      </div>
      <div className="my-chat-form-group">
        <input
          type="email"
          id="email"
          placeholder="Email (Optional)"
          value={email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setEmail(e.target.value)
          }
        />
      </div>
      <div className="my-chat-form-group">
        <input
          type="tel"
          id="whatsapp"
          placeholder="WhatsApp Number"
          value={whatsapp}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setWhatsapp(e.target.value)
          }
          required
        />
      </div>
      <button type="submit" className="my-chat-start-button">
        Start Chat
      </button>
    </form>
  );
}

export default PreChatForm;
