import type { Meta, StoryObj } from "@storybook/react-vite";

import { UserNameInput } from "./UserNameInput";

const meta = {
  title: "Shared/UserNameInput",
  component: UserNameInput,
  tags: ["autodocs"],
  argTypes: {
    disabled: { control: "boolean" },
  },
} satisfies Meta<typeof UserNameInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: "사용자명",
  },
};

export const WithValue: Story = {
  args: {
    value: "김컴잇",
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    value: "비활성화",
  },
};
