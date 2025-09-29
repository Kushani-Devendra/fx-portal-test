import React, { useState } from "react";
import "./App.scss";
import { Button } from "./shared/components/button/Button";
import { Mail, PenBox, Plus, Search, Settings, User } from "lucide-react";
import { TextField } from "./shared/components/textfield/Textfield";
import { Checkbox } from "./shared/components/checkbox/Checkbox";
import { RadioButton } from "./shared/components/radio/RadioButton";
import { Select } from "./shared/components/select/Select";
import { Switch } from "./shared/components/switch/Switch";

function App() {
  const [phoneCountry, setPhoneCountry] = useState("us");
  const [currency, setCurrency] = useState("usd");
  const [basicChecked, setBasicChecked] = useState(false);
  const [selectedValue, setSelectedValue] = useState("");

  const countryOptions = [
    { label: "+1 (US)", value: "us" },
    { label: "+44 (UK)", value: "uk" },
    { label: "+91 (IN)", value: "in" },
  ];

  const currencyOptions = [
    { label: "USD", value: "usd" },
    { label: "EUR", value: "eur" },
    { label: "GBP", value: "gbp" },
  ];

  const options = [
    {
      value: "user",
      label: "User Account",
      leadingIcon: <User size={16} />,
      subDescription: "Manage user settings",
    },
    {
      value: "settings",
      label: "System Settings",
      leadingIcon: <Settings size={16} />,
      subDescription: "Configure system preferences",
    },
    {
      value: "mail",
      label: "Mail Settings",
      leadingIcon: <Mail size={16} />,
    },
  ];

  return (
    <div
      style={{
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
      }}
    >
      {/* <Button variant={"primary"} size="md">
        Button
      </Button>
      <Button
        variant={"ghost"}
        size="sm"
        leadingIcon={<PenBox />}
        type="icon-only"
        aria-label="Edit"
      />
      <TextField
        label="Email"
        required
        placeholder="Enter your email"
        hintText="We'll never share your email"
      />
      <TextField
        type="leading-dropdown"
        label="Phone Number"
        dropdownOptions={countryOptions}
        selectedDropdownValue={phoneCountry}
        onDropdownChange={setPhoneCountry}
        placeholder="Enter phone number"
      />
      <TextField
        type="trailing-dropdown"
        label="Amount"
        dropdownOptions={currencyOptions}
        selectedDropdownValue={currency}
        onDropdownChange={setCurrency}
        placeholder="Enter amount"
        disabled
      />*/}
      {/* <TextField
        label="Password"
        destructive
        hintText="Password must be at least 8 characters"
        trailingIcon={<Search />}
      /> */}
      <>
        <Checkbox label="Email notifications" defaultChecked />
        <Checkbox label="SMS notifications" hintText="asd" />
        <Checkbox label="Push notifications" disabled />
      </>
      {/*   <RadioButton name="option" value="option1" label="Option 1" />
      <RadioButton
        name="option"
        value="option2"
        label="Option 2"
        hintText="This is a helpful hint"
      />
      <RadioButton
        name="option"
        value="option3"
        label="Option 3"
        destructive
        hintText="This option has an error"
      />*/}
      <RadioButton
        name="option"
        value="option4"
        label="Required Option"
        required
        hintText="sdfs"
        destructive
      />
      <Select
        label="Choose Option"
        options={options}
        value={selectedValue}
        onChange={setSelectedValue}
        placeholder="Select an option"
        destructive
        hintText="ada"
      />

      <Select
        label="Search Option"
        options={options}
        value={selectedValue}
        onChange={setSelectedValue}
        placeholder="Type to search..."
        autoComplete={true}
        required
      />
      <Switch
        label="Enable notifications"
        hintText="Turn on to receive updates"
      />

      <Switch
        label="Delete after 30 days"
        hintText="This action cannot be undone"
        destructive
      />

      <Switch label="Remember me" disabled />
    </div>
  );
}

export default App;
