import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


class ConsoleMessagesRuntimeStandardTest(unittest.TestCase):
    def test_console_messages_ui_is_read_only_until_command_contract_exists(self) -> None:
        messages_view = (
            ROOT
            / "apps"
            / "sdkwork-claw-router-portal"
            / "packages"
            / "sdkwork-claw-router-console-messages"
            / "src"
            / "MessagesView.tsx"
        ).read_text(encoding="utf-8")
        messages_service = (
            ROOT
            / "apps"
            / "sdkwork-claw-router-portal"
            / "packages"
            / "sdkwork-claw-router-console-messages"
            / "src"
            / "messagesService.ts"
        ).read_text(encoding="utf-8")
        contract = (
            ROOT / "docs" / "schema-registry" / "frontend-field-contracts.yaml"
        ).read_text(encoding="utf-8")
        message_operation_marker = (
            "  - route: /console/messages\n"
            "    source: apps/sdkwork-claw-router-portal/packages/"
            "sdkwork-claw-router-console-messages/src/messagesService.ts\n"
            "    operation: fetchMessages"
        )
        message_operation_start = contract.index(message_operation_marker)
        next_operation_start = contract.index("\n  - route:", message_operation_start + 1)
        message_operation_contract = contract[message_operation_start:next_operation_start]

        self.assertIn("MessagesService.fetchMessages()", messages_view)
        self.assertIn("readOnlyMessageActions", messages_view)
        self.assertIn("Read-only", messages_view)
        self.assertIn("BusinessStatePanel", messages_view)
        self.assertNotIn("handleMarkAllRead", messages_view)
        self.assertNotIn("handleToggleRead", messages_view)
        self.assertNotIn("handleDelete", messages_view)
        self.assertNotIn("Auto mark as read", messages_view)
        self.assertNotIn("setMessages(msgs => msgs.map", messages_view)
        self.assertNotIn("setMessages(msgs => msgs.filter", messages_view)
        for icon in ["<Trash2", "<Check className"]:
            self.assertNotIn(icon, messages_view)
        self.assertNotIn("PDF", messages_view)

        self.assertNotIn("static async markMessageRead", messages_service)
        self.assertNotIn("static async markAllMessagesRead", messages_service)
        self.assertNotIn("static async deleteMessage", messages_service)
        self.assertIn("operation: fetchMessages", message_operation_contract)
        self.assertNotIn("operation: markMessageRead", message_operation_contract)
        self.assertNotIn("operation: markAllMessagesRead", message_operation_contract)
        self.assertNotIn("operation: deleteMessage", message_operation_contract)


if __name__ == "__main__":
    unittest.main()
