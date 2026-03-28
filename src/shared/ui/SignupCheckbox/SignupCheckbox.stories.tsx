import { useState } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import { SignupCheckbox } from "./SignupCheckbox";

const InteractiveCheckboxStory = () => {
  const [checked, setChecked] = useState(false);

  return <SignupCheckbox checked={checked} onCheckedChange={setChecked} />;
};

const meta = {
  title: "shared/ui/signup/SignupCheckbox",
  component: SignupCheckbox,
  tags: ["autodocs"],
  args: {
    checked: false,
    disabled: false,
  },
} satisfies Meta<typeof SignupCheckbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Checked: Story = {
  args: {
    checked: true,
  },
};

export const Interactive: Story = {
  render: () => <InteractiveCheckboxStory />,
};
