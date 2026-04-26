import type { ReplyChannel } from "@/lib/language/phraseTypes";

export function mapUiChannelToReplyChannel(channel: string): ReplyChannel {
  if (channel === "SMS") return "sms";
  if (channel === "E-mail") return "email";
  if (channel === "Slack") return "slack";
  return "whatsapp";
}
