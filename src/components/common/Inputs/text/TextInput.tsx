import { Input } from "@/components/ui/input";
import { InputHTMLAttributes } from "react";

export default function TextInput({
  ...props
}: InputHTMLAttributes<HTMLInputElement>): JSX.Element {
  return (
    <>
      <Input {...props} data-testid={props.name} />
    </>
  );
}
