import type { Meta, StoryObj } from "@storybook/react-vite";

import { ProfilePicture } from "./ProfilePicture";

const meta = {
  title: "Shared/UI/ProfilePicture",
  component: ProfilePicture,
  tags: ["autodocs"],
  argTypes: {
    imgURL: { control: "text" },
    alt: { control: "text" },
    isEditing: { control: "boolean" },
  },
} satisfies Meta<typeof ProfilePicture>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NoImage: Story = {
  args: {
    imgURL: null,
    isEditing: false,
  },
};

export const WithImage: Story = {
  args: {
    imgURL: "https://github.com/shadcn.png",
    alt: "User profile",
    isEditing: false,
  },
};

export const EditingMode: Story = {
  args: {
    imgURL: "https://github.com/shadcn.png",
    isEditing: true,
  },
};
